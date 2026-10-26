// Frame of the public pages (FE-18): landing, pricing and the legal pages. The site header (v2) at the
// top, the site footer (v2) at the bottom, from agere-org-landing-v2.html; readable without an account.
import type { Locale, translator } from "@/i18n";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type T = ReturnType<typeof translator>;

/** `bare`: the page lays out its own full-width sections (the home page); otherwise one centred column. */
export function PublicFrame({ t, locale, current, width = "max-w-2xl", bare = false, children }: { t: T; locale: Locale; current: string; width?: string; bare?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-default">
      <a href="#content" className="fixed left-4 top-[-60px] z-toast rounded-md bg-inverted px-3 py-2 text-sm text-inverted focus:top-3">
        {t("shell.skip")}
      </a>
      <SiteHeader locale={locale} current={current} />
      <main id="content" tabIndex={-1} className={bare ? "flex-1 outline-none" : `mx-auto grid w-full ${width} flex-1 content-start gap-6 px-4 py-12 outline-none`}>
        {children}
      </main>
      <SiteFooter t={t} locale={locale} current={current} />
    </div>
  );
}
