// Plans at GA (PRD-20 §5.2 as amended: D109 Free + Tim only, D110 final prices without VAT, D116 trial,
// D117 monthly and yearly cycles). One source for the public pricing page now and for billing (BE-12,
// FE-13) later, so a price can never differ between what is shown and what is charged. Rupiah per seat
// per month; yearly is the default cycle.
export type Cycle = "yearly" | "monthly";

// `later`: entitlements of apps that ship after GA (PRD-17 agents, PRD-19 App Center, PRD-14 Chat, PRD-06
// Timeline, PRD-21 AI teams), shown on the pricing page as "coming soon" (PO, 7 Oct 2026). null = unlimited.
export const PLANS = {
  free: {
    price: { yearly: 0, monthly: 0 }, maxSeats: 5, minSeats: 1, activeProjects: 5, credits: { amount: 50, per: "workspace" }, trashDays: 7,
    // D131: email support on every plan; audit rows are kept on every plan (the viewer stays on Bisnis).
    support: { channel: "email", replyBusinessDays: null }, auditTrail: true,
    later: { customAgents: 1, agentTriggers: 0, appConnections: 2, chatHistoryDays: 90, timeline: false, aiTeams: 0 },
  },
  team: {
    price: { yearly: 59_000, monthly: 69_000 }, maxSeats: null, minSeats: 3, activeProjects: null, credits: { amount: 100, per: "seat" }, trashDays: 30,
    support: { channel: "email", replyBusinessDays: 2 }, auditTrail: true,
    later: { customAgents: 10, agentTriggers: 5, appConnections: null, chatHistoryDays: null, timeline: true, aiTeams: 1 },
  },
} as const;

export type PlanId = keyof typeof PLANS;

/** agere is not a PKP at GA (D110): prices are final and invoices carry no VAT line. */
export const PRICES_INCLUDE_VAT = false;

/** Early bird (D113, closing date D131): 10 organizations of 3–15 people, every Tim feature free for 90 days,
 * then the Tim price locked for 12 months; sign-up closes 8 January 2027. AI credits follow the Early Bird
 * Program Terms v1.0 (D137, was a flat 1,000): 100 per active member a month, at least 300, at most 1,500. */
export const EARLY_BIRD = {
  places: 10,
  minPeople: 3,
  maxPeople: 15,
  freeDays: 90,
  credits: { perMember: 100, min: 300, max: 1_500 },
  priceLockMonths: 12,
  closesOn: "2027-01-08",
} as const;

/** An early bird organization's AI credits for the month, from its active members on the 1st (D137). */
export function earlyBirdCredits(activeMembers: number): number {
  const { perMember, min, max } = EARLY_BIRD.credits;
  return Math.min(max, Math.max(min, perMember * activeMembers));
}

/** Trial AI credits per new organization (D88, D116): own email domain or a free email address. */
export const TRIAL_CREDITS = { ownDomain: 500, freeEmail: 150 } as const;

/** Every Tim feature for 14 days (D116). */
export const TRIAL_DAYS = 14;

/** Whole-percent saving of yearly over monthly on Tim: 1 − 59/69 ≈ 14 % (PRD-20 §5.2 gives 14,5 %). */
export const yearlySaving = () => Math.floor((1 - PLANS.team.price.yearly / PLANS.team.price.monthly) * 100);
