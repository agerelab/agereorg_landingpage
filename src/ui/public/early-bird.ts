// The early bird sign-up form (FE-18 v2; D113, D131): its fields, the checks the server repeats, and where
// applications go. Shared by the form (client) and the action (server); no secrets here.
import type { MessageKey } from "@/i18n";

/** Team inbox that receives applications (PO, 7 Oct 2026); the environment may point elsewhere. */
export const EARLY_BIRD_INBOX = process.env.EARLY_BIRD_INBOX || "agereorg@gmail.com";

/** Where applicants' replies go: the one address the legal documents use (D134). */
export const SUPPORT_EMAIL = "support@agereorg.com";

export const TEAM_SIZES = ["1-2", "3-5", "6-10", "11-15", "16+"] as const;
export const ROLES = ["owner", "lead", "ops", "other"] as const;

export type EarlyBirdField = "email" | "name" | "organization" | "size" | "role" | "agree";
export type EarlyBirdValues = Record<EarlyBirdField, string>;
export type EarlyBirdState =
  | Record<string, never>
  | { ok: true; email: string }
  | { ok: false; fields?: Partial<Record<EarlyBirdField, MessageKey>>; error?: MessageKey; values?: Partial<EarlyBirdValues> };

/** Outside 3–15 people: still accepted, the page points to other options (the design's note). */
export const outsideProgram = (size: string) => size === "1-2" || size === "16+";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const text = (v: string, max: number) => v.trim().length > 0 && v.trim().length <= max;

export function checkEarlyBird(v: Partial<EarlyBirdValues>): Partial<Record<EarlyBirdField, MessageKey>> {
  const fields: Partial<Record<EarlyBirdField, MessageKey>> = {};
  const email = (v.email ?? "").trim();
  if (!EMAIL.test(email) || email.length > 120) fields.email = "eb.err.email";
  if (!text(v.name ?? "", 80)) fields.name = "eb.err.name";
  if (!text(v.organization ?? "", 120)) fields.organization = "eb.err.organization";
  if (!(TEAM_SIZES as readonly string[]).includes(v.size ?? "")) fields.size = "eb.err.size";
  if (!(ROLES as readonly string[]).includes(v.role ?? "")) fields.role = "eb.err.role";
  if (v.agree !== "on") fields.agree = "eb.err.agree";
  return fields;
}
