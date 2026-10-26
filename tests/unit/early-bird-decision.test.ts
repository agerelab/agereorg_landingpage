// FE-18 (PO, 13 Oct 2026): the team answers an early bird application from its email. "Undang" invites the
// applicant to the 30-minute intro call (Early Bird Program Terms 1.2); "Tolak" declines politely. No
// database: the link carries the application, sealed with EARLY_BIRD_SECRET (AES-256-GCM), valid 30 days.
// The email goes out in the applicant's language, replies go to support and the team gets a copy.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Sent = { to: string; subject: string; text: string; html?: string; replyTo?: string; bcc?: string };
const sent: Sent[] = [];
let failSend = false;
let ready = true;
vi.mock("server-only", () => ({}));
vi.mock("@/lib/app-url", () => ({ appUrl: async () => "https://www.agereorg.example" }));
vi.mock("@/modules/identity/email", () => ({
  emailReady: () => ready,
  sendEmail: async (m: Sent) => {
    if (failSend) throw new Error("Email provider answered 503 for r***");
    sent.push(m);
  },
}));

const { sealApplicant, openApplicant, decisionMail, DECISION_DAYS } = await import("@/ui/public/early-bird-decision");
const { CRAWL_CLOSED } = await import("@/ui/public/seo");
const { PUBLIC_SITE } = await import("@/ui/public/site-mode");
const { sendDecisionAction } = await import("@/app/(publik)/early-bird/keputusan/actions");

const rina = { email: "rina@majujaya.co.id", name: "Rina Kartika", organization: "Maju Jaya", size: "6-10", role: "owner", lang: "id" as const };
const SECRET = "test-secret-0123456789-abcdefghijklmnop";
const form = (v: Record<string, string>) => {
  const f = new FormData();
  for (const [k, x] of Object.entries(v)) f.set(k, x);
  return f;
};

beforeEach(() => {
  sent.length = 0;
  failSend = false;
  ready = true;
  vi.stubEnv("EARLY_BIRD_SECRET", SECRET);
  vi.stubEnv("EARLY_BIRD_BOOKING_URL", "");
});
afterEach(() => vi.unstubAllEnvs());

describe("FE-18 — early bird decision link", () => {
  it("carries the application, unreadable, and opens it again", () => {
    const token = sealApplicant(rina)!;
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(token).not.toContain("rina");
    expect(Buffer.from(token, "base64url").toString()).not.toContain("Maju Jaya");
    expect(openApplicant(token)).toEqual(rina);
  });

  it(`expires after ${DECISION_DAYS} days`, () => {
    const now = Date.UTC(2026, 9, 13);
    const token = sealApplicant(rina, now)!;
    expect(openApplicant(token, now + (DECISION_DAYS - 1) * 864e5)).toEqual(rina);
    expect(openApplicant(token, now + (DECISION_DAYS + 1) * 864e5)).toBeNull();
  });

  it("refuses a changed link, a link sealed with another secret, and works not at all without a secret", () => {
    const token = sealApplicant(rina)!;
    const flipped = token.slice(0, -2) + (token.at(-2) === "A" ? "B" : "A") + token.at(-1);
    expect(openApplicant(flipped)).toBeNull();
    expect(openApplicant("not-a-token")).toBeNull();
    vi.stubEnv("EARLY_BIRD_SECRET", "another-secret-0123456789-abcdefghijk");
    expect(openApplicant(token)).toBeNull();
    vi.stubEnv("EARLY_BIRD_SECRET", "");
    expect(sealApplicant(rina)).toBeNull();
    expect(openApplicant(token)).toBeNull();
  });
});

describe("FE-18 — sending the decision", () => {
  it("invites to the intro call in the applicant's language, replies to support, a copy to the team", async () => {
    const r = await sendDecisionAction({}, form({ t: sealApplicant(rina)!, d: "accept" }));
    expect(r).toEqual({ ok: true, email: "rina@majujaya.co.id" });
    const [m] = sent;
    expect(m).toMatchObject({ to: "rina@majujaya.co.id", replyTo: "support@agereorg.com", bcc: "agereorg@gmail.com" });
    expect(m.subject).toContain("early bird");
    for (const part of ["Halo Rina Kartika", "Maju Jaya", "30 menit", "Balas email ini dengan dua atau tiga waktu"]) expect(m.text, part).toContain(part);
    expect(m.html).toContain("agere-org-logo.png");
  });

  it("offers the booking page when one is set", async () => {
    vi.stubEnv("EARLY_BIRD_BOOKING_URL", "https://cal.example/agere/perkenalan");
    await sendDecisionAction({}, form({ t: sealApplicant({ ...rina, lang: "en" })!, d: "accept" }));
    expect(sent[0].text).toContain("Hi Rina Kartika");
    expect(sent[0].text).toContain("https://cal.example/agere/perkenalan");
    expect(sent[0].html).toContain('href="https://cal.example/agere/perkenalan"');
  });

  it("declines politely: the places, the trial at launch, and the deletion rule without a date (D149, D151)", async () => {
    await sendDecisionAction({}, form({ t: sealApplicant(rina)!, d: "deny" }));
    const [m] = sent;
    for (const part of ["Halo Rina Kartika", "Kuota program hanya 10 organisasi", "14 hari", "90 hari setelah pendaftaran ditutup", "bagian 10 Kebijakan Privasi", "https://www.agereorg.example/privasi"]) {
      expect(m.text, part).toContain(part);
    }
    expect(m.text).not.toContain("Free");
    expect(m.bcc).toBe("agereorg@gmail.com");
  });

  it("shows the team exactly the email that goes out, before it goes out", async () => {
    for (const d of ["accept", "deny"] as const) {
      sent.length = 0;
      await sendDecisionAction({}, form({ t: sealApplicant(rina)!, d }));
      const preview = decisionMail(rina, d, "https://www.agereorg.example");
      expect(sent[0]).toMatchObject({ subject: preview.subject, text: preview.text });
    }
  });

  it("keeps the decision page out of search engines and open on the public site", () => {
    expect(CRAWL_CLOSED).toContain("/early-bird/keputusan");
    expect(PUBLIC_SITE.test("/early-bird/keputusan")).toBe(true);
  });

  it("refuses an invalid or expired link, or an unknown decision, and sends nothing", async () => {
    expect(await sendDecisionAction({}, form({ t: "rusak", d: "accept" }))).toEqual({ ok: false, error: "ebd.err.invalid" });
    expect(await sendDecisionAction({}, form({ t: sealApplicant(rina)!, d: "maybe" }))).toEqual({ ok: false, error: "ebd.err.invalid" });
    expect(sent).toHaveLength(0);
  });

  it("says so when the email cannot go out", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    failSend = true;
    expect(await sendDecisionAction({}, form({ t: sealApplicant(rina)!, d: "deny" }))).toEqual({ ok: false, error: "ebd.err.send" });
    ready = false;
    failSend = false;
    expect(await sendDecisionAction({}, form({ t: sealApplicant(rina)!, d: "deny" }))).toEqual({ ok: false, error: "ebd.err.send" });
    expect(sent).toHaveLength(0);
    vi.restoreAllMocks();
  });
});
