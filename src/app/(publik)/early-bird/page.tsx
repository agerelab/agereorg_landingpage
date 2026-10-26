import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { getLocale, getTranslator } from "@/i18n/server";
import { formatIsoDate, formatMoney, formatNumber } from "@/i18n/format";
import { EARLY_BIRD, PLANS } from "@/modules/billing/plans";
import { docLang } from "@/ui/legal/docs";
import { LegalDocument, type LegalSearchParams } from "@/ui/legal/legal-page";
import { EarlyBirdForm } from "@/ui/public/early-bird-form";
import { PublicFrame } from "@/ui/public/public-frame";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t("eb.title"), description: t("eb.lead", String(EARLY_BIRD.freeDays), String(EARLY_BIRD.priceLockMonths)) };
}

/** Early bird program (FE-18 v2, D113, D131): what it offers, who it is for, the sign-up form and the terms
 *  (D134: the final Early Bird Program Terms, in Indonesian unless the reader picks English). */
export default async function EarlyBird({ searchParams }: { searchParams: LegalSearchParams }) {
  const [locale, t, params] = await Promise.all([getLocale(), getTranslator(), searchParams]);
  const E = EARLY_BIRD;
  const stats = [
    [t("eb.s.days", String(E.freeDays)), t("eb.s.daysLabel")],
    [formatNumber(locale, E.credits.perMember), t("eb.s.creditsLabel", formatNumber(locale, E.credits.min), formatNumber(locale, E.credits.max))],
    [formatMoney(locale, PLANS.team.price.yearly), t("eb.s.yearlyLabel", String(E.priceLockMonths))],
    [formatMoney(locale, PLANS.team.price.monthly), t("eb.s.monthlyLabel", String(E.priceLockMonths))],
  ];
  return (
    <PublicFrame t={t} locale={locale} current="/early-bird" width="max-w-[1200px]" bare>
      <section className="mx-auto max-w-[1200px] px-4 pb-16 pt-12 md:px-8 md:pb-24">
        <nav aria-label={t("eb.crumb")} className="flex items-center gap-1.5 text-[13px] text-subtle">
          <Link href="/" className="rounded-sm hover:text-emphasis hover:underline focus-ring">{t("public.nav.home")}</Link>
          <span aria-hidden>/</span>
          <span aria-current="page">{t("site.nav.earlyBird")}</span>
        </nav>
        <div className="mt-6 grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex flex-col gap-6">
            <span className="inline-flex h-7 items-center gap-2 self-start rounded-full border border-default bg-muted px-3 text-xs font-medium text-subtle">
              <span aria-hidden className="size-2 rounded-full bg-brand-accent" />
              {t("eb.pill", String(E.places), formatIsoDate(locale, E.closesOn))}
            </span>
            <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-emphasis md:text-5xl">{t("eb.title")}</h1>
            <p className="text-base text-subtle md:text-lg">{t("eb.lead", String(E.freeDays), String(E.priceLockMonths))}</p>
            <dl className="grid grid-cols-2 gap-3">
              {stats.map(([value, label]) => (
                <div key={label} className="flex flex-col-reverse justify-end gap-1 rounded-lg border border-default bg-default p-4">
                  <dt className="text-[13px] leading-[18px] text-subtle">{label}</dt>
                  <dd className="text-2xl font-bold tabular-nums tracking-[-0.05em] text-emphasis md:text-3xl">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3">
              <h2 className="text-base font-semibold tracking-[-0.025em] text-emphasis">{t("eb.fit.title")}</h2>
              <ul className="flex flex-col gap-2.5 text-sm">
                {[t("eb.fit.1", String(E.minPeople), String(E.maxPeople)), t("eb.fit.2"), t("eb.fit.3")].map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success-on-surface" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <EarlyBirdForm locale={locale} />
        </div>
      </section>
      <section id="syarat" className="scroll-mt-20 border-y border-default bg-muted py-16">
        <div className="mx-auto max-w-[720px] px-4 md:px-8">
          <LegalDocument t={t} slug="early-bird" lang={docLang(params.lang)} base="/early-bird" anchor="#syarat" level={2} />
        </div>
      </section>
    </PublicFrame>
  );
}
