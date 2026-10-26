// FE-18 v2 slice 3 (D113, D131; PO 7 Oct 2026): the early bird sign-up form checks every field on the server,
// sends the application to the team inbox (agereorg@gmail.com) and never echoes a bot-filled form.
// PO 13 Oct 2026: the team email shows the chosen labels, the applicant's language and the consent (document
// versions and time); the applicant gets a confirmation in their own language, replies going to support.
import { beforeEach, describe, expect, it, vi } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";

const sent: { to: string; subject: string; text: string; html?: string; replyTo?: string }[] = [];
let failSend: (to: string) => boolean = () => false;
let ready = true;
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ headers: async () => new Map([["x-forwarded-for", "203.0.113.7"]]) }));
vi.mock("@/lib/app-url", () => ({ appUrl: async () => "https://www.agereorg.example" }));
vi.mock("@/modules/identity/email", () => ({
  emailReady: () => ready,
  sendEmail: async (m: { to: string; subject: string; text: string; html?: string; replyTo?: string }) => {
    if (failSend(m.to)) throw new Error(`Email provider answered 503 for ${m.to.slice(0, 1)}***`);
    sent.push(m);
  },
}));

const { checkEarlyBird, EARLY_BIRD_INBOX } = await import("@/ui/public/early-bird");
const { submitEarlyBirdAction } = await import("@/app/(publik)/early-bird/actions");
const { resetEarlyBirdLimit } = await import("@/ui/public/early-bird-limit");
const { openApplicant } = await import("@/ui/public/early-bird-decision");

const valid = { email: "rina@majujaya.co.id", name: "Rina Kartika", organization: "Maju Jaya", size: "6-10", role: "owner", agree: "on", website: "" };
const form = (v: Record<string, string>) => {
  const f = new FormData();
  for (const [k, x] of Object.entries(v)) f.set(k, x);
  return f;
};

beforeEach(() => {
  sent.length = 0;
  failSend = () => false;
  ready = true;
  resetEarlyBirdLimit();
  vi.stubEnv("EARLY_BIRD_SECRET", "test-secret-0123456789-abcdefghijklmnop");
});

