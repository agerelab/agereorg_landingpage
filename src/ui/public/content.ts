// What the public home and pricing pages say (FE-18). The comparison shows what the Tim plan, and so the
// 14-day trial, holds at the first release (PRD-00 §0, D149) and, marked "coming soon", the apps that follow
// (PO, 7 Oct 2026), so nothing reads as available before it is.
import type { MessageKey } from "@/i18n";
import { PLANS, TEAM_EXTRAS, UPCOMING_PLANS } from "@/modules/billing/plans";
import { LEGAL_DOCS } from "@/ui/legal/docs";

export type Cell = { key: MessageKey; arg?: number };
export type PricingRow = { id: string; label: MessageKey; team: Cell; business: Cell; soon?: true };

const later = (n: number | null, some: MessageKey, none: MessageKey = "pricing.v.none"): Cell => (n === null ? { key: "pricing.v.unlimited" } : n === 0 ? { key: none } : { key: some, arg: n });
const yes = (on: boolean): Cell => ({ key: on ? "pricing.v.included" : "pricing.v.none" });
const T = { ...PLANS.team, ...TEAM_EXTRAS };
const B = UPCOMING_PLANS.business;

/** Tim, which the 14-day trial holds too (D149), next to Bisnis, which follows (D109). Only what a buyer can
 *  read without our internal names (PO, 19 Oct 2026): no undecided items, no rollout phases. */
export const PRICING_ROWS: PricingRow[] = [
  { id: "workspace", label: "pricing.row.workspace", team: yes(true), business: yes(true) },
  { id: "seats", label: "pricing.row.seats", team: { key: "pricing.v.seatsMin", arg: T.minSeats }, business: { key: "pricing.v.seatsMin", arg: B.minSeats } },
  { id: "projects", label: "pricing.row.projects", team: { key: "pricing.v.unlimited" }, business: { key: "pricing.v.unlimited" } },
  { id: "credits", label: "pricing.row.credits", team: { key: "pricing.v.perSeat", arg: T.credits.amount }, business: { key: "pricing.v.perSeat", arg: B.credits.amount } },
  { id: "goals", label: "pricing.row.goals", team: yes(true), business: yes(true) },
  { id: "memberCap", label: "pricing.row.memberCap", team: yes(T.memberCreditCap), business: yes(B.memberCreditCap) },
  { id: "storage", label: "pricing.row.storage", team: { key: "pricing.v.gbPerSeat", arg: T.storageGbPerSeat }, business: { key: "pricing.v.gbPerSeat", arg: B.storageGbPerSeat } },
  { id: "trash", label: "pricing.row.trash", team: { key: "pricing.v.days", arg: T.trashDays }, business: { key: "pricing.v.days", arg: B.trashDays } },
  { id: "insights", label: "pricing.row.insights", team: { key: "pricing.v.perProject" }, business: { key: "pricing.v.fullInsights" } },
  { id: "restricted", label: "pricing.row.restricted", team: yes(true), business: yes(true) },
  { id: "privateProject", label: "pricing.row.privateProject", team: yes(T.restrictedProject), business: yes(B.restrictedProject) },
  { id: "audit", label: "pricing.row.audit", team: yes(T.auditTrail), business: yes(true) },
  { id: "auditViewer", label: "pricing.row.auditViewer", team: yes(false), business: { key: "pricing.v.lastDays", arg: B.auditViewerDays } },
  { id: "support", label: "pricing.row.support", team: { key: "pricing.v.emailDays", arg: T.support.replyBusinessDays }, business: { key: "pricing.v.priorityHours", arg: B.support.replyHours } },
  { id: "deepMode", label: "pricing.row.deepMode", team: yes(T.deepMode), business: yes(B.deepMode), soon: true },
  { id: "agents", label: "pricing.row.agents", team: later(T.later.customAgents, "pricing.v.count"), business: later(B.later.customAgents, "pricing.v.count"), soon: true },
  { id: "triggers", label: "pricing.row.triggers", team: later(T.later.agentTriggers, "pricing.v.count"), business: later(B.later.agentTriggers, "pricing.v.count"), soon: true },
  { id: "aiTeams", label: "pricing.row.aiTeams", team: later(T.later.aiTeams, "pricing.v.teams"), business: later(B.later.aiTeams, "pricing.v.teams"), soon: true },
  { id: "apps", label: "pricing.row.apps", team: { key: "pricing.v.appsCore" }, business: { key: "pricing.v.appsAdvanced" }, soon: true },
  { id: "chat", label: "pricing.row.chat", team: later(T.later.chatHistoryDays, "pricing.v.days"), business: later(B.later.chatHistoryDays, "pricing.v.days"), soon: true },
  { id: "timeline", label: "pricing.row.timeline", team: yes(T.later.timeline), business: yes(B.later.timeline), soon: true },
];

