// Animated mock-ups of Chat and App Center for the public home (FE-18 v2); see scenes-work.tsx for how a scene
// plays. App Center shows the providers' own marks (UI-01: official provider logos, PO 7 Oct 2026).
import { Check, FileText, GitPullRequest, Hash, ListChecks, Smile } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { MessageKey, translator } from "@/i18n";
import { cn } from "@/lib/utils";
import { at } from "@/ui/auth/showcase-kit";
import s from "@/ui/auth/feature-showcase.module.css";
import { PEOPLE } from "../content";
import { FigmaMark, GitHubMark, GoogleCalendarMark, GoogleDriveMark, SlackMark, ZendeskMark } from "./brand-marks";
import { WindowBar } from "./stage";

type T = ReturnType<typeof translator>;
type Person = keyof typeof PEOPLE;
const P = PEOPLE;

function Message({ who, when, delay, children, className }: { who: Person; when: string; delay: number; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative flex min-w-0 gap-2.5", s.rise, className)} style={at(delay)}>
      <Avatar name={P[who].name} src={P[who].src} size="md" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[13px] font-semibold leading-[18px]">
          {P[who].name}
          <span className="ml-1.5 text-xs font-normal text-subtle">{when}</span>
        </span>
        {children}
      </div>
    </div>
  );
}

export function ChatScene({ t }: { t: T }) {
  const channels = ["sc.chat.ch1", "sc.chat.ch2", "sc.chat.ch3"] as const;
  return (
    <>
      <WindowBar>{t("sc.chat.url")}</WindowBar>
      <div className="grid min-h-0 grow md:grid-cols-[180px_minmax(0,1fr)]">
        <div className="hidden flex-col gap-0.5 border-r border-default bg-muted p-2.5 text-[13px] md:flex">
          <span className="px-2 py-1 text-xs font-medium text-subtle">{t("sc.chat.channels")}</span>
          {channels.map((k, i) => (
            <span key={k} className={cn("flex items-center gap-2 truncate rounded-md px-2 py-1.5", i === 0 ? "bg-emphasis font-medium" : "text-subtle")}><Hash aria-hidden className="size-3.5 shrink-0" />{t(k)}</span>
          ))}
          <span className="px-2 pb-1 pt-3 text-xs font-medium text-subtle">{t("sc.chat.dms")}</span>
          {(["sari", "dimas"] as const).map((k) => (
            <span key={k} className="flex items-center gap-2 truncate rounded-md px-2 py-1.5 text-subtle"><Avatar name={P[k].name} src={P[k].src} size="xs" />{P[k].name}</span>
          ))}
        </div>
        <div className="flex min-w-0 flex-col">
          <div className="flex h-12 shrink-0 items-center gap-2 border-b border-default px-5 text-sm font-semibold">
            <Hash aria-hidden className="size-4" />
            {t("sc.chat.ch1")}
            <span className="ml-auto text-xs font-normal text-subtle">{t("sc.chat.members")}</span>
          </div>
          <div className="flex grow flex-col gap-4 px-5 py-4">
            <Message who="sari" when={t("sc.chat.t1")} delay={0.4}>
              <p className="text-[13px] leading-5">{t("sc.chat.m1")}</p>
            </Message>
            <Message who="rina" when={t("sc.chat.t2")} delay={1.2} className="rounded-lg border border-default bg-muted p-2.5">
              <span aria-hidden className={cn("absolute -top-3.5 right-2 flex gap-0.5 rounded-md border border-default bg-default p-0.5 shadow-elevation-3", s.pop)} style={at(2.2)}>
                <span className={cn("inline-flex h-6 items-center gap-1.5 rounded bg-subtle px-2 text-xs font-medium", s.press)} style={at(3)}><ListChecks className="size-3" />{t("sc.chat.toTask")}</span>
                <span className="inline-flex h-6 items-center px-1.5"><Smile className="size-3" /></span>
              </span>
              <p className="text-[13px] leading-5">{t("sc.chat.m2")}</p>
              <span className={cn("mt-1.5 flex w-fit max-w-full items-start gap-2 rounded-md border border-default bg-default px-2.5 py-2 text-xs", s.pop)} style={at(3.5)}>
                <ListChecks aria-hidden className="mt-px size-3.5 shrink-0" />
                <span className="flex flex-wrap gap-x-1.5">
                  <span className="font-medium">{t("sc.chat.task")}</span>
                  <span className="text-subtle">{t("sc.chat.taskMeta")}</span>
                </span>
              </span>
            </Message>
            <Message who="dimas" when={t("sc.chat.t3")} delay={4.6}>
              <p className="text-[13px] leading-5">{t("sc.chat.m3")}</p>
            </Message>
            <span className={cn("flex items-center gap-2 text-xs text-subtle", s.rise)} style={at(5.6)}>
              <span aria-hidden className="flex gap-0.5">{[0, 1, 2].map((i) => <i key={i} className={cn("size-1 rounded-full bg-current", s.dot)} style={{ animationDelay: `${5.6 + i * 0.2}s` }} />)}</span>
              {t("sc.chat.typing", P.yoga.name)}
            </span>
          </div>
          <div className="mx-5 mb-4 flex h-10 shrink-0 items-center rounded-md border border-control px-3 text-[13px] text-subtle">{t("sc.chat.compose")}</div>
        </div>
      </div>
    </>
  );
}

