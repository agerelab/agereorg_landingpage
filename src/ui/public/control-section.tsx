// "Kendali" on the public home (FE-18 v2, agere-org-landing-v2.html "trust"): what an Owner can count on, in
// nine short promises. Each one is backed by the PRD: roles and Terbatas spaces checked on the server (PRD-04),
// audit kept one rolling year (PRD-13 L2), the OpenAI API called directly with ZDR requested (D162; the copy waits for
// the 8 Jan 2027 gate, README), Postgres in Singapore, downgrade pauses
// instead of deleting (D83), credits stop only AI, drafts survive a dropped connection (D128), DOKU with
// invoices 7 days ahead (D98), and a language per person (D45).
import { BatteryLow, CircleArrowDown, EyeOff, History, Languages, MapPin, QrCode, ShieldCheck, WifiOff } from "lucide-react";
import type { MessageKey, translator } from "@/i18n";

type T = ReturnType<typeof translator>;

const PROMISES: { icon: React.ComponentType<{ className?: string }>; id: string }[] = [
  { icon: ShieldCheck, id: "access" },
  { icon: History, id: "audit" },
  { icon: EyeOff, id: "ai" },
  { icon: MapPin, id: "data" },
  { icon: CircleArrowDown, id: "downgrade" },
  { icon: BatteryLow, id: "credits" },
  { icon: WifiOff, id: "offline" },
  { icon: QrCode, id: "pay" },
  { icon: Languages, id: "lang" },
];

export const CONTROL_KEYS: MessageKey[] = [
  "ctl.eyebrow", "ctl.title", "ctl.body",
  ...PROMISES.flatMap(({ id }) => [`ctl.${id}.title`, `ctl.${id}.body`] as MessageKey[]),
];

export function ControlSection({ t }: { t: T }) {
  return (
    <section id="kendali" aria-labelledby="kendali-title" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-4 md:px-8">
        <div className="flex max-w-[720px] flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-subtle">{t("ctl.eyebrow")}</span>
          <h2 id="kendali-title" className="text-balance text-3xl font-semibold tracking-[-0.05em] text-emphasis md:text-4xl">{t("ctl.title")}</h2>
          <p className="text-base text-subtle">{t("ctl.body")}</p>
        </div>
        {/* The 1px gaps over the border colour draw the grid lines at every column count. */}
        <ul className="grid gap-px overflow-hidden rounded-xl border border-default bg-[hsl(var(--ag-border-default))] md:grid-cols-2 lg:grid-cols-3">
          {PROMISES.map(({ icon: Icon, id }) => (
            <li key={id} className="flex flex-col gap-2 bg-default p-6 md:last:col-span-2 lg:last:col-span-1">
              <span aria-hidden className="mb-1 grid size-8 place-items-center rounded-md bg-subtle text-emphasis"><Icon className="size-4" /></span>
              <h3 className="text-base font-semibold tracking-[-0.025em] text-emphasis">{t(`ctl.${id}.title` as MessageKey)}</h3>
              <p className="text-sm text-subtle">{t(`ctl.${id}.body` as MessageKey)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
