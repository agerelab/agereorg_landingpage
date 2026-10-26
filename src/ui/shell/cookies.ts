// Per-browser UI preferences until user_preferences exist (PRD-12). Read on the server so the first
// paint is already right (no flash).
// The theme cookie is renamed with each default-theme decision so that a choice saved under the previous
// default is ignored and every browser starts on the new default: D125 (light again, supersedes D122).
export const COOKIE = { lang: "agere-lang", theme: "agere-theme-d125", panel: "agere-panel" } as const;

export function setPreferenceCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}
