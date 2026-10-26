// Animated mock-ups of Desk and Doc for the public home (FE-18 v2). Each step is a motion class plus a delay
// from the moment the scene plays (see stage.tsx); transform and opacity only. People are the fictional
// characters with the PO's generated photos.
import { Bell, CalendarClock, Check, CheckSquare, FileText, Folder, Heading2, ListChecks } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { translator } from "@/i18n";
import { cn } from "@/lib/utils";
import { at } from "@/ui/auth/showcase-kit";
import s from "@/ui/auth/feature-showcase.module.css";
import { PEOPLE } from "../content";
import { WindowBar } from "./stage";

type T = ReturnType<typeof translator>;
const P = PEOPLE;

function InboxRow({ who, text, when, delay, read }: { who?: keyof typeof PEOPLE; text: React.ReactNode; when: string; delay: number; read?: { label: string; at: number } }) {
  return (
    <div className={cn("relative flex min-h-14 items-start gap-3 border-b border-default px-4 py-2.5 last:border-b-0", s.rise)} style={at(delay)}>
      <span aria-hidden className="mt-2 size-2 shrink-0 rounded-full bg-brand-accent" />
      {who ? <Avatar name={P[who].name} src={P[who].src} size="sm" /> : <span className="grid size-6 shrink-0 place-items-center rounded-full bg-subtle"><CalendarClock className="size-3.5" /></span>}
      <p className="min-w-0 grow text-[13px] leading-[18px]">{text}</p>
      <span className="whitespace-nowrap text-xs text-subtle">{when}</span>
      {read && (
        <span className={cn("absolute right-3 top-2 inline-flex items-center gap-1 rounded-md bg-success-bg px-1.5 py-0.5 text-[11px] font-medium text-success-on-surface", s.pop)} style={at(read.at)}>
          <Check aria-hidden className="size-3" />
          {read.label}
        </span>
      )}
    </div>
  );
}

