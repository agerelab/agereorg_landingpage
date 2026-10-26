"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { translator, type Locale } from "@/i18n";
import { setThemeAction } from "@/app/actions";
import { InitialThemeContext } from "@/app/providers";
import { callAction } from "@/lib/network";

/**
 * Footer theme toggle on signed-out pages (D122, D125): light by default, one click to dark and back. Saved in
 * the theme cookie (and as the preference once signed in), so the next visit starts the same way.
 */
export function ThemeSwitcher({ locale }: { locale: Locale }) {
  const t = translator(locale);
  // The server already knows the theme it rendered: start from it, so the label and icon are right
  // before hydration (a visitor who chose the other theme no longer sees the wrong label first).
  const initial = React.useContext(InitialThemeContext);
  const theme = React.useSyncExternalStore(
    (notify) => {
      const o = new MutationObserver(notify);
      o.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      return () => o.disconnect();
    },
    () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light"),
    () => initial,
  );
  const next = theme === "dark" ? "light" : "dark";
  return (
    <Button
      variant="minimal"
      size="icon-sm"
      aria-label={t(theme === "dark" ? "shell.lightTheme" : "shell.darkTheme")}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        void callAction(() => setThemeAction(next));
      }}
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