describe("FE-18 v2 — early bird form", () => {
  it("sends applications to the team inbox chosen by the PO", () => {
    expect(EARLY_BIRD_INBOX).toBe("agereorg@gmail.com");
  });

  it("names every missing or wrong field at once", () => {
    expect(checkEarlyBird({ email: "bukan-email", name: "", organization: " ", size: "99", role: "", agree: "" })).toEqual({
      email: "eb.err.email", name: "eb.err.name", organization: "eb.err.organization", size: "eb.err.size", role: "eb.err.role", agree: "eb.err.agree",
    });
    expect(checkEarlyBird(valid)).toEqual({});
  });

  it("emails the application to the inbox, with the chosen labels, the language and the consent", async () => {
    const r = await submitEarlyBirdAction({}, form({ ...valid, lang: "en" }));
    expect(r).toEqual({ ok: true, email: "rina@majujaya.co.id" });
    const team = sent[0];
    expect(team.to).toBe("agereorg@gmail.com");
    expect(team.subject).toBe("Pendaftaran early bird: Maju Jaya (6–10 orang)");
    for (const line of ["Nama: Rina Kartika", "Email: rina@majujaya.co.id", "Organisasi: Maju Jaya", "Jumlah orang: 6–10 orang", "Peran: Founder atau Owner", "Bahasa: English"]) {
      expect(team.text).toContain(line);
    }
    expect(team.text).toMatch(/Persetujuan: Syarat Program Early Bird v1\.0 dan Kebijakan Privasi v1\.0, .+ WIB/);
  });

  it("confirms to the applicant in Bahasa Indonesia by default, replies going to support", async () => {
    await submitEarlyBirdAction({}, form(valid));
    expect(sent).toHaveLength(2);
    const ack = sent[1];
    expect(ack.to).toBe("rina@majujaya.co.id");
    expect(ack.replyTo).toBe("support@agereorg.com");
    expect(ack.subject).toBe(id["eb.ack.subject"]);
    for (const part of ["Halo Rina Kartika", "Maju Jaya", "6–10 orang", "Founder atau Owner", "daftar tunggu", "https://www.agereorg.example/early-bird#syarat", "https://www.agereorg.example/privasi", "support@agereorg.com"]) {
      expect(ack.text, part).toContain(part);
    }
  });

  it("confirms in English when the applicant used the English page, with links to the English documents", async () => {
    await submitEarlyBirdAction({}, form({ ...valid, lang: "en" }));
    const ack = sent[1];
    expect(ack.subject).toBe(en["eb.ack.subject"]);
    for (const part of ["Hi Rina Kartika", "6–10 people", "Founder or owner", "https://www.agereorg.example/early-bird?lang=en#syarat", "https://www.agereorg.example/privasi?lang=en"]) {
      expect(ack.text, part).toContain(part);
    }
  });

  it("sends both emails as HTML with the logo, the text staying as the fallback", async () => {
    await submitEarlyBirdAction({}, form({ ...valid, name: "Rina <b>K</b>", organization: "https://evil.example" }));
    for (const m of sent) {
      expect(m.text).toBeTruthy();
      expect(m.html).toContain('<img src="https://www.agereorg.example/email/agere-org-logo.png"');
      expect(m.html).not.toContain("<b>K</b>");
      expect(m.html).not.toContain('href="https://evil.example');
    }
    expect(sent[0].html).toContain('href="mailto:rina@majujaya.co.id"');
    expect(sent[1].html).toContain('href="https://www.agereorg.example/early-bird#syarat"');
    expect(sent[1].html).toContain('href="mailto:support@agereorg.com"');
  });

  it("lets the team invite or decline from its email, through links that carry the application", async () => {
    await submitEarlyBirdAction({}, form({ ...valid, lang: "en" }));
    const team = sent[0];
    const links = [...team.text.matchAll(/https:\/\/www\.agereorg\.example\/early-bird\/keputusan\?d=(accept|deny)&t=([\w-]+)/g)];
    expect(links.map((l) => l[1])).toEqual(["accept", "deny"]);
    expect(openApplicant(links[0][2])).toEqual({ email: "rina@majujaya.co.id", name: "Rina Kartika", organization: "Maju Jaya", size: "6-10", role: "owner", lang: "en" });
    expect(team.html).toContain(`href="${links[0][0].replace("&", "&amp;")}"`);
    expect(team.html).toContain(">Undang ke panggilan</a>");
    expect(team.html).toContain(">Tolak</a>");
    expect(sent[1].text).not.toContain("keputusan");
  });

  it("Given no EARLY_BIRD_SECRET, Then the team email has no decision links and the log says why", async () => {
    vi.stubEnv("EARLY_BIRD_SECRET", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await submitEarlyBirdAction({}, form(valid))).toMatchObject({ ok: true });
    expect(sent[0].text).not.toContain("keputusan");
    expect(warn.mock.calls.flat().join(" ")).toContain("EARLY_BIRD_SECRET");
    warn.mockRestore();
  });

  it("Given the team email fails, Then nothing is confirmed to the applicant", async () => {
    failSend = (to) => to === "agereorg@gmail.com";
    expect(await submitEarlyBirdAction({}, form(valid))).toMatchObject({ ok: false, error: "eb.err.send" });
    expect(sent).toHaveLength(0);
  });

  it("Given only the confirmation fails, Then the application still counts and the log names no address", async () => {
    failSend = (to) => to === "rina@majujaya.co.id";
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await submitEarlyBirdAction({}, form(valid))).toEqual({ ok: true, email: "rina@majujaya.co.id" });
    expect(sent.map((m) => m.to)).toEqual(["agereorg@gmail.com"]);
    const logged = errors.mock.calls.flat().join(" ");
    expect(logged).toContain("confirmation");
    expect(logged).not.toContain("rina@majujaya.co.id");
    errors.mockRestore();
  });

  it("lets the team answer the applicant straight from the inbox (reply-to)", async () => {
    await submitEarlyBirdAction({}, form(valid));
    expect(sent[0].replyTo).toBe("rina@majujaya.co.id");
  });

  it("Given the email cannot be sent, Then the form says so and keeps every value to try again", async () => {
    failSend = () => true;
    const r = await submitEarlyBirdAction({}, form(valid));
    expect(r).toMatchObject({ ok: false, error: "eb.err.send", values: { email: "rina@majujaya.co.id", name: "Rina Kartika", organization: "Maju Jaya", size: "6-10", role: "owner" } });
    expect(en).toHaveProperty(["eb.err.send"]);
    expect(id).toHaveProperty(["eb.err.send"]);
  });

  it("sends nothing and keeps the values when a field is wrong", async () => {
    const r = await submitEarlyBirdAction({}, form({ ...valid, email: "x" }));
    expect(r).toMatchObject({ ok: false, fields: { email: "eb.err.email" }, values: { name: "Rina Kartika", organization: "Maju Jaya" } });
    expect(sent).toHaveLength(0);
  });

  it("accepts teams outside 3–15 people too (the page tells them about other options)", async () => {
    expect(await submitEarlyBirdAction({}, form({ ...valid, size: "16+" }))).toMatchObject({ ok: true });
  });

  it("answers a bot that fills the hidden field as if it worked, and sends nothing", async () => {
    expect(await submitEarlyBirdAction({}, form({ ...valid, website: "http://spam.example" }))).toMatchObject({ ok: true });
    expect(sent).toHaveLength(0);
  });

  it("Given no email provider in production, Then the form says it was not sent, keeps every value and uses no quota", async () => {
    ready = false;
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    for (let i = 0; i < 6; i++) {
      expect(await submitEarlyBirdAction({}, form(valid))).toMatchObject({ ok: false, error: "eb.err.send", values: { email: "rina@majujaya.co.id", organization: "Maju Jaya" } });
    }
    expect(sent).toHaveLength(0);
    expect(errors.mock.calls.flat().join(" ")).toContain("no email provider");
    errors.mockRestore();
    ready = true;
    expect(await submitEarlyBirdAction({}, form(valid))).toMatchObject({ ok: true });
  });

  it("slows down a flood from one address", async () => {
    for (let i = 0; i < 5; i++) await submitEarlyBirdAction({}, form(valid));
    expect(await submitEarlyBirdAction({}, form(valid))).toMatchObject({ ok: false, error: "eb.err.tooMany" });
    expect(sent.filter((m) => m.to === "agereorg@gmail.com")).toHaveLength(5);
  });

  it("shows the program page in English and Bahasa Indonesia", () => {
    const keys = ["eb.crumb", "eb.pill", "eb.title", "eb.lead", "eb.s.days", "eb.s.daysLabel", "eb.s.creditsLabel", "eb.s.yearlyLabel", "eb.s.monthlyLabel", "eb.fit.title", "eb.fit.1", "eb.fit.2", "eb.fit.3"];
    for (const k of keys) {
      expect(en, k).toHaveProperty([k]);
      expect(id, k).toHaveProperty([k]);
    }
  });
});