/** Fictional people in the mock-ups; photos generated for the PO (FE-18 v2), names are not translated. */
export const PEOPLE = {
  rina: { name: "Rina Kartika", src: "/landing/avatars/rina-kartika.jpg" },
  sari: { name: "Sari Anjani", src: "/landing/avatars/sari-anjani.jpg" },
  dimas: { name: "Dimas Wicaksono", src: "/landing/avatars/dimas-wicaksono.jpg" },
  yoga: { name: "Yoga Wiratama", src: "/landing/avatars/yoga-wiratama.jpg" },
} as const;

export const MOCK_KEYS: MessageKey[] = [
  "mock.label", "mock.url", "mock.myTasks", "mock.summary", "mock.search", "mock.todayCount", "mock.weekCount", "mock.today", "mock.done", "mock.pTalent", "mock.pOps", "mock.t1", "mock.t2", "mock.t3", "mock.t4", "mock.t5", "mock.approval", "mock.ai.title", "mock.ai.meta", "mock.ai.goalLabel", "mock.ai.goal", "mock.ai.e1", "mock.ai.e2", "mock.ai.e3", "mock.ai.nothing", "mock.ai.edit", "mock.ai.approve", "mock.d.status", "mock.d.todo", "mock.d.doing", "mock.d.assignee", "mock.d.due", "mock.d.subtasks", "mock.d.progress", "mock.d.s1", "mock.d.s2", "mock.d.s3", "mock.d.when", "mock.d.comment", "mock.d.summary",
];

/** Apps after GA, listed under "Fitur yang menyusul" (FE-18 v2). */
export const SOON_APPS: MessageKey[] = ["ps.soon.doc", "ps.soon.chat", "ps.soon.apps", "ps.soon.agents", "ps.soon.skills", "ps.soon.aiOrg", "ps.soon.timeline"];

export const PRICING_SECTION_KEYS: MessageKey[] = [
  "ps.eyebrow", "ps.title", "ps.lead", "ps.cycle", "ps.yearly", "ps.save", "ps.monthly", "ps.trial.name", "ps.trial.desc", "ps.trial.note1", "ps.trial.note2", "ps.trial.cta", "ps.trial.f1", "ps.trial.f2", "ps.trial.f3", "ps.trial.f4", "ps.trial.f5", "ps.trash", "ps.team.name", "ps.team.badge", "ps.team.desc", "ps.team.perSeatYearly", "ps.team.perYear", "ps.team.perSeatMonthly", "ps.team.cta", "ps.team.f1", "ps.team.f2", "ps.team.f4", "ps.team.f5", "ps.eb.name", "ps.eb.badge", "ps.eb.desc", "ps.eb.note1", "ps.eb.note2", "ps.eb.cta", "ps.eb.credits", "ps.eb.f2", "ps.eb.f3", "ps.eb.f4", "ps.after.title", "ps.after.body", "ps.soon.title", "ps.soon.body", "ps.soon.doc", "ps.soon.chat", "ps.soon.apps", "ps.soon.agents", "ps.soon.skills", "ps.soon.aiOrg", "ps.soon.timeline",
];

/** The pixel bird at the top of the early bird dialog: hidden for now (PO, 9 Oct 2026). */
export const SHOW_EB_ILLUSTRATION = false;

/** The refund policy: shown with its final text (D134; hidden 9-12 Oct 2026). false hides every link to it
 *  and its page answers 404. */
export const SHOW_REFUND = true;

/** The legal documents the footer links to. */
export const VISIBLE_LEGAL_DOCS = LEGAL_DOCS.filter((d) => SHOW_REFUND || d.slug !== "refund");

export const HOME_KEYS: MessageKey[] = [
  "ebt.eyebrow", "ebt.title", "ebt.body", "ebt.terms", "ebt.timeline", "ebt.s1.when", "ebt.s1.body", "ebt.s2.when", "ebt.s2.body", "ebt.s3.when", "ebt.s3.body", "ebt.stat.places", "ebt.stat.days", "ebt.stat.months", "ebt.stat.lock", "footer.tagline", "footer.product", "footer.help", "footer.legal", "footer.faq", "footer.copyright",
];

