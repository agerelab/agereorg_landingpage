"use server";
// Header preferences of the public site (PRD-12 §5.3, D45): the language switch and the theme toggle.
// The landing page has no accounts, so both are kept in a cookie only (the app also saves them to the
// signed-in user's profile; that half stays in agere-org-V1).
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isLocale, type Locale, type MessageKey } from "@/i18n";
import { COOKIE } from "@/ui/shell/cookies";

export type PreferenceResult = { ok: true; message?: MessageKey } | { ok: false; error: MessageKey };
export type Theme = "light" | "dark" | "system";

const ONE_YEAR = 60 * 60 * 24 * 365;

const done = (): PreferenceResult => {
  revalidatePath("/", "layout");
  return { ok: true, message: "settings.saved" };
};

export async function setThemeAction(theme: Theme): Promise<PreferenceResult> {
  if (theme === "light" || theme === "dark") (await cookies()).set(COOKIE.theme, theme, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
  return done();
}

export async function setLanguageAction(locale: Locale): Promise<PreferenceResult> {
  if (!isLocale(locale)) return { ok: false, error: "settings.saveFailed" };
  (await cookies()).set(COOKIE.lang, locale, { path: "/", maxAge: ONE_YEAR, sameSite: "lax" });
  return done();
}
