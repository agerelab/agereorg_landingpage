// FE-18 slice 2a (PRD-20 §5.2 as amended by D110, D116, D117, D149–D151; PRD-00 OPS-01): one source of plan
// numbers for the public pages now and billing later; the landing page is public at its own address.
import { describe, expect, it } from "vitest";
import en from "@/i18n/en.json";
import id from "@/i18n/id.json";
import { formatMoney } from "@/i18n/format";
import { isPublicPath } from "@/proxy";
import { EARLY_BIRD, PLANS, PRICES_INCLUDE_VAT, TRIAL_DAYS, TRIAL_EXTENSION, yearlySaving } from "@/modules/billing/plans";
import { existsSync } from "node:fs";
import { FEATURE_KEYS, HOME_KEYS, MOCK_KEYS, PEOPLE, PUBLIC_KEYS, SITE_NAV } from "@/ui/public/content";
import { CONTROL_KEYS } from "@/ui/public/control-section";

describe("FE-18 — plans at GA (PRD-20)", () => {
  it("offers only Tim, after a 14-day trial: there is no Free plan (D149)", () => {
    expect(Object.keys(PLANS)).toEqual(["team"]);
  });

  it("prices Tim per seat per month: Rp59.000 yearly (default), Rp69.000 monthly (D117)", () => {
    expect(PLANS.team.price).toEqual({ yearly: 59_000, monthly: 69_000 });
    expect(yearlySaving()).toBe(14);
  });

  it("states final prices without VAT, because agere is not a PKP at GA (D110)", () => {
    expect(PRICES_INCLUDE_VAT).toBe(false);
  });

  it("keeps the Tim limits of §5.2, a 14-day Tim trial (D116) and one extension to 30 days for active teams (D150)", () => {
    expect(PLANS.team).toMatchObject({ minSeats: 3, activeProjects: null, credits: { amount: 100, per: "seat" }, trashDays: 30 });
    expect(TRIAL_DAYS).toBe(14);
    expect(TRIAL_EXTENSION).toEqual({ days: 16, totalDays: 30, minActiveMembers: 3, minProjects: 1 });
    expect(TRIAL_DAYS + TRIAL_EXTENSION.days).toBe(TRIAL_EXTENSION.totalDays);
  });

  it("takes the limits of the apps that follow GA from PRD-20 §5.2 and the AI Organization amendment", () => {
    expect(PLANS.team.later).toEqual({ customAgents: 10, agentTriggers: 5, appConnections: null, chatHistoryDays: null, timeline: true, aiTeams: 1 });
  });

  it("keeps the early bird of D151: 60 days, a waitlist with no closing date, the credits of D137", () => {
    expect(EARLY_BIRD).toEqual({ places: 10, minPeople: 3, maxPeople: 15, freeDays: 60, credits: { perMember: 100, min: 300, max: 1500 }, priceLockMonths: 12, waitlist: true });
    expect(PLANS.team.support).toEqual({ channel: "email", replyBusinessDays: 2 });
  });

  it("writes rupiah the way each language does", () => {
    expect(formatMoney("id", PLANS.team.price.yearly)).toBe("Rp59.000");
    expect(formatMoney("en", PLANS.team.price.yearly)).toMatch(/IDR\s?59,000/);
  });
});

describe("FE-18 — landing page", () => {
  it("is readable at / (home, live since landingpage PR #160) and /beranda redirects there", () => {
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