export const FEATURE_KEYS: MessageKey[] = [
  "f.live", "f.soon", "f.prod.eyebrow", "f.prod.title", "f.prod.body", "f.desk.name", "f.desk.title", "f.desk.body", "f.desk.c1", "f.desk.c2", "f.desk.c3", "f.desk.mock", "f.doc.name", "f.doc.title", "f.doc.body", "f.doc.c1", "f.doc.c2", "f.doc.c3", "f.doc.mock", "sc.space.url", "sc.space.moved", "sc.desk.url", "sc.desk.inbox", "sc.desk.read", "sc.desk.r1", "sc.desk.r2", "sc.desk.r3", "sc.desk.t1", "sc.desk.t2", "sc.desk.t3", "sc.doc.url", "sc.doc.folder", "sc.doc.d1", "sc.doc.d2", "sc.doc.d3", "sc.doc.h2", "sc.doc.c1", "sc.doc.c2", "sc.doc.c3", "sc.doc.saved", "f.chat.name", "f.chat.title", "f.chat.body", "f.chat.c1", "f.chat.c2", "f.chat.c3", "f.chat.mock", "f.apps.name", "f.apps.title", "f.apps.body", "f.apps.c1", "f.apps.c2", "f.apps.c3", "f.apps.mock", "sc.chat.url", "sc.chat.channels", "sc.chat.dms", "sc.chat.ch1", "sc.chat.ch2", "sc.chat.ch3", "sc.chat.members", "sc.chat.m1", "sc.chat.m2", "sc.chat.m3", "sc.chat.t1", "sc.chat.t2", "sc.chat.t3", "sc.chat.toTask", "sc.chat.task", "sc.chat.taskMeta", "sc.chat.typing", "sc.chat.compose", "sc.apps.url", "sc.apps.title", "sc.apps.sub", "sc.apps.catCalendar", "sc.apps.catDesign", "sc.apps.pr", "sc.apps.linked", "sc.apps.open", "sc.apps.file", "sc.apps.attached", "f.ai.eyebrow", "f.ai.title", "f.ai.body", "f.agent.name", "f.agent.title", "f.agent.body", "f.agent.c1", "f.agent.c2", "f.agent.c3", "f.agent.mock", "f.aiorg.name", "f.aiorg.title", "f.aiorg.body", "f.aiorg.c1", "f.aiorg.c2", "f.aiorg.c3", "f.aiorg.mock", "sc.agent.url", "sc.agent.name", "sc.agent.meta", "sc.agent.ask", "sc.agent.reading", "sc.agent.answer", "sc.agent.proposal", "sc.agent.tasks", "sc.agent.source", "sc.agent.review", "sc.agent.approve", "sc.agent.done", "sc.agent.perms", "sc.agent.p1", "sc.agent.p2", "sc.agent.p3", "sc.agent.p4", "sc.agent.p5", "sc.agent.read", "sc.agent.approval", "sc.agent.denied", "sc.agent.context", "sc.agent.space", "sc.org.url", "sc.org.goal", "sc.org.create", "sc.org.reuse", "sc.org.skip", "sc.org.unchanged", "sc.org.review", "sc.org.you", "sc.org.coord", "sc.org.coordRole", "sc.org.research", "sc.org.product", "sc.org.design", "sc.org.eng", "sc.org.qa", "sc.org.s1", "sc.org.s2", "sc.org.wait",
];

/** "Sign in" in the public header; hidden until the app opens, the early bird is the way in (PO, 9 Oct 2026). */
export const SHOW_SIGN_IN = false;

/** Header links of the public site; a section joins when it ships, so no link points at nothing. */
export const SITE_NAV: { href: string; key: MessageKey }[] = [
  { href: "/#produktivitas", key: "f.prod.eyebrow" },
  { href: "/early-bird", key: "site.nav.earlyBird" },
  { href: "/#faq", key: "footer.faq" },
];

export const PROBLEMS: { title: MessageKey; body: MessageKey }[] = [
  { title: "problem.p1.title", body: "problem.p1.body" },
  { title: "problem.p2.title", body: "problem.p2.body" },
  { title: "problem.p3.title", body: "problem.p3.body" },
];

/** Every catalog key the landing and pricing pages use. */
export const PUBLIC_KEYS: MessageKey[] = [
  "public.nav.home", "public.nav.pricing", "public.nav.signIn",
  "site.home", "site.nav.label", "site.nav.mobile", "site.nav.earlyBird", "site.menu.open", "site.menu.close", "site.cta.earlyBird",
  "hero.pill", "hero.title", "hero.lead", "hero.ctaHow", "hero.meta", "problem.eyebrow", "problem.title",
  ...PROBLEMS.flatMap((p) => [p.title, p.body]),
  "pricing.title", "pricing.lead", "pricing.compare", "pricing.compareLead", "pricing.feature", "pricing.team.name",
  "pricing.business.name", "pricing.perSeatYearly", "pricing.businessNote", "pricing.soon", "pricing.soonNote", "pricing.v.none",
  ...PRICING_ROWS.flatMap((r) => [r.label, r.team.key, r.business.key]),
];
