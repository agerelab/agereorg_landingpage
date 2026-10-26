// FE-18 slice 2b (PRD-20 §5.2 as amended; PO 7 Oct 2026; D149): /harga lists what the Tim plan, and so the
// 14-day trial, holds at the first release, then the apps that follow, each marked "Segera hadir", with
// numbers only from the plans module. There is no Free column.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import { isPublicPath } from "@/proxy";
import { PLANS, TRIAL_CREDITS, UPCOMING_PLANS } from "@/modules/billing/plans";
import { PRICING_ROWS, PRICING_SECTION_KEYS, PUBLIC_KEYS, SOON_APPS } from "@/ui/public/content";

describe("FE-18 — pricing page", () => {
  it("is readable without signing in", () => {
    expect(isPublicPath("/harga")).toBe(true);
  });

  it("compares what ships at GA first, then the apps that follow, each marked coming soon", () => {
    const ga = PRICING_ROWS.filter((r) => !r.soon).map((r) => r.id);
    const soon = PRICING_ROWS.filter((r) => r.soon).map((r) => r.id);
    expect(ga).toEqual(["workspace", "seats", "projects", "credits", "goals", "memberCap", "storage", "trash", "insights", "restricted", "privateProject", "audit", "auditViewer", "support"]);
    expect(soon).toEqual(["deepMode", "agents", "triggers", "aiTeams", "apps", "chat", "timeline"]);
    expect(PRICING_ROWS.findIndex((r) => r.soon)).toBe(ga.length);
  });

  it("takes every number in the comparison from the plans module", () => {
    const row = (id: string) => PRICING_ROWS.find((r) => r.id === id)!;
    expect(row("seats").team.arg).toBe(PLANS.team.minSeats);
    expect(row("credits").team.arg).toBe(PLANS.team.credits.amount);
    expect(row("agents").team.arg).toBe(PLANS.team.later.customAgents);
    expect(row("triggers").team.arg).toBe(PLANS.team.later.agentTriggers);
    expect(PRICING_ROWS.every((r) => Object.keys(r).every((k) => ["id", "label", "team", "business", "soon"].includes(k)))).toBe(true);
    expect(row("chat").team.key).toBe("pricing.v.unlimited");
  });

  it("lists email support within 2 business days and the audit trail on Tim (D131)", () => {
    const row = (id: string) => PRICING_ROWS.find((r) => r.id === id)!;
    expect(row("support").team).toEqual({ key: "pricing.v.emailDays", arg: 2 });
    expect(row("audit").team.key).toBe("pricing.v.included");
  });

  it("shows Bisnis next to Tim from PRD-20 §5.2, never as a plan that can be bought (D109; PO 19 Oct 2026)", () => {
    const row = (id: string) => PRICING_ROWS.find((r) => r.id === id)!;
    expect(Object.keys(PLANS)).not.toContain("business");
    expect(UPCOMING_PLANS.business.price).toEqual({ yearly: 119_000, monthly: 139_000 });
    expect(row("credits").business).toEqual({ key: "pricing.v.perSeat", arg: 300 });
    expect(row("storage").team.arg).toBe(5);
    expect(row("storage").business.arg).toBe(20);
    expect(row("trash").business.arg).toBe(90);
    expect(row("auditViewer").team.key).toBe("pricing.v.none");
    expect(row("auditViewer").business).toEqual({ key: "pricing.v.lastDays", arg: 90 });
    for (const id of ["memberCap", "privateProject", "deepMode"]) {
      expect([row(id).team.key, row(id).business.key], id).toEqual(["pricing.v.none", "pricing.v.included"]);
    }
    expect(row("agents").business.key).toBe("pricing.v.unlimited");
  });

  it("keeps the Enterprise plan off the public site while it is on hold (D153)", () => {
    expect(Object.keys(PLANS)).not.toContain("enterprise");
    expect(Object.keys(UPCOMING_PLANS)).not.toContain("enterprise");
    const pub = [...PUBLIC_KEYS, ...PRICING_SECTION_KEYS];
    for (const [lang, catalog] of [["en", en], ["id", id]] as const) {
      const hits = pub.filter((k) => /enterprise/i.test(String((catalog as Record<string, string>)[k])));
      expect(hits, lang).toEqual([]);
      expect(readFileSync(`src/content/legal/${lang}/faq.md`, "utf8"), lang).not.toMatch(/enterprise/i);
    }
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
