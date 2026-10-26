"use client";

// Header of the public site (FE-18 v2, agere-org-landing-v2.html): the agere lockup, section links, the
// language switch (EN by default, PO 7 Oct 2026), theme toggle, Masuk (hidden for now, SHOW_SIGN_IN) and
// "Daftar early bird"; below 768 px the
// links move into a menu. Links appear as their sections ship, so the header never points at a section that is
// not there yet.
import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ProductLogo } from "@/brand";
import { Button } from "@/components/ui/button";
import { translator, type Locale } from "@/i18n";
import { LanguageSwitcher } from "@/app/language-switcher";
import { ThemeSwitcher } from "@/app/theme-switcher";
import { SHOW_SIGN_IN, SITE_NAV } from "./content";

const link = "inline-flex h-8 items-center rounded-md px-2.5 text-sm font-medium text-subtle hover:bg-subtle hover:text-emphasis focus-ring aria-[current=page]:bg-subtle aria-[current=page]:text-emphasis";

export function SiteHeader({ locale, current }: { locale: Locale; current: string }) {
  const t = translator(locale);
  const [open, setOpen] = React.useState(false);
  const here = (href: string) => (href === current ? "page" : undefined);
  return (
    <header className="sticky top-0 z-header border-b border-default bg-default">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-6 px-4 md:px-8">
        <Link href="/" aria-label={t("site.home")} className="inline-flex h-10 items-center rounded-sm focus-ring">
          <ProductLogo height={24} title="" />
        </Link>
        <nav aria-label={t("site.nav.label")} className="hidden grow items-center gap-0.5 md:flex">
          {SITE_NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={here(n.href)} className={link}>
              {t(n.key)}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher locale={locale} compact />
          <ThemeSwitcher locale={locale} />
          {SHOW_SIGN_IN && (
            <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
              <Link href="/masuk">{t("public.nav.signIn")}</Link>
            </Button>
          )}
          <Button asChild variant="secondary" size="sm" className="max-md:hidden">
            <Link href="/early-bird">{t("site.cta.earlyBird")}</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={t(open ? "site.menu.close" : "site.menu.open")}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav id="site-menu" aria-label={t("site.nav.mobile")} className="flex flex-col border-t border-default px-4 pb-4 pt-2 md:hidden">
          {SITE_NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={here(n.href)} className="flex min-h-11 items-center rounded-md px-2 text-base font-medium hover:bg-subtle focus-ring">
              {t(n.key)}
            </Link>
          ))}
          {SHOW_SIGN_IN && (
            <Link href="/masuk" className="flex min-h-11 items-center rounded-md px-2 text-base font-medium hover:bg-subtle focus-ring">
              {t("public.nav.signIn")}
            </Link>
          )}
          <Button asChild className="mt-2">
            <Link href="/early-bird">{t("site.cta.earlyBird")}</Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
