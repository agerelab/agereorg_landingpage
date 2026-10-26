// FE-18 slice 2a (PRD-20 §5.2 as amended by D109, D110, D116, D117; PRD-00 OPS-01): one source of plan
// numbers for the public pages now and billing later; the landing page is public at its own address.
import { describe, expect, it } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import { formatMoney } from "@/i18n/format";
import { isPublicPath } from "@/proxy";
import { EARLY_BIRD, PLANS, PRICES_INCLUDE_VAT, TRIAL_DAYS, yearlySaving } from "@/modules/billing/plans";
import { existsSync } from "node:fs";
import { FEATURE_KEYS, HOME_KEYS, MOCK_KEYS, PEOPLE, PUBLIC_KEYS, SITE_NAV } from "@/ui/public/content";
import { CONTROL_KEYS } from "@/ui/public/control-section";

describe("FE-18 — plans at GA (PRD-20)", () => {
  it("offers only Free and Tim at GA (D109)", () => {
    expect(Object.keys(PLANS)).toEqual(["free", "team"]);
  });

  it("prices Tim per seat per month: Rp59.000 yearly (default), Rp69.000 monthly (D117)", () => {
    expect(PLANS.team.price).toEqual({ yearly: 59_000, monthly: 69_000 });
    expect(PLANS.free.price).toEqual({ yearly: 0, monthly: 0 });
    expect(yearlySaving()).toBe(14);
  });

  it("states final prices without VAT, because agere is not a PKP at GA (D110)", () => {
    expect(PRICES_INCLUDE_VAT).toBe(false);
  });

  it("keeps the seat, project, credit and trash limits of §5.2 and a 14-day Tim trial (D116)", () => {
    expect(PLANS.free).toMatchObject({ maxSeats: 5, activeProjects: 5, credits: { amount: 50, per: "workspace" }, trashDays: 7 });
    expect(PLANS.team).toMatchObject({ minSeats: 3, activeProjects: null, credits: { amount: 100, per: "seat" }, trashDays: 30 });
    expect(TRIAL_DAYS).toBe(14);
  });

  it("takes the limits of the apps that follow GA from PRD-20 §5.2 and the AI Organization amendment", () => {
    expect(PLANS.free.later).toEqual({ customAgents: 1, agentTriggers: 0, appConnections: 2, chatHistoryDays: 90, timeline: false, aiTeams: 0 });
    expect(PLANS.team.later).toEqual({ customAgents: 10, agentTriggers: 5, appConnections: null, chatHistoryDays: null, timeline: true, aiTeams: 1 });
  });

  it("keeps the early bird terms of D113, the closing date of D131 and the credits of D137", () => {
    expect(EARLY_BIRD).toEqual({ places: 10, minPeople: 3, maxPeople: 15, freeDays: 90, credits: { perMember: 100, min: 300, max: 1500 }, priceLockMonths: 12, closesOn: "2027-01-08" });
    expect(PLANS.free.support).toEqual({ channel: "email", replyBusinessDays: null });
    expect(PLANS.team.support).toEqual({ channel: "email", replyBusinessDays: 2 });
  });

  it("writes rupiah the way each language does", () => {
    expect(formatMoney("id", PLANS.team.price.yearly)).toBe("Rp59.000");
    expect(formatMoney("en", PLANS.team.price.yearly)).toMatch(/IDR\s?59,000/);
  });
});

describe("FE-18 — landing page", () => {
  it("is readable without signing in at / and /beranda", () => {
    expect(isPublicPath("/")).toBe(true);
    expect(isPublicPath("/beranda")).toBe(true);
    expect(isPublicPath("/harga")).toBe(true);
  });

  it("links the site header only to public pages that exist; pricing only from the footer (FE-18 v2, D134)", () => {
    expect(SITE_NAV.map((n) => n.href)).toEqual(["/#produktivitas", "/early-bird", "/#faq"]);
    for (const n of SITE_NAV) expect(isPublicPath(n.href.split("#")[0] || "/")).toBe(true);
  });

  it("shows the fictional people with their photos in public/ (FE-18 v2)", () => {
    for (const p of Object.values(PEOPLE)) expect(existsSync(`public${p.src}`), p.src).toBe(true);
  });

  it("exists in English and Bahasa Indonesia", () => {
    for (const key of [...PUBLIC_KEYS, ...MOCK_KEYS, ...HOME_KEYS, ...FEATURE_KEYS, ...CONTROL_KEYS]) {
      expect(en, key).toHaveProperty([key]);
      expect(id, key).toHaveProperty([key]);
    }
  });
});
