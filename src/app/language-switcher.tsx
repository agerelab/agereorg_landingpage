"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { LOCALES, translator, type Locale } from "@/i18n";
import { setLanguageAction } from "@/app/actions";
import { callAction } from "@/lib/network";

/**
 * Language switcher on signed-out pages (UI-01 "Bahasa & format"): language names in their own language in a
 * footer, or `compact` codes (EN / ID) in a header, each still named in full for assistive tech.
 */
export function LanguageSwitcher({ locale, compact }: { locale: Locale; compact?: boolean }) {
  const router = useRouter();
  const t = translator(locale);
  // Saved in a cookie, and for a signed-in person as their preference too (D45).
  const pick = async (l: Locale) => {
    const r = await callAction(() => setLanguageAction(l));
    // Offline (D128): say so in the current language instead of refreshing into nothing.
    if (!r.ok) return void toast.error(t(r.error));
    router.refresh();
  };
  return (
    <nav aria-label={t("language.label")} className={compact ? "flex items-center rounded-md bg-muted p-0.5 text-xs" : "flex gap-3 text-sm"}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          aria-label={compact ? translator(l)(`language.${l}`) : undefined}
          onClick={() => pick(l)}
          className={
            compact
              ? "inline-flex h-7 min-w-8 items-center justify-center rounded px-1.5 font-medium text-subtle hover:text-emphasis focus-ring aria-[current=true]:bg-default aria-[current=true]:text-emphasis aria-[current=true]:shadow-sm"
              : "rounded-sm text-subtle hover:text-emphasis focus-ring aria-[current=true]:font-medium aria-[current=true]:text-emphasis"
          }
        >
          {compact ? l.toUpperCase() : translator(l)(`language.${l}`)}
        </button>
      ))}
    </nav>
  );
}
