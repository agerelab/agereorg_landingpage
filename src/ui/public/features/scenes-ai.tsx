// Animated mock-ups of AI Agent and AI Organization for the public home (FE-18 v2); see scenes-work.tsx for
// how a scene plays. Both show the same rule: the AI proposes, a person approves.
import { Bot, Check, Code, FileText, Lightbulb, Palette, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { MessageKey, translator } from "@/i18n";
import { cn } from "@/lib/utils";
import { at } from "@/ui/auth/showcase-kit";
import s from "@/ui/auth/feature-showcase.module.css";
import o from "./scenes-ai.module.css";
import { PEOPLE } from "../content";
import { WindowBar } from "./stage";

type T = ReturnType<typeof translator>;
const P = PEOPLE;

/** A button inside a picture: same look as the DS button, but not a control. */
function FakeButton({ primary, className, style, children }: { primary?: boolean; className?: string; style?: React.CSSProperties; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md px-3 text-[13px] font-medium", primary ? "bg-inverted text-inverted" : "border border-default bg-default", className)} style={style}>
      {children}
    </span>
  );
}

const PERMISSIONS: { key: MessageKey; level: MessageKey; denied?: boolean }[] = [
  { key: "sc.agent.p1", level: "sc.agent.read" },
  { key: "sc.agent.p2", level: "sc.agent.approval" },
  { key: "sc.agent.p3", level: "sc.agent.approval" },
  { key: "sc.agent.p4", level: "sc.agent.denied", denied: true },
  { key: "sc.agent.p5", level: "sc.agent.denied", denied: true },
];

export function AgentScene({ t }: { t: T }) {
  return (
    <>
      <WindowBar>{t("sc.agent.url")}</WindowBar>
      <div className="grid min-h-0 grow md:grid-cols-[minmax(0,1fr)_240px]">
        <div className="flex min-w-0 flex-col gap-3 p-5">
          <div className={cn("flex items-center gap-2.5", s.rise)}>
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-inverted text-inverted"><Bot aria-hidden className="size-4" /></span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{t("sc.agent.name")}</p>
              <p className="truncate text-xs text-subtle">{t("sc.agent.meta", P.rina.name)}</p>
            </div>
          </div>
          <p className={cn("max-w-[85%] self-end rounded-xl bg-subtle px-3 py-2.5 text-[13px] leading-5", s.rise)} style={at(0.6)}>{t("sc.agent.ask")}</p>
          <div className="relative">
            <span className={cn("absolute left-0 top-0 flex items-center gap-2 text-xs text-subtle", s.blip)} style={at(1.3)}>
              <span aria-hidden className="flex gap-0.5">{[0, 1, 2].map((i) => <i key={i} className={cn("size-1 rounded-full bg-current", s.dot)} style={{ animationDelay: `${i * 0.2}s` }} />)}</span>
              {t("sc.agent.reading")}
            </span>
            <div className={cn("flex flex-col gap-2.5 rounded-xl border border-default bg-default p-3 shadow-elevation-2", s.rise)} style={at(3)}>
              <p className="text-[13px] leading-5">{t("sc.agent.answer")}</p>
              <div className="flex flex-col gap-1.5 rounded-lg bg-subtle p-2.5 text-xs text-subtle">
                <b className="font-semibold text-emphasis">{t("sc.agent.proposal")}</b>
                <span>{t("sc.agent.tasks")}</span>
                <span className="flex items-center gap-1.5"><FileText aria-hidden className="size-3 shrink-0" />{t("sc.agent.source")}</span>
              </div>
              <div className="relative flex flex-wrap gap-2">
                <FakeButton>{t("sc.agent.review")}</FakeButton>
                <FakeButton primary className={s.press} style={at(4.8)}>{t("sc.agent.approve")}</FakeButton>
              </div>
              <span className={cn("flex items-center gap-1.5 text-xs font-medium text-success-on-surface", s.rise)} style={at(5.3)}>
                <Check aria-hidden className="size-3.5" />
                {t("sc.agent.done", P.rina.name)}
              </span>
            </div>
          </div>
        </div>
        <div className="hidden flex-col gap-3 border-l border-default bg-muted p-4 md:flex">
          <span className="text-xs font-medium text-subtle">{t("sc.agent.perms")}</span>
          <div className="flex flex-col">
            {PERMISSIONS.map((p, i) => (
              <div key={p.key} className={cn("flex min-h-8 items-center justify-between gap-2 border-b border-default text-xs last:border-b-0", s.rise)} style={at(0.4 + i * 0.15)}>
                <span className="min-w-0 truncate">{t(p.key)}</span>
                <span className={cn("whitespace-nowrap rounded px-1.5 py-0.5 font-medium", p.denied ? "border border-dashed border-emphasis text-subtle" : "border border-default bg-default")}>{t(p.level)}</span>
              </div>
            ))}
          </div>
          <span className="pt-1 text-xs font-medium text-subtle">{t("sc.agent.context")}</span>
          <span className="w-fit rounded bg-subtle px-2 py-0.5 text-xs font-medium">{t("sc.agent.space")}</span>
        </div>
      </div>
    </>
  );
}

// The AI team under the coordinator; on a phone only the first three fit.
const TEAM: { icon: React.ComponentType<{ className?: string }>; name: MessageKey; state: MessageKey; needsYou?: boolean; wide?: boolean }[] = [
  { icon: Search, name: "sc.org.research", state: "sc.org.s1" },
  { icon: Lightbulb, name: "sc.org.product", state: "sc.org.s2", needsYou: true },
  { icon: Palette, name: "sc.org.design", state: "sc.org.wait" },
  { icon: Code, name: "sc.org.eng", state: "sc.org.wait", wide: true },
  { icon: ShieldCheck, name: "sc.org.qa", state: "sc.org.wait", wide: true },
];

// The canvas plays top to bottom, then left to right: you, the coordinator and the trunk; then for each agent
// its connector, its card as a skeleton, and the card's content (PO, 7 Oct 2026).
const AGENT_AT = (i: number) => 1.9 + i * 0.4;
const PLAN_AT = AGENT_AT(TEAM.length) + 0.4;

type Edge = "left" | "mid" | "right";
const edge = (i: number, n: number): Edge => (i === 0 ? "left" : i === n - 1 ? "right" : "mid");

/**
 * The connector above one agent, in an org-chart shape with rounded outer corners. The agents sit in equal
 * columns without a grid gap (each pads itself), so the bar and the drop meet the centre of every card.
 */
function Connector({ kind, className }: { kind: Edge; className?: string }) {
  const line = "absolute top-0 h-4 border-emphasis md:h-6";
  if (kind === "left") return <span className={cn(line, "left-1/2 right-0 rounded-tl-xl border-l border-t", className)} />;
  if (kind === "right") return <span className={cn(line, "left-0 right-[calc(50%-1px)] rounded-tr-xl border-r border-t", className)} />;
  return (
    <span className={className}>
      <span className="absolute inset-x-0 top-0 border-t border-emphasis" />
      <span className={cn(line, "left-1/2 border-l")} />
    </span>
  );
}

export function AiOrgScene({ t }: { t: T }) {
  return (
    <>
      <WindowBar>{t("sc.org.url")}</WindowBar>
      <div className="flex flex-wrap items-center gap-3 border-b border-default px-5 py-3.5">
        <div className="min-w-0 grow">
          <p className={cn("text-sm font-semibold", s.rise)}>{t("sc.org.goal")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-subtle">
            <span className={cn("inline-flex h-[22px] items-center rounded-md border border-[hsl(var(--ag-fg-default))] px-1.5 font-medium text-emphasis", s.pop)} style={at(PLAN_AT)}>{t("sc.org.create")}</span>
            <span className={cn("inline-flex h-[22px] items-center rounded-md bg-subtle px-1.5 font-medium", s.pop)} style={at(PLAN_AT + 0.2)}>{t("sc.org.reuse")}</span>
            <span className={cn("inline-flex h-[22px] items-center rounded-md border border-dashed border-emphasis px-1.5 font-medium", s.pop)} style={at(PLAN_AT + 0.4)}>{t("sc.org.skip")}</span>
            <span className={cn("max-sm:hidden", s.rise)} style={at(PLAN_AT + 0.6)}>· {t("sc.org.unchanged")}</span>
          </div>
        </div>
        <FakeButton primary className={cn(s.rise, "max-sm:hidden")} style={at(PLAN_AT + 0.8)}>{t("sc.org.review")}</FakeButton>
      </div>
      <div className="flex grow flex-col items-center bg-muted px-4 pb-5 pt-4 md:pt-6 [background-image:radial-gradient(hsl(var(--ag-border-emphasis))_1px,transparent_1px)] [background-size:24px_24px] md:px-5">
        <span className={cn("flex items-center gap-2 rounded-full border border-emphasis bg-default py-1 pl-1 pr-3.5 text-[13px] font-medium shadow-elevation-2", s.rise)} style={at(0.2)}>
          <Avatar name={P.rina.name} src={P.rina.src} size="sm" />
          {t("sc.org.you")}
        </span>
        <span aria-hidden className={cn("h-6 border-l border-dashed border-control md:h-10", s.grow)} style={at(0.6)} />
        <span className={cn("flex items-center gap-2.5 rounded-xl border border-default bg-default px-3 py-2.5 shadow-elevation-2", s.rise)} style={at(0.9)}>
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-inverted text-inverted"><Sparkles aria-hidden className="size-3.5" /></span>
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold">{t("sc.org.coord")}</span>
            <span className="block text-[11px] text-subtle">{t("sc.org.coordRole")}</span>
          </span>
        </span>
        <span aria-hidden className={cn("h-5 border-l border-emphasis md:h-7", s.grow)} style={at(1.5)} />
        <div className="grid w-full grid-cols-3 md:grid-cols-5">
          {TEAM.map((m, i) => (
            <div key={m.name} className={cn("relative min-w-0 px-[5px] pt-4 md:pt-6", m.wide && "hidden md:block")}>
              <span aria-hidden className={o.fade} style={at(AGENT_AT(i))}>
                <Connector kind={edge(i, 3)} className="md:hidden" />
                <Connector kind={edge(i, TEAM.length)} className="hidden md:block" />
              </span>
              <div className={cn("relative rounded-xl border border-default bg-default p-2.5 shadow-elevation-2", s.pop)} style={at(AGENT_AT(i) + 0.15)}>
                <div aria-hidden className="flex flex-col items-start gap-1.5">
                  <span className="size-6 rounded-md bg-subtle" />
                  <span className="my-0.5 h-3 w-4/5 rounded-full bg-subtle" />
                  <span className="my-0.5 h-3 w-3/5 rounded-full bg-subtle" />
                </div>
                <div className={cn("absolute inset-0 flex flex-col items-start gap-1.5 rounded-xl bg-default p-2.5", o.fade)} style={at(AGENT_AT(i) + 0.6)}>
                  <span className="grid size-6 place-items-center rounded-md bg-subtle"><m.icon aria-hidden className="size-3.5" /></span>
                  <span className="w-full truncate text-xs font-semibold leading-4">{t(m.name)}</span>
                  <span className="w-full truncate text-[11px] leading-4 text-subtle">{t(m.state)}</span>
                </div>
                {m.needsYou && <span aria-hidden className={cn("absolute -right-1.5 -top-1.5 grid size-4 place-items-center rounded-full border-[1.5px] border-[hsl(var(--ag-fg-default))] bg-default text-[11px] font-bold leading-none", s.pop)} style={at(AGENT_AT(TEAM.length))}>!</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
