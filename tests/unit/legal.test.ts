// FE-18 (PRD-00 OPS-01/OPS-02, PRD-13 §6.5, PRD-20, D134): the legal pages DOKU reviews are public, carry
// their final text (tests/unit/legal-content.test.ts), and their addresses can never be taken by an
// organization.
import { describe, expect, it } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import { isPublicPath } from "@/proxy";
import { LEGAL_DOCS, legalKeys } from "@/ui/legal/docs";

describe("FE-18 — legal pages", () => {
  it("has the four documents OPS-02 names", () => {
    expect(LEGAL_DOCS.map((d) => d.slug)).toEqual(["ketentuan", "privasi", "refund", "early-bird"]);
  });

  it("carry their final text (D134)", () => {
    for (const doc of LEGAL_DOCS) expect(doc.status).toBe("final");
  });

  it("are readable without signing in", () => {
    for (const doc of LEGAL_DOCS) expect(isPublicPath(`/${doc.slug}`)).toBe(true);
    expect(isPublicPath("/maju-jaya")).toBe(false);
    expect(isPublicPath("/pengaturan/profil")).toBe(false);
  });

  it("exist in English and Bahasa Indonesia", () => {
    const keys = legalKeys();
    expect(keys.length).toBeGreaterThan(LEGAL_DOCS.length);
    for (const key of keys) {
      expect(en, key).toHaveProperty([key]);
      expect(id, key).toHaveProperty([key]);
    }
  });
});
