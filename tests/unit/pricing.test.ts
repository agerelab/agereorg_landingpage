// FE-18 slice 2b (PRD-20 §5.2 as amended; PO 7 Oct 2026): /harga compares Free and Tim on what ships at GA,
// then lists the apps that follow, each marked "Segera hadir", with numbers only from the plans module.
import { describe, expect, it } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import { isPublicPath } from "@/proxy";
import { PLANS, TRIAL_CREDITS } from "@/modules/billing/plans";
import { PRICING_ROWS, PRICING_SECTION_KEYS, PUBLIC_KEYS, SOON_APPS } from "@/ui/public/content";

describe("FE-18 — pricing page", () => {
  it("is readable without signing in", () => {
    expect(isPublicPath("/harga")).toBe(true);
  });

  it("compares what ships at GA first, then the apps that follow, each marked coming soon", () => {
    const ga = PRICING_ROWS.filter((r) => !r.soon).map((r) => r.id);
    const soon = PRICING_ROWS.filter((r) => r.soon).map((r) => r.id);
    expect(ga).toEqual(["seats", "projects", "credits", "trash", "insights", "restricted", "audit", "support"]);
    expect(soon).toEqual(["agents", "triggers", "aiTeams", "apps", "chat", "timeline"]);
    expect(PRICING_ROWS.findIndex((r) => r.soon)).toBe(ga.length);
  });

  it("takes every number in the comparison from the plans module", () => {
    const row = (id: string) => PRICING_ROWS.find((r) => r.id === id)!;
    expect(row("seats").free.arg).toBe(PLANS.free.maxSeats);
    expect(row("seats").team.arg).toBe(PLANS.team.minSeats);
    expect(row("credits").team.arg).toBe(PLANS.team.credits.amount);
    expect(row("agents").team.arg).toBe(PLANS.team.later.customAgents);
    expect(row("triggers").free.key).toBe("pricing.v.none");
    expect(row("chat").team.key).toBe("pricing.v.unlimited");
  });

  it("lists email support on both plans and the audit trail on both (D131)", () => {
    const row = (id: string) => PRICING_ROWS.find((r) => r.id === id)!;
    expect(row("support").free).toEqual({ key: "pricing.v.email" });
    expect(row("support").team).toEqual({ key: "pricing.v.emailDays", arg: 2 });
    expect([row("audit").free.key, row("audit").team.key]).toEqual(["pricing.v.included", "pricing.v.included"]);
  });

  it("gives trial credits per D88/D116 and lists the seven apps that follow GA (FE-18 v2)", () => {
    expect(TRIAL_CREDITS).toEqual({ ownDomain: 500, freeEmail: 150 });
    expect(SOON_APPS).toEqual(["ps.soon.doc", "ps.soon.chat", "ps.soon.apps", "ps.soon.agents", "ps.soon.skills", "ps.soon.aiOrg", "ps.soon.timeline"]);
  });

  it("exists in English and Bahasa Indonesia", () => {
    for (const key of [...PUBLIC_KEYS, ...PRICING_SECTION_KEYS]) {
      expect(en, key).toHaveProperty([key]);
      expect(id, key).toHaveProperty([key]);
    }
  });
});
