// Transactional email adapter (PRD-01 §6.1). One interface; the provider is chosen by env (D114: Resend
// for outbound mail from a sending subdomain). With RESEND_API_KEY and EMAIL_FROM set, mail goes out
// through Resend. Without them, development writes the whole message to the server log so the
// verification and reset links can be followed; production writes only a masked address and the
// subject, because bodies carry sign-in links and logs carry no readable email (TECH-01 P7).
import { maskEmail } from "./crypto";

/** `html` is optional; `text` always goes along as the fallback. `bcc` sends the team a copy. */
export type OutgoingEmail = { to: string; subject: string; text: string; html?: string; replyTo?: string; bcc?: string };
export type EmailSender = (msg: OutgoingEmail) => Promise<void>;

const RESEND_URL = "https://api.resend.com/emails";

const resendSender =
  (key: string, from: string | undefined): EmailSender =>
  async (msg) => {
    if (!from) throw new Error("EMAIL_FROM is not set");
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [msg.to], subject: msg.subject, text: msg.text, ...(msg.html && { html: msg.html }), ...(msg.bcc && { bcc: [msg.bcc] }), ...(msg.replyTo && { reply_to: msg.replyTo }) }),
    });
    if (!res.ok) throw new Error(`Email provider answered ${res.status} for ${maskEmail(msg.to)}`);
  };

const logSender: EmailSender = async (msg) => {
  if (process.env.NODE_ENV === "production") {
    console.warn(`[email] no provider configured; not sent to ${maskEmail(msg.to)}: ${msg.subject}`);
    return;
  }
  console.log(`\n[email] to ${msg.to}\n[email] ${msg.subject}\n${msg.text}\n`);
  if (msg.html) {
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const dir = path.join(process.cwd(), ".data");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const filePath = path.join(dir, "last-email.html");
      fs.writeFileSync(filePath, msg.html, "utf8");
      console.log(`[email] Pratinjau HTML disimpan: file://${filePath}\n`);
    } catch {}
  }
};

let override: EmailSender | undefined;

/** Replaces the provider (tests, tools); `undefined` goes back to the one the environment names. */
export function setEmailSender(s: EmailSender | undefined) {
  override = s;
}

/** Whether mail really goes out: a replaced sender, Resend fully configured, or development (the log).
 *  Production with no provider only logs a masked line, so a form that must not lose a message asks first. */
export function emailReady(): boolean {
  if (override) return true;
  if (process.env.RESEND_API_KEY) return !!process.env.EMAIL_FROM;
  return process.env.NODE_ENV !== "production";
}

export function sendEmail(msg: OutgoingEmail) {
  const key = process.env.RESEND_API_KEY;
  const sender = override ?? (key ? resendSender(key, process.env.EMAIL_FROM) : logSender);
  return sender(msg);
}
