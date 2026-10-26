// FE-18 — public copy after the legal content package v1.0 (D134; README rules 5, 6, 8; D136):
//   No tax/VAT text and no vendor names in public copy (the sign-in button and integration examples keep
//   their own names). The FAQ on the home page is the package's FAQ, verbatim, in the reader's language.
//   Pricing cards leave the home page and "Pricing" leaves the header; /harga stays, linked from the footer.
//   Mock-up addresses read agereorg.com (one domain, D136).
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import { isPublicPath } from "@/proxy";

vi.mock("server-only", () => ({}));
const { loadFaq } = await import("@/ui/legal/content");
const { SITE_NAV } = await import("@/ui/public/content");

const catalogs = { en, id } as Record<string, Record<string, string>>;
const values = (lang: string) => Object.entries(catalogs[lang]);

describe("FE-18 — public copy (D134, D136)", () => {
  it("carries no tax/VAT text anywhere", () => {
    for (const lang of ["en", "id"]) {
      expect(values(lang).filter(([, v]) => /\b(VAT|PPN|PKP|NPWP)\b/.test(v)).map(([k]) => k), lang).toEqual([]);
    }
  });

  it("names no payment, AI, hosting, email or monitoring provider", () => {
    const vendors = /\b(DOKU|Midtrans|Xendit|OpenRouter|OpenAI|Anthropic|Vercel|Neon|Supabase|Cloudflare|Sentry)\b/;
    for (const lang of ["en", "id"]) {
      expect(values(lang).filter(([, v]) => vendors.test(v)).map(([k]) => k), lang).toEqual([]);
    }
  });

  it("shows the product's own domain in mock-up addresses", () => {
    for (const lang of ["en", "id"]) {
      expect(values(lang).filter(([, v]) => v.includes("agere.id")).map(([k]) => k), lang).toEqual([]);
    }
    expect(en["mock.url"]).toBe("agereorg.com/maju-jaya/desk");
  });

  // D170, D171 (Indonesia) vs Privacy Policy v1.0 §6–7 (Singapore): until OPS-02 v1.1 the public copy names
  // no country for where data is kept (PO, 26 Oct 2026, option A). The legal pages keep their own wording.
  it("names no data location until the Privacy Policy is revised", () => {
    for (const lang of ["en", "id"]) {
      expect(values(lang).filter(([, v]) => /\b(Singapore|Singapura)\b/.test(v)).map(([k]) => k), lang).toEqual([]);
      expect(`${catalogs[lang]["ctl.data.title"]} ${catalogs[lang]["ctl.data.body"]}`, lang).not.toMatch(/\b(Singapore|Singapura|Indonesia|Jakarta)\b/);
    }
  });

  it("keeps the old FAQ keys out of the catalogs", () => {
    for (const lang of ["en", "id"]) expect(values(lang).filter(([k]) => /^faq\.(q|a)\d/.test(k)), lang).toEqual([]);
  });

  it("answers the package's FAQ, verbatim, in both languages", () => {
    for (const lang of ["en", "id"] as const) {
      const faq = loadFaq(lang);
      const source = readFileSync(`src/content/legal/${lang}/faq.md`, "utf8").replace(/\r\n/g, "\n");
      const questions = [...source.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
      expect(faq.title, lang).toBe(lang === "en" ? "FAQ" : "Pertanyaan umum");
      expect(faq.items.map((i) => i.q), lang).toEqual(questions);
      expect(faq.items, lang).toHaveLength(11);
      for (const item of faq.items) expect(source, `${lang}: ${item.q}`).toContain(item.a);
    }
  });

  it("takes pricing out of the header and the home page; /harga stays public", () => {
    expect(SITE_NAV.map((n) => n.href)).not.toContain("/harga");
    expect(readFileSync("src/app/(publik)/beranda/page.tsx", "utf8")).not.toContain("PricingSection");
    expect(isPublicPath("/harga")).toBe(true);
  });
});
