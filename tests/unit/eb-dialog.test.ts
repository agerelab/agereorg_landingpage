// FE-18 — before the app opens (PO, 9 Oct 2026): the public header shows no "Sign in", and the Trial and Team
// buttons on the pricing cards open a short early bird explainer instead of a toast. The refund policy,
// hidden 9-12 Oct, is shown again with its final text (D134).
import { describe, expect, it, vi } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";

vi.mock("server-only", () => ({}));
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

const { SHOW_EB_ILLUSTRATION, SHOW_REFUND, SHOW_SIGN_IN, VISIBLE_LEGAL_DOCS } = await import("@/ui/public/content");
const { EB_DIALOG_KEYS } = await import("@/ui/public/pricing-section");
const { default: RefundPage } = await import("@/app/(publik)/refund/page");
const sprites = await import("@/ui/public/eb-flight");

describe("FE-18 — early bird first", () => {
  it("hides Sign in on the public site until the app opens", () => {
    expect(SHOW_SIGN_IN).toBe(false);
  });

  it("explains the early bird in English and Bahasa Indonesia", () => {
    expect(EB_DIALOG_KEYS).toEqual(["ps.ebDialog.title", "ps.ebDialog.lead", "ps.ebDialog.p1", "ps.eb.credits", "ps.ebDialog.p3", "ps.ebDialog.p4", "site.cta.earlyBird", "common.close"]);
    for (const k of EB_DIALOG_KEYS) {
      expect(en, k).toHaveProperty([k]);
      expect(id, k).toHaveProperty([k]);
    }
  });

  it("keeps the early bird illustration hidden for now", () => {
    expect(SHOW_EB_ILLUSTRATION).toBe(false);
  });

  it("draws every illustration sprite on a full grid (rows of one length; ink, paper or empty)", () => {
    for (const rows of [sprites.BIRD_UP, sprites.BIRD_DOWN, sprites.FOLDER, sprites.CLOUD]) {
      expect(new Set(rows.map((r) => r.length)).size).toBe(1);
      for (const r of rows) expect(r).toMatch(/^[.#o]+$/);
    }
    expect(sprites.BIRD_UP[0].length).toBe(sprites.BIRD_DOWN[0].length);
  });

  it("shows the refund policy again (D134): in the footer, and its page opens", () => {
    expect(SHOW_REFUND).toBe(true);
    expect(VISIBLE_LEGAL_DOCS.map((d) => d.slug)).toEqual(["ketentuan", "privasi", "refund", "early-bird"]);
    expect(() => RefundPage({ searchParams: Promise.resolve({}) })).not.toThrow();
  });
});
