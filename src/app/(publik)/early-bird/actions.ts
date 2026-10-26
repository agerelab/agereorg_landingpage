"use server";
// "Kirim pendaftaran" (FE-18 v2; D113, D131): checks every field again on the server and emails the
// application to the team inbox, with reply-to the applicant. A filled hidden field means a bot: it is
// told "sent" and nothing is sent. When the email cannot go out, the applicant is told and keeps the form,
// also when production has no email provider yet: an application is never "sent" into the log only.
// PO 13 Oct 2026: the team email shows the chosen labels, the applicant's language and the consent
// (document versions and time); once it is out, the applicant gets a confirmation in their own language.
// Both go out as HTML with the logo (PO 13 Oct 2026), the text staying as the fallback.
import { headers } from "next/headers";
import { translator, type Locale, type MessageKey } from "@/i18n";
import { formatDateMedium, formatIsoDate, formatNumber, formatTime } from "@/i18n/format";
import { EARLY_BIRD } from "@/modules/billing/plans";
import { maskEmail } from "@/modules/identity/crypto";
import { emailReady, sendEmail } from "@/modules/identity/email";
import { emailHtml } from "@/modules/identity/email-html";
import { appUrl } from "@/lib/app-url";
import { loadLegal } from "@/ui/legal/content";
import { checkEarlyBird, EARLY_BIRD_INBOX, SUPPORT_EMAIL, type EarlyBirdState, type EarlyBirdValues } from "@/ui/public/early-bird";
import { DECISION_DAYS, decisionLinks } from "@/ui/public/early-bird-decision";
import { allowEarlyBird } from "@/ui/public/early-bird-limit";

export async function submitEarlyBirdAction(_prev: EarlyBirdState, form: FormData): Promise<EarlyBirdState> {
  const read = (k: string) => String(form.get(k) ?? "");
  const values: EarlyBirdValues = { email: read("email").trim(), name: read("name").trim(), organization: read("organization").trim(), size: read("size"), role: read("role"), agree: read("agree") };
  if (read("website")) return { ok: true, email: values.email };

  const fields = checkEarlyBird(values);
  if (Object.keys(fields).length) return { ok: false, fields, values };

  if (!emailReady()) {
    console.error("[early-bird] no email provider configured (RESEND_API_KEY, EMAIL_FROM); application not sent");
    return { ok: false, error: "eb.err.send", values };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowEarlyBird(ip)) return { ok: false, error: "eb.err.tooMany", values };

  const lang: Locale = read("lang") === "en" ? "en" : "id";
  const now = new Date();
  const versions = [loadLegal("early-bird", "id").meta.version, loadLegal("privasi", "id").meta.version];
  const base = await appUrl();

  // The team reads applications in Bahasa Indonesia.
  const t = translator("id");
  const size = t(`eb.size.${values.size}` as MessageKey);
  const teamText = t(
    "eb.mail.body",
    values.name,
    values.email,
    values.organization,
    size,
    t(`eb.role.${values.role}` as MessageKey),
    t(lang === "en" ? "language.en" : "language.id"),
    ...versions,
    `${formatDateMedium("id", now)} ${formatTime("id", now)}`,
  );
  // "Undang ke panggilan" / "Tolak" open the decision page, which shows the email before it goes out.
  const decide = decisionLinks({ email: values.email, name: values.name, organization: values.organization, size: values.size, role: values.role, lang }, base);
  if (!decide) console.warn("[early-bird] EARLY_BIRD_SECRET is not set; the team email has no invite or decline links");
  const note = decide ? `\n\n${t("eb.mail.decide", String(DECISION_DAYS))}` : "";
  try {
    await sendEmail({
      to: EARLY_BIRD_INBOX,
      replyTo: values.email,
      subject: t("eb.mail.subject", values.organization, size),
      text: decide ? `${teamText}${note}\n${t("eb.mail.accept")}: ${decide.accept}\n${t("eb.mail.deny")}: ${decide.deny}` : teamText,
      html: emailHtml(teamText + note, {
        base,
        lang: "id",
        links: [values.email],
        actions: decide ? [{ label: t("eb.mail.accept"), href: decide.accept }, { label: t("eb.mail.deny"), href: decide.deny }] : undefined,
      }),
    });
  } catch (e) {
    console.error(`[early-bird] ${(e as Error).message}`);
    return { ok: false, error: "eb.err.send", values };
  }

  // The application is in; a confirmation that fails to go out is logged, not shown.
  const a = translator(lang);
  const en = lang === "en" ? "?lang=en" : "";
  const terms = `${base}/early-bird${en}#syarat`;
  const privacy = `${base}/privasi${en}`;
  const ackText = a(
    "eb.ack.body",
    values.name,
    values.organization,
    formatIsoDate(lang, EARLY_BIRD.closesOn),
    a(`eb.size.${values.size}` as MessageKey),
    a(`eb.role.${values.role}` as MessageKey),
    terms,
    privacy,
    formatNumber(lang, EARLY_BIRD.places),
  );
  try {
    await sendEmail({
      to: values.email,
      replyTo: SUPPORT_EMAIL,
      subject: a("eb.ack.subject"),
      text: ackText,
      html: emailHtml(ackText, { base, lang, links: [terms, privacy, SUPPORT_EMAIL] }),
    });
  } catch (e) {
    console.error(`[early-bird] confirmation not sent to ${maskEmail(values.email)}: ${(e as Error).message.replaceAll(values.email, maskEmail(values.email))}`);
  }
  return { ok: true, email: values.email };
}
