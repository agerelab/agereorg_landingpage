// Sections of the public home page (FE-18 v2, agere-org-landing-v2.html), built from Agere DS tokens and
// components. Numbers come from src/modules/billing/plans.ts; copy from the catalogs (en source, id); the
// FAQ from the legal content package (D134), verbatim, in the reader's language.
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { Locale, translator } from "@/i18n";
import { formatIsoDate, formatNumber } from "@/i18n/format";
import { EARLY_BIRD, PLANS, TRIAL_DAYS } from "@/modules/billing/plans";
import { loadFaq } from "@/ui/legal/content";
import { PROBLEMS } from "./content";

type T = ReturnType<typeof translator>;

export function Hero({ t, mock }: { t: T; mock?: React.ReactNode }) {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex max-w-[880px] flex-col items-start gap-6">
          <span className="inline-flex h-7 items-center gap-2 rounded-full border border-default bg-muted px-3 text-xs font-medium text-subtle">
            <span aria-hidden className="size-2 rounded-full bg-brand-accent" />
            {t("hero.pill", String(EARLY_BIRD.places))}
          </span>
          <h1 className="text-balance text-4xl font-semibold tracking-[-0.05em] text-emphasis md:text-[60px] md:leading-[68px]">{t("hero.title")}</h1>
          <p className="max-w-[680px] text-base text-subtle md:text-lg">{t("hero.lead")}</p>
          <div className="flex w-full flex-col gap-3 pt-2 sm:w-auto sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <Link href="/early-bird">
                {t("site.cta.earlyBird")}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#masalah">{t("hero.ctaHow")}</Link>
            </Button>
          </div>
          <p className="text-[13px] leading-[18px] text-subtle">{t("hero.meta", String(PLANS.free.maxSeats), String(TRIAL_DAYS))}</p>
        </div>
        {mock}
      </div>
    </section>
  );
}

export function Problem({ t }: { t: T }) {
  return (
    <section id="masalah" aria-labelledby="masalah-title" className="scroll-mt-20 border-y border-default bg-muted py-16 md:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 md:px-8">
        <div className="flex max-w-[720px] flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-subtle">{t("problem.eyebrow")}</span>
          <h2 id="masalah-title" className="text-balance text-3xl font-semibold tracking-[-0.05em] text-emphasis md:text-4xl">{t("problem.title")}</h2>
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <li key={p.title} className="flex flex-col gap-2 border-t border-emphasis pt-5">
              <h3 className="text-base font-semibold tracking-[-0.025em] text-emphasis">{t(p.title)}</h3>
              <p className="text-sm text-subtle">{t(p.body)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function EarlyBirdTeaser({ t, locale }: { t: T; locale: Locale }) {
  const E = EARLY_BIRD;
  const stats = [
    [t("eb.s.days", String(E.freeDays)), t("ebt.stat.days")],
    [formatNumber(locale, E.credits.perMember), t("eb.s.creditsLabel", formatNumber(locale, E.credits.min), formatNumber(locale, E.credits.max))],
    [t("ebt.stat.months", String(E.priceLockMonths)), t("ebt.stat.lock")],
    [String(E.places), t("ebt.stat.places")],
  ];
  const steps = [
    [t("ebt.s1.when", formatIsoDate(locale, E.closesOn)), t("ebt.s1.body")],
    [t("ebt.s2.when"), t("ebt.s2.body")],
    [t("ebt.s3.when", String(E.freeDays)), t("ebt.s3.body")],
  ];
  return (
    <section id="early-bird" aria-labelledby="ebt-title" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto grid max-w-[1200px] items-start gap-12 px-4 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col items-start gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-subtle">{t("ebt.eyebrow")}</span>
          <h2 id="ebt-title" className="text-balance text-3xl font-semibold tracking-[-0.05em] text-emphasis md:text-4xl">{t("ebt.title", String(E.places))}</h2>
          <p className="text-base text-subtle">{t("ebt.body", String(E.places), String(E.minPeople), String(E.maxPeople))}</p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button asChild size="lg"><Link href="/early-bird">{t("site.cta.earlyBird")}<ArrowRight aria-hidden /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/early-bird#syarat">{t("ebt.terms")}</Link></Button>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stats.map(([value, label]) => (
              <div key={label} className="flex flex-col-reverse justify-end gap-1 rounded-lg border border-default bg-default p-4">
                <dt className="text-[13px] leading-[18px] text-subtle">{label}</dt>
                <dd className="text-3xl font-bold tabular-nums tracking-[-0.05em] text-emphasis">{value}</dd>
              </div>
            ))}
          </dl>
          <ol aria-label={t("ebt.timeline")} className="flex flex-col">
            {steps.map(([when, body], i) => (
              <li key={when} className="relative grid grid-cols-[20px_minmax(0,1fr)] gap-3 pb-5 last:pb-0">
                {i < steps.length - 1 && <span aria-hidden className="absolute bottom-0 left-[9px] top-5 border-l border-emphasis" />}
                <span aria-hidden className="grid size-5 place-items-center rounded-full border-[1.5px] border-[hsl(var(--ag-fg-default))] bg-default text-[10px] font-semibold">{i + 1}</span>
                <div>
                  <div className="text-sm font-semibold text-emphasis">{when}</div>
                  <p className="text-sm text-subtle">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Faq({ locale }: { locale: Locale }) {
  const faq = loadFaq(locale);
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-20 pb-16 md:pb-24">
      <div className="mx-auto flex max-w-[800px] flex-col gap-6 px-4 md:px-8">
        <h2 id="faq-title" className="text-2xl font-semibold tracking-[-0.05em] text-emphasis md:text-3xl">{faq.title}</h2>
        <Accordion type="multiple" className="border-t border-default">
          {faq.items.map((f) => (
            <AccordionItem key={f.q} value={f.q}>
              <AccordionTrigger className="text-base font-semibold tracking-[-0.025em]">{f.q}</AccordionTrigger>
              <AccordionContent className="max-w-[680px] text-sm leading-[22px] text-subtle">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
