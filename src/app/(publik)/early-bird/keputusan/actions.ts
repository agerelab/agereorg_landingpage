"use server";
// "Kirim undangan" / "Kirim penolakan" (FE-18, PO 13 Oct 2026): the team's answer to an early bird
// application, from the decision page the team email links to. The email itself (decisionMail) is the one
// the page shows; it goes out in the applicant's language, replies go to support and the team inbox gets
// a copy. The link is the authorization: only a link sealed with EARLY_BIRD_SECRET opens.
import type { MessageKey } from "@/i18n";
import { maskEmail } from "@/modules/identity/crypto";
import { emailReady, sendEmail } from "@/modules/identity/email";
import { emailHtml } from "@/modules/identity/email-html";
import { appUrl } from "@/lib/app-url";
import { EARLY_BIRD_INBOX, SUPPORT_EMAIL } from "@/ui/public/early-bird";
import { decisionMail, isDecision, openApplicant } from "@/ui/public/early-bird-decision";

export type DecisionState = Record<string, never> | { ok: true; email: string } | { ok: false; error: MessageKey };

export async function sendDecisionAction(_prev: DecisionState, form: FormData): Promise<DecisionState> {
  const decision = String(form.get("d") ?? "");
  const a = openApplicant(String(form.get("t") ?? ""));
  if (!a || !isDecision(decision)) return { ok: false, error: "ebd.err.invalid" };
  if (!emailReady()) return { ok: false, error: "ebd.err.send" };

  const base = await appUrl();
  const mail = decisionMail(a, decision, base);
  try {
    await sendEmail({ to: a.email, replyTo: SUPPORT_EMAIL, bcc: EARLY_BIRD_INBOX, subject: mail.subject, text: mail.text, html: emailHtml(mail.text, { base, lang: a.lang, links: mail.links }) });
  } catch (e) {
    console.error(`[early-bird] decision not sent to ${maskEmail(a.email)}: ${(e as Error).message.replaceAll(a.email, maskEmail(a.email))}`);
    return { ok: false, error: "ebd.err.send" };
  }
  return { ok: true, email: a.email };
}
