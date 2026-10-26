// The early bird decision link (FE-18, PO 13 Oct 2026). The site has no database before launch (D138), so
// the link in the team email carries the application itself, sealed with AES-256-GCM under a key derived
// from EARLY_BIRD_SECRET: unreadable and unchangeable without it, and valid for 30 days. Without a secret
// there are no links; the team then replies by hand.
import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { translator, type Locale } from "@/i18n";
import { formatIsoDate, formatNumber } from "@/i18n/format";
import { EARLY_BIRD, TRIAL_DAYS } from "@/modules/billing/plans";
import { ROLES, SUPPORT_EMAIL, TEAM_SIZES } from "./early-bird";

export const DECISION_DAYS = 30;
export const DECISIONS = ["accept", "deny"] as const;
export type Decision = (typeof DECISIONS)[number];
export type Applicant = { email: string; name: string; organization: string; size: string; role: string; lang: Locale };

const key = () => {
  const secret = process.env.EARLY_BIRD_SECRET ?? "";
  return secret.length >= 32 ? createHash("sha256").update(secret).digest() : null;
};

/** The sealed application for the decision links, or null when EARLY_BIRD_SECRET is missing or short. */
export function sealApplicant(a: Applicant, now = Date.now()): string | null {
  const k = key();
  if (!k) return null;
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", k, iv);
  const body = Buffer.concat([cipher.update(JSON.stringify({ ...a, exp: now + DECISION_DAYS * 864e5 }), "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), body]).toString("base64url");
}

/** The application inside a decision link; null when it was changed, has expired or cannot be opened. */
export function openApplicant(token: string, now = Date.now()): Applicant | null {
  const k = key();
  const raw = Buffer.from(token, "base64url");
  if (!k || raw.length < 29) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", k, raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const p = JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8"));
    const known = (TEAM_SIZES as readonly string[]).includes(p.size) && (ROLES as readonly string[]).includes(p.role);
    if (typeof p.exp !== "number" || p.exp < now || !known) return null;
    return { email: String(p.email), name: String(p.name), organization: String(p.organization), size: p.size, role: p.role, lang: p.lang === "en" ? "en" : "id" };
  } catch {
    return null;
  }
}

export const isDecision = (d: string): d is Decision => (DECISIONS as readonly string[]).includes(d);

/** Non-selected applications are deleted 90 days after applications close (Privacy Policy §10). */
const deletedOn = () => new Date(Date.parse(EARLY_BIRD.closesOn) + 90 * 864e5).toISOString().slice(0, 10);

/** The decision email in the applicant's language, shown on the decision page and then sent. "accept"
 *  invites to the 30-minute intro call (Early Bird Program Terms 1.2), with the booking page when
 *  EARLY_BIRD_BOOKING_URL is set; "deny" declines politely and says when the application is deleted. */
export function decisionMail(a: Applicant, d: Decision, base: string) {
  const t = translator(a.lang);
  const privacy = `${base}/privasi${a.lang === "en" ? "?lang=en" : ""}`;
  const booking = process.env.EARLY_BIRD_BOOKING_URL?.startsWith("https://") ? process.env.EARLY_BIRD_BOOKING_URL : "";
  const places = formatNumber(a.lang, EARLY_BIRD.places);
  return d === "accept"
    ? {
        subject: t("eb.invite.subject"),
        text: t("eb.invite.body", a.name, a.organization, booking ? t("eb.invite.book", booking) : t("eb.invite.reply"), places),
        links: booking ? [booking, SUPPORT_EMAIL] : [SUPPORT_EMAIL],
      }
    : {
        subject: t("eb.decline.subject"),
        text: t("eb.decline.body", a.name, a.organization, places, String(TRIAL_DAYS), formatIsoDate(a.lang, deletedOn()), privacy),
        links: [privacy, SUPPORT_EMAIL],
      };
}

/** The two links for the team email, or null without EARLY_BIRD_SECRET. */
export function decisionLinks(a: Applicant, base: string) {
  const token = sealApplicant(a);
  return token ? { accept: `${base}/early-bird/keputusan?d=accept&t=${token}`, deny: `${base}/early-bird/keputusan?d=deny&t=${token}` } : null;
}
