// Footer of the public site (FE-18 v2, agere-org-landing-v2.html): the lockup and tagline, Product, Help and
// Legal links, the copyright line and the language switcher. The design's support address, legal entity and
// street address stay out until they exist (they are placeholders in the design).
import Link from "next/link";
import { ProductLogo } from "@/brand";
import type { Locale, MessageKey, translator } from "@/i18n";
import { LanguageSwitcher } from "@/app/language-switcher";
import { SHOW_PRICING, VISIBLE_LEGAL_DOCS } from "./content";

type T = ReturnType<typeof translator>;
const link = "inline-flex min-h-7 items-center rounded-sm text-[13px] hover:underline focus-ring aria-[current=page]:font-medium";

export function SiteFooter({ t, locale, current }: { t: T; locale: Locale; current: string }) {
  const productLinks = [
    { href: "/", text: t("public.nav.home") },
    ...(SHOW_PRICING ? [{ href: "/harga", text: t("public.nav.pricing") }] : []),
    { href: "/early-bird", text: t("site.nav.earlyBird") },
  ];
  const groups: { label: MessageKey; links: { href: string; text: string }[] }[] = [
    { label: "footer.product", links: productLinks },
    { label: "footer.help", links: [{ href: "/#faq", text: t("footer.faq") }] },
    { label: "footer.legal", links: VISIBLE_LEGAL_DOCS.map((d) => ({ href: d.slug === "early-bird" ? "/early-bird#syarat" : `/${d.slug}`, text: t(d.title) })) },
  ];
  return (
    <footer className="border-t border-default bg-muted">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-12 md:px-8">
        <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
          <div className="flex flex-col items-start gap-3">
            <ProductLogo height={24} />
            <p className="max-w-[320px] text-[13px] text-subtle">{t("footer.tagline")}</p>
          </div>
          {groups.map((g) => (
            <nav key={g.label} aria-label={t(g.label)} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-subtle">{t(g.label)}</span>
              {g.links.map((l) => (
                <Link key={l.href} href={l.href} aria-current={l.href === current ? "page" : undefined} className={link}>
                  {l.text}
                </Link>
              ))}
            </nav>
          ))}
        </div>
        <div className="flex flex-col gap-4 border-t border-default pt-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <span>{t("footer.copyright", String(new Date().getFullYear()))}</span>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </footer>
  );
}
