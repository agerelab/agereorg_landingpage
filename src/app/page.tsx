import type { Metadata } from "next";
import { getLocale, getTranslator } from "@/i18n/server";
import { ControlSection } from "@/ui/public/control-section";
import { DeskMock } from "@/ui/public/desk-mock";
import { AiSection, ProductivitySection } from "@/ui/public/features/sections";
import { EarlyBirdTeaser, Faq, Hero, Problem } from "@/ui/public/landing";
import { PublicFrame } from "@/ui/public/public-frame";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslator();
  return { title: t("hero.title"), description: t("hero.lead") };
}

/** Root Landing (FE-18, agereorg.com): the public home at "/". */
export default async function Home() {
  const [locale, t] = await Promise.all([getLocale(), getTranslator()]);
  return (
    <PublicFrame t={t} locale={locale} current="/" width="max-w-[1200px]" bare>
      <Hero t={t} mock={<DeskMock t={t} locale={locale} />} />
      <Problem t={t} />
      <ProductivitySection t={t} />
      <AiSection t={t} />
      <ControlSection t={t} />
      <EarlyBirdTeaser t={t} locale={locale} />
      <Faq locale={locale} />
    </PublicFrame>
  );
}
