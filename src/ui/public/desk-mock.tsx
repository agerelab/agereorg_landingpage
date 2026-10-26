// The Desk mock-up under the hero (FE-18 v2, agere-org-landing-v2.html): My tasks on the left, an AI proposal
// waiting for approval on the right. It plays a short scene (PO, 7 Oct 2026): the pointer opens a task, its
// detail slides in, the status moves to In progress, a subtask is ticked, Sari comments and AI sums it up. A
// picture of the product (role="img"), not a working screen; the people are fictional (photos generated for the PO).
import { Check, Inbox, LayoutGrid, MousePointer2, Search, Settings, Sparkles, X } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { Locale, MessageKey, translator } from "@/i18n";
import { formatIsoDate } from "@/i18n/format";
import { cn } from "@/lib/utils";
import { at } from "@/ui/auth/showcase-kit";
import s from "@/ui/auth/feature-showcase.module.css";
import { PEOPLE } from "./content";
import m from "./desk-mock.module.css";
import { Replay } from "./features/stage";

type T = ReturnType<typeof translator>;
type Row = { title: MessageKey; project: MessageKey; due: MessageKey | string; who: keyof typeof PEOPLE; state?: "half" | "done" };

const TODAY: Row[] = [
  { title: "mock.t1", project: "mock.pTalent", due: "mock.today", who: "rina" },
  { title: "mock.t2", project: "mock.pOps", due: "mock.today", who: "rina", state: "half" },
];
const WEEK: Row[] = [
  { title: "mock.t3", project: "mock.pTalent", due: "2026-10-09", who: "sari" },
  { title: "mock.t4", project: "mock.pOps", due: "2026-10-10", who: "rina" },
  { title: "mock.t5", project: "mock.pOps", due: "mock.done", who: "rina", state: "done" },
];

// The scene, in seconds from the moment it plays. On a phone the detail covers the list and leaves out Sari's
// comment so the AI summary still fits.
const CLICK = 1.2; // the pointer starts moving; it clicks about 1.2 s later (desk-mock.module.css)
const OPEN = 2.7;
const STATUS = 4.4;
const TICK = 5;
const COMMENT = 6;
const SUMMARY = 6.8;
const RING = 7.4;

const ink = "hsl(var(--ag-bg-inverted))";
const half = { background: `linear-gradient(90deg, ${ink} 50%, transparent 50%)` };

function Ring({ state }: { state?: Row["state"] }) {
  return (
    <span
      aria-hidden
      className={cn("size-3.5 shrink-0 rounded-full border-[1.5px]", state ? "border-[hsl(var(--ag-bg-inverted))]" : "border-control", state === "done" && "bg-inverted")}
      style={state === "half" ? half : undefined}
    />
  );
}

function Rows({ t, locale, rows, from, picked }: { t: T; locale: Locale; rows: Row[]; from: number; picked?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-default bg-default">
      {rows.map((r, i) => (
        <div key={r.title} className={cn("relative flex min-h-11 min-w-0 items-center gap-3 border-b border-default px-3.5 last:border-b-0", s.rise)} style={at(from + i * 0.12)}>
          {i === picked && <span aria-hidden className={cn("absolute inset-0 bg-subtle", s.pop)} style={at(CLICK + 1.2)} />}
          <span className="relative grid shrink-0 place-items-center">
            <Ring state={r.state} />
            {i === picked && <span aria-hidden className={cn("absolute inset-0 rounded-full border-[1.5px] border-[hsl(var(--ag-bg-inverted))] bg-default", s.pop)} style={{ ...half, ...at(RING) }} />}
          </span>
          <span className={cn("relative min-w-0 grow truncate text-sm font-medium", r.state === "done" && "text-subtle line-through")}>{t(r.title)}</span>
          <span className="relative hidden h-6 items-center rounded bg-subtle px-2 text-xs font-medium text-subtle sm:inline-flex">{t(r.project)}</span>
          <span className="relative hidden w-16 text-right text-[13px] tabular-nums text-subtle sm:inline">
            {r.due.startsWith("mock.") ? t(r.due as MessageKey) : formatIsoDate(locale, r.due).split(" ").slice(0, 2).join(" ")}
          </span>
          <Avatar name={PEOPLE[r.who].name} src={PEOPLE[r.who].src} size="sm" className="relative" />
          {i === picked && (
            <MousePointer2 aria-hidden className={cn("absolute left-[45%] top-1/2 z-20 size-5 fill-[hsl(var(--ag-bg-inverted))] text-[hsl(var(--ag-bg-default))] drop-shadow", m.cursor)} style={at(CLICK)} />
          )}
        </div>
      ))}
    </div>
  );
}

