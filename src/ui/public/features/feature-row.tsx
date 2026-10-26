// One feature of the public home (FE-18 v2, agere-org-landing-v2.html "frow"): name with its status, title, body
// and what it does on one side, the animated mock-up on the other; rows alternate sides on wide screens.
import { Check } from "lucide-react";
import type { MessageKey, translator } from "@/i18n";
import { cn } from "@/lib/utils";
import { Stage } from "./stage";

type T = ReturnType<typeof translator>;

export type Feature = { id: string; icon: React.ComponentType<{ className?: string }>; live: boolean };

export function FeatureRow({ t, feature, flip, children }: { t: T; feature: Feature; flip?: boolean; children: React.ReactNode }) {
  const k = (part: string) => `f.${feature.id}.${part}` as MessageKey;
  const Icon = feature.icon;
  return (
    <article id={`f-${feature.id}`} className={cn("grid scroll-mt-20 items-center gap-8 lg:gap-16", flip ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]")}>
      <div className={cn("flex min-w-0 flex-col items-start gap-4", flip && "lg:order-2")}>
        <div className="flex flex-wrap items-center gap-2.5">
          <span aria-hidden className="grid size-8 place-items-center rounded-md bg-subtle text-emphasis"><Icon className="size-4" /></span>
          <strong className="text-base font-semibold tracking-[-0.025em] text-emphasis">{t(k("name"))}</strong>
          {feature.live ? (
            <span className="inline-flex h-6 items-center gap-1.5 rounded-full bg-success-bg px-2.5 text-xs font-medium text-success-on-surface">
              <span aria-hidden className="size-1.5 rounded-full bg-current" />
              {t("f.live")}
            </span>
          ) : (
            <span className="inline-flex h-6 items-center rounded-full border border-dashed border-emphasis px-2.5 text-xs font-medium text-subtle">{t("f.soon")}</span>
          )}
        </div>
        <h3 className="text-balance text-2xl font-semibold tracking-[-0.05em] text-emphasis md:text-3xl">{t(k("title"))}</h3>
        <p className="text-base text-subtle">{t(k("body"))}</p>
        <ul className="mt-1 flex flex-col gap-2.5 text-sm">
          {(["c1", "c2", "c3"] as const).map((c) => (
            <li key={c} className="flex gap-2.5">
              <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success-on-surface" />
              {t(k(c))}
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0">
        <Stage label={t(k("mock"))}>{children}</Stage>
      </div>
    </article>
  );
}
