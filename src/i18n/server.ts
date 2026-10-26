import "server-only";
import { cookies } from "next/headers";
import { COOKIE } from "@/ui/shell/cookies";
import { resolveLocale, translator, type Locale } from "./index";

/**
 * The reader's language (PRD-12 v1.2.3, D45): the switcher's cookie, else English.
 * The landing page has no session, so the signed-in preference the app reads first does not apply here.
 */
export async function getLocale(): Promise<Locale> {
  return resolveLocale((await cookies()).get(COOKIE.lang)?.value);
}

export async function getTranslator() {
  return translator(await getLocale());
}

export type ThemePreference = "light" | "dark" | "system";

/** Theme (PRD-12 §5.3): the header toggle's cookie; light by default (D125). */
export async function getThemePreference(): Promise<ThemePreference> {
  return (await cookies()).get(COOKIE.theme)?.value === "dark" ? "dark" : "light";
}

/** The theme to render on the server. */
export async function getTheme(): Promise<"light" | "dark"> {
  return (await getThemePreference()) === "dark" ? "dark" : "light";
}
