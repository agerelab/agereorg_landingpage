// FE-18 go-live (PO, 9 Oct 2026; D114): outgoing mail goes through Resend when the environment names it
// (RESEND_API_KEY, EMAIL_FROM). Without a provider, development still prints the whole message so links
// can be followed, while production prints only a masked address and the subject: bodies carry sign-in
// links and logs carry no readable email (TECH-01 P7, rule 8).
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emailReady, sendEmail, setEmailSender } from "@/modules/identity/email";

const msg = { to: "rina@majujaya.co.id", subject: "Verifikasi email Anda", text: "Buka https://agere.example/verifikasi?token=rahasia" };
const fetchMock = vi.fn();
const logMock = vi.fn();
const env = { ...process.env };

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue(new Response(JSON.stringify({ id: "em_1" }), { status: 200 }));
  logMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "log").mockImplementation(logMock);
  vi.spyOn(console, "warn").mockImplementation(logMock);
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
});

afterEach(() => {
  process.env = { ...env };
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  setEmailSender(undefined);
});

const printed = () => logMock.mock.calls.flat().join("\n");

describe("FE-18 — outgoing email provider (D114)", () => {
  it("Given Resend is configured, When an email is sent, Then Resend gets sender, recipient, subject, text and reply-to", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.EMAIL_FROM = "agere/org <noreply@mail.agere.example>";
    await sendEmail({ ...msg, replyTo: "tim@majujaya.co.id" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ Authorization: "Bearer re_test_key", "Content-Type": "application/json" });
    expect(JSON.parse(init.body)).toEqual({
      from: "agere/org <noreply@mail.agere.example>",
      to: ["rina@majujaya.co.id"],
      subject: msg.subject,
      text: msg.text,
      reply_to: "tim@majujaya.co.id",
    });
  });

  it("Given an HTML version and a copy for the team, Then Resend gets both next to the text", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.EMAIL_FROM = "noreply@mail.agere.example";
    await sendEmail({ ...msg, html: "<p>Buka tautan</p>", bcc: "tim@agere.example" });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ text: msg.text, html: "<p>Buka tautan</p>", bcc: ["tim@agere.example"] });
  });

  it("Given Resend refuses the email, Then sending fails without revealing the key or the address", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.EMAIL_FROM = "noreply@mail.agere.example";
    fetchMock.mockResolvedValue(new Response(JSON.stringify({ message: "domain not verified" }), { status: 403 }));
    const failure = await sendEmail(msg).then(() => null, (e: Error) => e.message);
    expect(failure).toContain("403");
    expect(failure).not.toContain("re_test_key");
    expect(failure).not.toContain("rina@majujaya.co.id");
  });

  it("Given a key but no sender address, Then sending fails and nothing goes out", async () => {
    process.env.RESEND_API_KEY = "re_test_key";
    await expect(sendEmail(msg)).rejects.toThrow("EMAIL_FROM");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("Given no provider in development, Then the whole message is printed so links can be followed", async () => {
    vi.stubEnv("NODE_ENV", "development");
    await sendEmail(msg);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(printed()).toContain("rina@majujaya.co.id");
    expect(printed()).toContain("token=rahasia");
  });

  it("Given no provider in production, Then only a masked address and the subject are printed, never the body", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await sendEmail(msg);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(printed()).toContain("Verifikasi email Anda");
    expect(printed()).not.toContain("rina@majujaya.co.id");
    expect(printed()).not.toContain("token=rahasia");
  });

  it("says whether mail can really go out (the early bird form asks before sending)", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(emailReady(), "development prints to the log").toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(emailReady(), "production, no provider").toBe(false);
    process.env.RESEND_API_KEY = "re_test_key";
    expect(emailReady(), "production, key but no sender address").toBe(false);
    process.env.EMAIL_FROM = "noreply@mail.agere.example";
    expect(emailReady(), "production, Resend configured").toBe(true);
    delete process.env.RESEND_API_KEY;
    setEmailSender(async () => {});
    expect(emailReady(), "a replaced sender").toBe(true);
  });

  it("lets tests and tools replace the sender", async () => {
    const outbox: unknown[] = [];
    process.env.RESEND_API_KEY = "re_test_key";
    process.env.EMAIL_FROM = "noreply@mail.agere.example";
    setEmailSender(async (m) => void outbox.push(m));
    await sendEmail(msg);
    expect(outbox).toEqual([msg]);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
