// Plans at launch (PRD-20 §5.2 as amended: D149 no Free plan, a 14-day trial then Tim; D110 final prices
// without VAT; D117 monthly and yearly cycles). One source for the public pricing page now and for billing
// (BE-12, FE-13) later, so a price can never differ between what is shown and what is charged. Rupiah per
// seat per month; yearly is the default cycle.
export type Cycle = "yearly" | "monthly";

// `later`: entitlements of apps that ship after the first release (PRD-17 agents, PRD-19 App Center, PRD-14
// Chat, PRD-06 Timeline, PRD-21 AI teams), shown on the pricing page as "coming soon" (PO, 7 Oct 2026).
// null = unlimited.
export const PLANS = {
  team: {
    price: { yearly: 59_000, monthly: 69_000 }, maxSeats: null, minSeats: 3, activeProjects: null, credits: { amount: 100, per: "seat" }, trashDays: 30,
    support: { channel: "email", replyBusinessDays: 2 }, auditTrail: true,
    later: { customAgents: 10, agentTriggers: 5, appConnections: null, chatHistoryDays: null, timeline: true, aiTeams: 1 },
  },
} as const;

export type PlanId = keyof typeof PLANS;

/** What Tim holds that the comparison on /harga needs and PLANS.team does not carry (PRD-20 §5.2, §5.4). */
export const TEAM_EXTRAS = { storageGbPerSeat: 5, auditViewerDays: null, memberCreditCap: false, deepMode: false, restrictedProject: false, insights: "project", appTier: "core" } as const;

/** Plans shown for comparison but not sold yet. Bisnis opens together with the features that set it apart
 *  (D109, P1-19); its numbers are PRD-20 §5.2 and §5.4 and may change before it opens. Never used to charge. */
export const UPCOMING_PLANS = {
  business: {
    price: { yearly: 119_000, monthly: 139_000 }, minSeats: 3, credits: { amount: 300, per: "seat" }, trashDays: 90,
    storageGbPerSeat: 20, auditViewerDays: 90, memberCreditCap: true, deepMode: true, restrictedProject: true, insights: "full",
    support: { channel: "email", replyHours: 24 }, appTier: "advanced",
    later: { customAgents: null, agentTriggers: null, aiTeams: null, chatHistoryDays: null, timeline: true },
  },
} as const;

/** agere is not a PKP at GA (D110): prices are final and invoices carry no VAT line. */
export const PRICES_INCLUDE_VAT = false;

/** Early bird (D113 as amended by D151): 10 organizations of 3–15 people, every Tim feature free for 60 days,
 * then the Tim price locked for 12 months. No closing date: the program opens after gate R2 (PRD-00 §0.5)
 * and until then the sign-up form is a waitlist. AI credits follow D137: 100 per active member a month,
 * at least 300, at most 1,500. */
export const EARLY_BIRD = {
  places: 10,
  minPeople: 3,
  maxPeople: 15,
  freeDays: 60,
  credits: { perMember: 100, min: 300, max: 1_500 },
  priceLockMonths: 12,
  waitlist: true,
} as const;

/** An early bird organization's AI credits for the month, from its active members on the 1st (D137). */
export function earlyBirdCredits(activeMembers: number): number {
  const { perMember, min, max } = EARLY_BIRD.credits;
  return Math.min(max, Math.max(min, perMember * activeMembers));
}

/** Trial AI credits per new organization (D88, D116): own email domain or a free email address. */
export const TRIAL_CREDITS = { ownDomain: 500, freeEmail: 150 } as const;

/** Every Tim feature for 14 days (D116, D149). */
export const TRIAL_DAYS = 14;

/** One extension of 16 days, 30 in total, for teams with at least 3 active members and 1 project (D150). */
export const TRIAL_EXTENSION = { days: 16, totalDays: 30, minActiveMembers: 3, minProjects: 1 } as const;

/** Whole-percent saving of yearly over monthly on Tim: 1 − 59/69 ≈ 14 % (PRD-20 §5.2 gives 14,5 %). */
export const yearlySaving = () => Math.floor((1 - PLANS.team.price.yearly / PLANS.team.price.monthly) * 100);
