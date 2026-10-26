"use client";

// The agere error page (PRD-22 §2 R5, D128): Agere DS EmptyState in the reader's language with "Coba lagi"
// and "Ke Desk", used by app/error.tsx and app/global-error.tsx so the framework's page never shows.
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { isLocale, translator, type Locale } from "@/i18n";

/** The reader's language without the server: <html lang>, else the language cookie, else English. */
export function clientLocale(): Locale {
  if (typeof document === "undefined") return "en";
  const lang = document.documentElement.lang;
  if (isLocale(lang)) return lang;
  const cookie = document.cookie.match(/(?:^|;\s*)agere-lang=([^;]+)/)?.[1];
  return isLocale(cookie) ? cookie : "en";
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  const t = translator(clientLocale());
  return (
    <main id="content" className="grid min-h-dvh place-items-center bg-default px-4">
      <EmptyState
        icon={<AlertTriangle aria-hidden />}
        title={t("error.title")}
        description={t("error.body")}
        headingLevel="h2"
        actions={
          <>
            <Button onClick={onRetry}>{t("common.retry")}</Button>
            <Button variant="outline" asChild>
              <Link href="/">{t("error.toDesk")}</Link>
            </Button>
          </>
        }
      />
    </main>
  );
}