export function DeskScene({ t }: { t: T }) {
  const b = (x: string) => <b className="font-semibold">{x}</b>;
  return (
    <>
      <WindowBar>{t("sc.desk.url")}</WindowBar>
      <div className="flex flex-col gap-4 p-5">
        <div className={cn("flex gap-5 border-b border-default", s.rise)}>
          <span className="-mb-px inline-flex items-center gap-1.5 border-b-2 border-[hsl(var(--ag-fg-default))] py-2.5 text-[13px] font-semibold">
            <Bell aria-hidden className="size-3.5" />
            {t("sc.desk.inbox")}
            <span className="rounded bg-subtle px-1.5 text-[11px]">3</span>
          </span>
          <span className="py-2.5 text-[13px] font-medium text-subtle">{t("mock.myTasks")}</span>
        </div>
        <div className="overflow-hidden rounded-lg border border-default">
          <InboxRow who="rina" delay={0.4} when={t("sc.desk.t1")} read={{ label: t("sc.desk.read"), at: 3 }} text={<>{b(P.rina.name)} {t("sc.desk.r1", t("mock.t1"))}</>} />
          <InboxRow who="dimas" delay={0.8} when={t("sc.desk.t2")} text={<>{b(P.dimas.name)} {t("sc.desk.r2", t("mock.t3"))}</>} />
          <InboxRow delay={1.2} when={t("sc.desk.t3")} text={t("sc.desk.r3", t("mock.t2"))} />
        </div>
        <div className={cn("flex flex-col gap-2", s.rise)} style={at(3.6)}>
          <span className="text-xs font-medium text-subtle">{t("mock.todayCount")}</span>
          <div className="overflow-hidden rounded-lg border border-default">
            {(["mock.t1", "mock.t2"] as const).map((k, i) => (
              <div key={k} className="flex min-h-11 items-center gap-3 border-b border-default px-4 last:border-b-0">
                <span className="relative grid size-3.5 shrink-0 place-items-center rounded-full border-[1.5px] border-control">
                  {i === 0 && <span className={cn("absolute inset-[-1.5px] grid place-items-center rounded-full bg-inverted text-inverted", s.pop)} style={at(5)}><Check className="size-2.5" /></span>}
                </span>
                <span className="min-w-0 grow truncate text-sm font-medium">{t(k)}</span>
                <span className="hidden h-6 items-center rounded bg-subtle px-2 text-xs font-medium text-subtle sm:inline-flex">{t("mock.pTalent")}</span>
                <Avatar name={P.rina.name} src={P.rina.src} size="sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const SLASH = [
  { icon: Heading2, key: "auth.showcase.mock.blockHeading" },
  { icon: ListChecks, key: "auth.showcase.mock.blockChecklist" },
  { icon: CheckSquare, key: "auth.showcase.mock.blockTask" },
] as const;

export function DocScene({ t }: { t: T }) {
  return (
    <>
      <WindowBar>{t("sc.doc.url")}</WindowBar>
      <div className="grid min-h-0 grow md:grid-cols-[180px_minmax(0,1fr)]">
        <div className="hidden flex-col gap-0.5 border-r border-default bg-muted p-2.5 text-[13px] md:flex">
          <span className="flex items-center gap-2 px-2 py-1.5 font-medium"><Folder aria-hidden className="size-3.5" />{t("sc.doc.folder")}</span>
          {(["sc.doc.d1", "sc.doc.d2", "sc.doc.d3"] as const).map((k, i) => (
            <span key={k} className={cn("flex items-center gap-2 truncate rounded-md py-1.5 pl-6 pr-2", i === 0 ? "bg-emphasis font-medium" : "text-subtle")}><FileText aria-hidden className="size-3.5 shrink-0" />{t(k)}</span>
          ))}
        </div>
        <div className="flex min-w-0 flex-col gap-3 p-5 md:px-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex -space-x-1.5">
              {(["sari", "yoga"] as const).map((k, i) => (
                <Avatar key={k} name={P[k].name} src={P[k].src} size="sm" className={cn("ring-2 ring-background", s.pop)} style={at(0.6 + i * 0.3)} />
              ))}
            </div>
            <span className={cn("inline-flex items-center gap-1.5 text-xs text-subtle", s.rise)} style={at(5.4)}><Check aria-hidden className="size-3.5" />{t("sc.doc.saved")}</span>
          </div>
          <p className={cn("text-2xl font-semibold tracking-[-0.025em]", s.rise)} style={at(0.2)}>{t("sc.doc.d1")}</p>
          <div className="grid gap-2">
            {[100, 94, 70].map((w, i) => <span key={w} className={cn("h-2 rounded-full bg-subtle", s.write)} style={{ ...at(0.6 + i * 0.4), width: `${w}%` }} />)}
          </div>
          <p className={cn("pt-1 text-base font-semibold", s.rise)} style={at(1.8)}>{t("sc.doc.h2")}</p>
          <div className="relative min-h-28">
            <div className={cn("absolute left-0 top-0 z-10 grid w-52 gap-0.5 rounded-lg border border-default bg-default p-1 text-sm shadow-elevation-3", s.blip)} style={at(2.2)}>
              {SLASH.map(({ icon: Icon, key }, i) => (
                <span key={key} className={cn("flex items-center gap-2 rounded-md px-2 py-1", i === 1 && "bg-subtle font-medium")}><Icon aria-hidden className="size-3.5" />{t(key)}</span>
              ))}
            </div>
            <div className="grid gap-2">
              {(["sc.doc.c1", "sc.doc.c2", "sc.doc.c3"] as const).map((k, i) => (
                <p key={k} className={cn("flex items-center gap-2 text-sm", s.rise)} style={at(4 + i * 0.3)}>
                  <span className="relative grid size-4 place-items-center rounded border-[1.5px] border-control">
                    {i === 0 && <span className={cn("absolute inset-[-1.5px] grid place-items-center rounded bg-inverted text-inverted", s.pop)} style={at(5)}><Check className="size-3" /></span>}
                  </span>
                  {t(k)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
