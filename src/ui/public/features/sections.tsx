// "Produktivitas" and "AI" on the public home (FE-18 v2; PO 7 Oct 2026): the features in the order Desk, Doc, Chat,
// App Center, then AI Agent and AI Organization, each with an animated mock-up, so early birds see what is
// coming. Desk ships at launch; the others are marked "Menyusul".
import { Bot, FileText, Inbox, LayoutGrid, MessageSquare, Network } from "lucide-react";
import type { MessageKey, translator } from "@/i18n";
import { cn } from "@/lib/utils";
import { FeatureRow, type Feature } from "./feature-row";
import { AgentScene, AiOrgScene } from "./scenes-ai";
import { AppsScene, ChatScene } from "./scenes-team";
import { DeskScene, DocScene } from "./scenes-work";

type T = ReturnType<typeof translator>;

export const WORK_FEATURES: Feature[] = [
  { id: "desk", icon: Inbox, live: true },
  { id: "doc", icon: FileText, live: false },
  { id: "chat", icon: MessageSquare, live: false },
  { id: "apps", icon: LayoutGrid, live: false },
];

export const AI_FEATURES: Feature[] = [
  { id: "agent", icon: Bot, live: false },
  { id: "aiorg", icon: Network, live: false },
];

const SCENES: Record<string, (p: { t: T }) => React.JSX.Element> = {
  desk: DeskScene, doc: DocScene, chat: ChatScene, apps: AppsScene, agent: AgentScene, aiorg: AiOrgScene,
};

/** A group of features: eyebrow, title and lead from `f.<group>.*`, then one row per feature. */
function FeatureSection({ t, id, group, features, className }: { t: T; id: string; group: string; features: Feature[]; className?: string }) {
  const k = (part: string) => `f.${group}.${part}` as MessageKey;
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-20 py-16 md:py-24", className)}>
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">
        <div className="flex max-w-[720px] flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-subtle">{t(k("eyebrow"))}</span>
          <h2 id={`${id}-title`} className="text-balance text-3xl font-semibold tracking-[-0.05em] text-emphasis md:text-4xl">{t(k("title"))}</h2>
          <p className="text-base text-subtle">{t(k("body"))}</p>
        </div>
        <div className="mt-16 flex flex-col gap-20 lg:gap-28">
          {features.map((f, i) => {
            const Scene = SCENES[f.id];
            return (
              <FeatureRow key={f.id} t={t} feature={f} flip={i % 2 === 1}>
                <Scene t={t} />
              </FeatureRow>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductivitySection({ t }: { t: T }) {
  return <FeatureSection t={t} id="produktivitas" group="prod" features={WORK_FEATURES} />;
}

export function AiSection({ t }: { t: T }) {
  return <FeatureSection t={t} id="ai" group="ai" features={AI_FEATURES} className="border-y border-default bg-muted" />;
}
