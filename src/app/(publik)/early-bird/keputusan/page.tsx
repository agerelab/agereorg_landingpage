import type { Metadata } from "next";
import { getLocale, getTranslator } from "@/i18n/server";
import { appUrl } from "@/lib/app-url";
import { decisionMail, isDecision, openApplicant } from "@/ui/public/early-bird-decision";
import { DecisionForm } from "@/ui/public/early-bird-decision-form";
import { PublicFrame } from "@/ui/public/public-frame";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t("ebd.meta"), robots: { index: false, follow: false }, referrer: "no-referrer" };
}

/** Early bird decision (FE-18, PO 13 Oct 2026): the team opens it from "Undang ke panggilan" or "Tolak" in
 *  the application email, sees the email the applicant will get, and sends it with the one button. A
 *  changed or expired link (30 days) shows why it cannot be used. Not for search engines (seo.ts). */
export default async function EarlyBirdDecision({ searchParams }: { searchParams: Promise<{ t?: string; d?: string }> }) {
  const [locale, t, params] = await Promise.all([getLocale(), getTranslator(), searchParams]);
  const token = typeof params.t === "string" ? params.t : "";
  const decision = typeof params.d === "string" ? params.d : "";
  const a = openApplicant(token);

  if (!a || !isDecision(decision))
    return (
      <PublicFrame t={t} locale={locale} current="/early-bird">
        <h1 className="text-2xl font-semibold tracking-[-0.025em] text-emphasis">{t("ebd.invalid")}</h1>
        <p className="text-sm text-subtle">{t("ebd.err.invalid")}</p>
      </PublicFrame>
    );

  const mail = decisionMail(a, decision, await appUrl());
  return (
    <PublicFrame t={t} locale={locale} current="/early-bird">
      <div className="flex flex-col gap-2">
        <h1 className="text-balance text-2xl font-semibold tracking-[-0.025em] text-emphasis">
          {t(decision === "accept" ? "ebd.title.accept" : "ebd.title.deny", a.organization)}
        </h1>
        <p className="text-sm text-subtle">{t("ebd.lead", a.email, t(a.lang === "en" ? "language.en" : "language.id"))}</p>
      </div>
      <section aria-labelledby="ebd-preview" className="flex flex-col gap-3 rounded-lg border border-default bg-muted p-5">
        <h2 id="ebd-preview" className="text-[13px] font-medium text-subtle">{t("ebd.preview")}</h2>
        <p className="text-sm font-semibold text-emphasis">{mail.subject}</p>
        <p lang={a.lang} className="whitespace-pre-line break-words text-sm text-default">{mail.text}</p>
      </section>
      <DecisionForm token={token} decision={decision} locale={locale} />
    </PublicFrame>
  );
}
