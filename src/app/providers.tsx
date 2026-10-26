"use client";

import * as React from "react";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Locale } from "@/i18n";
import { OfflineBanner } from "@/ui/shell/offline-banner";

/** The theme the server rendered (<html data-theme>), so client controls start in sync before hydration. */
export const InitialThemeContext = React.createContext<"light" | "dark">("light");

/** The only client boundary at the root. Toasts sit bottom-left (UI-01 "Toast & simpan"). */
export function Providers({ theme, locale, children }: { theme: "light" | "dark"; locale: Locale; children: React.ReactNode }) {
  return (
    <InitialThemeContext.Provider value={theme}>
      <TooltipProvider delayDuration={300}>
        {children}
        <Toaster position="bottom-left" />
        <OfflineBanner locale={locale} />
      </TooltipProvider>
    </InitialThemeContext.Provider>
  );
}
