import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLocale, getTranslator } from "@/i18n/server";
import { cn } from "@/lib/utils";
import { formatMoney, formatNumber } from "@/i18n/format";
import { PLANS, TRIAL_DAYS, UPCOMING_PLANS } from "@/modules/billing/plans";
import { PRICING_ROWS, type Cell } from "@/ui/public/content";
import { PricingSection } from "@/ui/public/pricing-section";
import { PublicFrame } from "@/ui/public/public-frame";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t("pricing.title"), description: t("pricing.lead") };
}

/** Public pricing (FE-18 v2, PRD-20 §5.2 as amended by D149): the Harga section of the site, then Tim (which the
 *  14-day trial holds too) next to Bisnis, which is not sold yet and is marked "Segera hadir" (D109; PO 19 Oct
 *  2026). Until the app opens, Tim carries the same mark (PO, 21 Oct 2026). Later apps carry the same mark per row. */
export default async function Pricing() {
  const [locale, t] = await Promise.all([getLocale(), getTranslator()]);
  const cell = (c: Cell) => (c.arg === undefined ? t(c.key) : t(c.key, String(c.arg)));
  return (
    <PublicFrame t={t} locale={locale} current="/harga" width="max-w-[1200px]" bare>
      <section aria-labelledby="harga-title" className="py-12 md:py-16">
        <PricingSection locale={locale} heading="h1" />
      </section>
      <section aria-labelledby="pricing-compare" className="mx-auto grid max-w-4xl gap-3 px-4 pb-16">
        <h2 id="pricing-compare" className="type-heading-sm text-emphasis">{t("pricing.compare")}</h2>
        <p className="text-sm text-subtle">{t("pricing.compareLead", formatNumber(locale, TRIAL_DAYS))}</p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="align-top">{t("pricing.feature")}</TableHead>
                {[
                  { id: "team", name: t("pricing.team.name"), price: PLANS.team.price.yearly, soon: true },
                  { id: "business", name: t("pricing.business.name"), price: UPCOMING_PLANS.business.price.yearly, soon: true },
                ].map((p) => (
                  <TableHead key={p.id} scope="col" className="h-auto w-[30%] whitespace-normal py-2 align-top">
                    <span className="flex flex-wrap items-center gap-2">
                      {p.name}
                      {p.soon && <Badge variant="gray">{t("pricing.soon")}</Badge>}
                    </span>
                    <span className="block font-normal text-subtle">{t("pricing.perSeatYearly", formatMoney(locale, p.price))}</span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRICING_ROWS.map((r) => (
                <TableRow key={r.id}>
                  <TableHead scope="row" className="h-auto whitespace-normal py-2 font-normal">
                    <span className="flex flex-wrap items-center gap-2">
                      {t(r.label)}
                      {r.soon && <Badge variant="gray">{t("pricing.soon")}</Badge>}
                    </span>
                  </TableHead>
                  <TableCell className={cn("whitespace-normal", r.soon && "text-subtle")}>{cell(r.team)}</TableCell>
                  <TableCell className={cn("whitespace-normal", r.soon && "text-subtle")}>{cell(r.business)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-subtle">{t("pricing.businessNote")}</p>
        <p className="text-sm text-subtle">{t("pricing.soonNote")}</p>
      </section>
    </PublicFrame>
  );
}
