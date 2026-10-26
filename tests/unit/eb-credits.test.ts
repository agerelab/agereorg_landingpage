// FE-18 — early bird AI credits follow the Early Bird Program Terms v1.0 (D137, amends D113's flat 1,000):
//   Given an early bird organization with N active members on the 1st of the month
//   Then it gets 100 × N AI credits, at least 300 and at most 1,500
//   And every public page says the same as the binding terms.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import { EARLY_BIRD, earlyBirdCredits } from "@/modules/billing/plans";

const terms = (file: string) => readFileSync(`src/content/legal/${file}`, "utf8");

describe("FE-18 — early bird AI credits (D137)", () => {
  it("gives 100 per active member a month, between 300 and 1,500", () => {
    expect([1, 3, 5, 10, 15, 20].map(earlyBirdCredits)).toEqual([300, 300, 500, 1000, 1500, 1500]);
  });

  it("matches the binding Early Bird Program Terms in both languages", () => {
    const { perMember, min, max } = EARLY_BIRD.credits;
    expect(terms("id/syarat-early-bird.md")).toContain(`${perMember} per Anggota aktif per bulan, minimal ${min} dan maksimal 1.500`);
    expect(terms("en/early-bird-terms.md")).toContain(`${perMember} per Active member a month, with a minimum of ${min} and a maximum of 1,500`);
    expect(max).toBe(1500);
  });

  it("states the rule, not a flat 1,000, wherever the public site shows early bird credits", () => {
    for (const catalog of [en, id] as Record<string, string>[]) {
      expect(catalog["ps.eb.credits"]).toMatch(/\{0\}.*\{1\}.*\{2\}/);
      expect(catalog["eb.s.creditsLabel"]).toMatch(/\{0\}.*\{1\}/);
    }
    expect(en["ps.eb.credits"]).toContain("per active member");
    expect(id["ps.eb.credits"]).toContain("per anggota aktif");
  });
});
