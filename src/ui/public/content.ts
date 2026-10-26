// What the public home and pricing pages say (FE-18). The comparison shows what ships at GA
// (PRD-00 §0) and, marked "coming soon", the apps that follow (PO, 7 Oct 2026), so nothing reads as
// available before it is.
import type { MessageKey } from "@/i18n";
import { PLANS } from "@/modules/billing/plans";
import { LEGAL_DOCS } from "@/ui/legal/docs";

export type Cell = { key: MessageKey; arg?: number };
export type PricingRow = { id: string; label: MessageKey; free: Cell; team: Cell; soon?: true };

const later = (n: number | null, some: MessageKey, none: MessageKey = "pricing.v.none"): Cell => (n === null ? { key: "pricing.v.unlimited" } : n === 0 ? { key: none } : { key: some, arg: n });
const L = { free: PLANS.free.later, team: PLANS.team.later };

export const PRICING_ROWS: PricingRow[] = [
  { id: "seats", label: "pricing.row.seats", free: { key: "pricing.v.seatsMax", arg: PLANS.free.maxSeats }, team: { key: "pricing.v.seatsMin", arg: PLANS.team.minSeats } },
  { id: "projects", label: "pricing.row.projects", free: { key: "pricing.v.count", arg: PLANS.free.activeProjects }, team: { key: "pricing.v.unlimited" } },
  { id: "credits", label: "pricing.row.credits", free: { key: "pricing.v.perWorkspace", arg: PLANS.free.credits.amount }, team: { key: "pricing.v.perSeat", arg: PLANS.team.credits.amount } },
  { id: "trash", label: "pricing.row.trash", free: { key: "pricing.v.days", arg: PLANS.free.trashDays }, team: { key: "pricing.v.days", arg: PLANS.team.trashDays } },
  { id: "insights", label: "pricing.row.insights", free: { key: "pricing.v.namesRoles" }, team: { key: "pricing.v.perProject" } },
  { id: "restricted", label: "pricing.row.restricted", free: { key: "pricing.v.included" }, team: { key: "pricing.v.included" } },
  { id: "audit", label: "pricing.row.audit", free: { key: PLANS.free.auditTrail ? "pricing.v.included" : "pricing.v.none" }, team: { key: PLANS.team.auditTrail ? "pricing.v.included" : "pricing.v.none" } },
  { id: "support", label: "pricing.row.support", free: { key: "pricing.v.email" }, team: { key: "pricing.v.emailDays", arg: PLANS.team.support.replyBusinessDays } },
  { id: "agents", label: "pricing.row.agents", free: later(L.free.customAgents, "pricing.v.count"), team: later(L.team.customAgents, "pricing.v.count"), soon: true },
  { id: "triggers", label: "pricing.row.triggers", free: later(L.free.agentTriggers, "pricing.v.count"), team: later(L.team.agentTriggers, "pricing.v.count"), soon: true },
  { id: "aiTeams", label: "pricing.row.aiTeams", free: later(L.free.aiTeams, "pricing.v.teams"), team: later(L.team.aiTeams, "pricing.v.teams"), soon: true },
  { id: "apps", label: "pricing.row.apps", free: later(L.free.appConnections, "pricing.v.connections"), team: { key: "pricing.v.allApps" }, soon: true },
  { id: "chat", label: "pricing.row.chat", free: later(L.free.chatHistoryDays, "pricing.v.days"), team: later(L.team.chatHistoryDays, "pricing.v.days"), soon: true },
  { id: "timeline", label: "pricing.row.timeline", free: { key: L.free.timeline ? "pricing.v.included" : "pricing.v.none" }, team: { key: L.team.timeline ? "pricing.v.included" : "pricing.v.none" }, soon: true },
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
  "ps.eyebrow", "ps.title", "ps.lead", "ps.cycle", "ps.yearly", "ps.save", "ps.monthly", "ps.free.name", "ps.free.desc", "ps.free.note", "ps.free.cta", "ps.free.ctaNote", "ps.free.f1", "ps.free.f2", "ps.free.f4", "ps.free.f6", "ps.credits.org", "ps.trash", "ps.team.name", "ps.team.badge", "ps.team.desc", "ps.team.perSeatYearly", "ps.team.perYear", "ps.team.perSeatMonthly", "ps.team.cta", "ps.team.f1", "ps.team.f2", "ps.team.f4", "ps.team.f5", "ps.eb.name", "ps.eb.badge", "ps.eb.desc", "ps.eb.note1", "ps.eb.note2", "ps.eb.cta", "ps.eb.credits", "ps.eb.f2", "ps.eb.f3", "ps.eb.f4", "ps.trial.title", "ps.trial.body", "ps.soon.title", "ps.soon.body", "ps.soon.doc", "ps.soon.chat", "ps.soon.apps", "ps.soon.agents", "ps.soon.skills", "ps.soon.aiOrg", "ps.soon.timeline",
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

/** Pricing section and page: hidden for early bird / pre-launch phase. */
export const SHOW_PRICING = false;

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
  "pricing.title", "pricing.lead", "pricing.compare", "pricing.feature", "pricing.free.name", "pricing.team.name",
  "pricing.soon", "pricing.soonNote", "pricing.v.none",
  ...PRICING_ROWS.flatMap((r) => [r.label, r.free.key, r.team.key]),
];
