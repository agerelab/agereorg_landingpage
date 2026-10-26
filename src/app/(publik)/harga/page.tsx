import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLocale, getTranslator } from "@/i18n/server";
import { PRICING_ROWS, SHOW_PRICING, type Cell } from "@/ui/public/content";
import { PricingSection } from "@/ui/public/pricing-section";
import { PublicFrame } from "@/ui/public/public-frame";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t("pricing.title"), description: t("pricing.lead") };
}

/** Public pricing (FE-18 v2, PRD-20 §5.2): the Harga section of the site, then the full comparison with later apps marked "Segera hadir". */
export default async function Pricing() {
  if (!SHOW_PRICING) {
    redirect("/");
  }
  const [locale, t] = await Promise.all([getLocale(), getTranslator()]);
  const cell = (c: Cell) => (c.arg === undefined ? t(c.key) : t(c.key, String(c.arg)));
  return (
    <PublicFrame t={t} locale={locale} current="/harga" width="max-w-[1200px]" bare>
      <section aria-labelledby="harga-title" className="py-12 md:py-16">
        <PricingSection locale={locale} heading="h1" />
      </section>
      <section aria-labelledby="pricing-compare" className="mx-auto grid max-w-4xl gap-3 px-4 pb-16">
        <h2 id="pricing-compare" className="type-heading-sm text-emphasis">{t("pricing.compare")}</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">{t("pricing.feature")}</TableHead>
                <TableHead scope="col">{t("pricing.free.name")}</TableHead>
                <TableHead scope="col">{t("pricing.team.name")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PRICING_ROWS.map((r) => (
                <TableRow key={r.id}>
                  <TableHead scope="row" className="font-normal">
                    <span className="flex flex-wrap items-center gap-2">
                      {t(r.label)}
                      {r.soon && <Badge variant="gray">{t("pricing.soon")}</Badge>}
                    </span>
                  </TableHead>
                  <TableCell className={r.soon ? "text-subtle" : undefined}>{cell(r.free)}</TableCell>
                  <TableCell className={r.soon ? "text-subtle" : undefined}>{cell(r.team)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-subtle">{t("pricing.soonNote")}</p>
      </section>
    </PublicFrame>
  );
}