// The apps the PO asked for; GitHub and Google Drive connect while the scene plays.
const APPS: { name: string; Mark: (p: { className?: string }) => React.JSX.Element; category: MessageKey; connectAt?: number }[] = [
  { name: "GitHub", Mark: GitHubMark, category: "auth.showcase.mock.catDev", connectAt: 2 },
  { name: "Google Drive", Mark: GoogleDriveMark, category: "auth.showcase.mock.catFiles", connectAt: 2.8 },
  { name: "Google Calendar", Mark: GoogleCalendarMark, category: "sc.apps.catCalendar" },
  { name: "Figma", Mark: FigmaMark, category: "sc.apps.catDesign" },
  { name: "Slack", Mark: SlackMark, category: "auth.showcase.mock.catChat" },
  { name: "Zendesk", Mark: ZendeskMark, category: "auth.showcase.mock.catSupport" },
];

export function AppsScene({ t }: { t: T }) {
  return (
    <>
      <WindowBar>{t("sc.apps.url")}</WindowBar>
      <div className="flex flex-col gap-4 p-5">
        <div className={s.rise}>
          <p className="text-xl font-semibold tracking-[-0.025em]">{t("sc.apps.title")}</p>
          <p className={cn("text-xs text-subtle", s.rise)} style={at(3.4)}>{t("sc.apps.sub")}</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
          {APPS.map((app, i) => (
            <div key={app.name} className={cn("flex min-w-0 flex-col gap-2.5 rounded-lg border border-default bg-default p-3", s.pop)} style={at(0.3 + i * 0.12)}>
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center rounded-md border border-default bg-muted text-emphasis"><app.Mark className="size-[18px]" /></span>
                <div className="grid min-w-0">
                  <p className="truncate text-[13px] font-semibold">{app.name}</p>
                  <p className="truncate text-xs text-subtle">{t(app.category)}</p>
                </div>
              </div>
              <div className="relative">
                <Button size="sm" variant="outline" className={cn("w-full", app.connectAt && s.press)} style={app.connectAt ? at(app.connectAt) : undefined}>
                  {t("auth.showcase.mock.connect")}
                </Button>
                {app.connectAt && (
                  <span className={cn("absolute inset-0 flex items-center justify-center gap-1.5 rounded-md border border-default bg-default text-sm font-medium text-success-on-surface", s.rise)} style={at(app.connectAt + 0.4)}>
                    <Check aria-hidden className="size-4" />
                    {t("auth.showcase.mock.connected")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-lg border border-default">
          <div className={cn("flex min-h-12 items-center gap-3 border-b border-default px-4 text-[13px]", s.rise)} style={at(4.2)}>
            <GitPullRequest aria-hidden className="size-4 shrink-0" />
            <span className="min-w-0 grow truncate font-medium">{t("sc.apps.pr")} <span className="font-normal text-subtle">· {t("sc.apps.linked", "T-501")}</span></span>
            <span className="rounded bg-success-bg px-1.5 py-0.5 text-[11px] font-medium text-success-on-surface">{t("sc.apps.open")}</span>
          </div>
          <div className={cn("flex min-h-12 items-center gap-3 px-4 text-[13px]", s.rise)} style={at(5)}>
            <FileText aria-hidden className="size-4 shrink-0" />
            <span className="min-w-0 grow truncate font-medium">{t("sc.apps.file")} <span className="font-normal text-subtle">· {t("sc.apps.attached", "T-501")}</span></span>
            <GoogleDriveMark className="size-4 shrink-0" />
          </div>
        </div>
      </div>
    </>
  );
}