function Prop({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <span className="text-subtle">{label}</span>
      <span className="flex min-w-0 items-center gap-2">{children}</span>
    </>
  );
}

const SUBTASKS: MessageKey[] = ["mock.d.s1", "mock.d.s2", "mock.d.s3"];

/** The task detail panel that slides over the right side after the click. */
function TaskDetail({ t }: { t: T }) {
  return (
    <div className={cn("absolute inset-y-0 right-0 z-10 flex w-full flex-col overflow-hidden border-l border-default bg-default shadow-elevation-4 sm:w-[360px]", m.slide)} style={at(OPEN)}>
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-default px-5 text-xs text-subtle">
        <span className="min-w-0 grow truncate">{t("mock.pTalent")} · T-501</span>
        <X aria-hidden className="size-4" />
      </div>
      <div className="flex min-h-0 flex-col gap-4 overflow-hidden px-5 py-4">
        <p className={cn("text-lg font-semibold leading-6 tracking-[-0.025em]", s.rise)} style={at(OPEN + 0.3)}>{t("mock.t1")}</p>
        <div className={cn("grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[13px]", s.rise)} style={at(OPEN + 0.5)}>
          <Prop label={t("mock.d.status")}>
            <span className="relative inline-flex">
              <span className="inline-flex h-6 items-center gap-1.5 rounded-md border border-default px-2 text-xs font-medium"><Ring />{t("mock.d.todo")}</span>
              <span className={cn("absolute inset-0 inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-md border border-default bg-default px-2 text-xs font-medium", s.pop)} style={at(STATUS)}><Ring state="half" />{t("mock.d.doing")}</span>
            </span>
          </Prop>
          <Prop label={t("mock.d.assignee")}><Avatar name={PEOPLE.rina.name} src={PEOPLE.rina.src} size="xs" /><span className="truncate">{PEOPLE.rina.name}</span></Prop>
          <Prop label={t("mock.d.due")}>{t("mock.today")}</Prop>
        </div>
        <div className={cn("flex flex-col gap-2", s.rise)} style={at(OPEN + 0.8)}>
          <div className="flex items-center gap-3 text-xs font-medium text-subtle">
            <span className="grow">{t("mock.d.subtasks")}</span>
            <span className="relative tabular-nums">
              {t("mock.d.progress", "1")}
              <span className={cn("absolute inset-0 bg-default text-right", s.pop)} style={at(TICK + 0.2)}>{t("mock.d.progress", "2")}</span>
            </span>
          </div>
          <div aria-hidden className="flex h-1 overflow-hidden rounded-full bg-subtle">
            <span className="w-1/3 bg-inverted" />
            <span className={cn("w-1/3 bg-inverted", s.write)} style={at(TICK + 0.1)} />
          </div>
          {SUBTASKS.map((k, i) => (
            <p key={k} className="flex items-center gap-2 text-[13px]">
              <span className="relative grid size-4 shrink-0 place-items-center rounded border-[1.5px] border-control">
                {i === 0 && <span className="absolute inset-[-1.5px] grid place-items-center rounded bg-inverted text-inverted"><Check className="size-3" /></span>}
                {i === 1 && <span className={cn("absolute inset-[-1.5px] grid place-items-center rounded bg-inverted text-inverted", s.pop)} style={at(TICK)}><Check className="size-3" /></span>}
              </span>
              <span className={cn("truncate", i === 0 && "text-subtle line-through")}>{t(k)}</span>
            </p>
          ))}
        </div>
        <div className={cn("hidden gap-2.5 border-t border-default pt-4 sm:flex", s.rise)} style={at(COMMENT)}>
          <Avatar name={PEOPLE.sari.name} src={PEOPLE.sari.src} size="sm" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[13px] font-semibold">{PEOPLE.sari.name} <span className="ml-1 text-xs font-normal text-subtle">{t("mock.d.when")}</span></span>
            <p className="text-[13px] leading-5">{t("mock.d.comment")}</p>
          </div>
        </div>
        <div className={cn("flex gap-2 rounded-lg bg-subtle p-3 text-xs leading-[18px]", s.rise)} style={at(SUMMARY)}>
          <Sparkles aria-hidden className="mt-0.5 size-3.5 shrink-0" />
          <span>{t("mock.d.summary")}</span>
        </div>
      </div>
    </div>
  );
}

export function DeskMock({ t, locale }: { t: T; locale: Locale }) {
  const rail = [
    { icon: Inbox, label: t("nav.desk"), on: true },
    { icon: LayoutGrid, label: t("nav.space") },
    { icon: Settings, label: t("nav.manage") },
  ];
  return (
    <div role="img" aria-label={t("mock.label")} className="mt-16 overflow-hidden rounded-2xl border border-default bg-default shadow-elevation-4">
      <div className="flex h-10 items-center gap-2 overflow-hidden whitespace-nowrap border-b border-default bg-muted px-4 font-mono text-xs text-subtle">
        <span aria-hidden className="mr-1 flex gap-1.5">{[0, 1, 2].map((i) => <i key={i} className="size-2.5 rounded-full border border-default bg-emphasis" />)}</span>
        {t("mock.url")}
      </div>
      <Replay innerClassName="relative grid min-h-[440px] overflow-hidden md:h-[520px] md:grid-cols-[72px_minmax(0,1fr)] lg:grid-cols-[72px_minmax(0,1fr)_340px]">
        <div className="hidden flex-col items-center gap-1 border-r border-default bg-muted py-3 md:flex">
          <span className="mb-2 grid size-8 place-items-center rounded-md bg-inverted text-xs font-semibold text-inverted">MJ</span>
          {rail.map(({ icon: Icon, label, on }) => (
            <span key={label} className={cn("flex w-14 flex-col items-center gap-0.5 rounded-md py-1.5 text-[11px] font-medium", on ? "bg-emphasis" : "text-subtle")}>
              <Icon aria-hidden className="size-[18px]" />
              {label}
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-4 overflow-hidden p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="min-w-0 grow">
              <div className="text-2xl font-semibold tracking-[-0.025em]">{t("mock.myTasks")}</div>
              <div className="text-[13px] text-subtle">{t("mock.summary")}</div>
            </div>
            <span className="hidden h-8 w-[200px] items-center gap-2 rounded-md border border-control px-2.5 text-[13px] text-muted sm:inline-flex">
              <Search aria-hidden className="size-3.5" />
              {t("mock.search")}
            </span>
          </div>
          <div className="text-xs font-medium text-subtle">{t("mock.todayCount")}</div>
          <Rows t={t} locale={locale} rows={TODAY} from={0.2} picked={0} />
          <div className="text-xs font-medium text-subtle">{t("mock.weekCount")}</div>
          <Rows t={t} locale={locale} rows={WEEK} from={0.44} />
        </div>
        <div className="hidden flex-col gap-4 border-l border-default bg-muted px-5 py-6 lg:flex">
          <div className="text-base font-semibold tracking-[-0.025em]">{t("mock.approval")}</div>
          <div className={cn("flex flex-col gap-2.5 rounded-xl border border-default bg-default p-3 shadow-elevation-2", s.rise)} style={at(0.8)}>
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-inverted text-inverted"><Sparkles aria-hidden className="size-4" /></span>
              <div className="min-w-0">
                <div className="text-sm font-semibold">{t("mock.ai.title")}</div>
                <div className="text-xs text-subtle">{t("mock.ai.meta")}</div>
              </div>
            </div>
            <div className="text-sm">
              {t("mock.ai.goalLabel")} <b className="font-semibold">{t("mock.ai.goal")}</b>
            </div>
            <div className="flex flex-col gap-1.5 rounded-lg bg-subtle p-2.5 text-xs text-subtle">
              <span>{t("mock.ai.e1")}</span>
              <span>{t("mock.ai.e2")}</span>
              <span>{t("mock.ai.e3")}</span>
            </div>
            <div className="text-xs text-subtle">{t("mock.ai.nothing")}</div>
            <div className="flex gap-2">
              <span className="inline-flex h-8 grow items-center justify-center rounded-md border border-default text-[13px] font-medium">{t("mock.ai.edit")}</span>
              <span className="inline-flex h-8 grow items-center justify-center rounded-md bg-inverted text-[13px] font-medium text-inverted">{t("mock.ai.approve")}</span>
            </div>
          </div>
        </div>
        <TaskDetail t={t} />
      </Replay>
    </div>
  );
}
