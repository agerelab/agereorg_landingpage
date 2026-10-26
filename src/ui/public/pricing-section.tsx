"use client";

// "Harga" on the public site (FE-18 v2, agere-org-landing-v2.html; PRD-20 §5.2 with D109, D110, D113, D116,
// D117, D131): Early bird first (PO, 7 Oct 2026: it is the way in before launch), then Free and Tim
// (recommended), with the Yearly / Monthly switch, then the notes on the trial and the apps that follow
// (no tax text, D134).
// Until the app opens, the Free and Team buttons explain the early bird in a dialog (PO, 9 Oct 2026).
// Every number comes from src/modules/billing/plans.ts.
import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { translator, type Locale, type MessageKey } from "@/i18n";
import { formatIsoDate, formatMoney, formatNumber } from "@/i18n/format";
import { cn } from "@/lib/utils";
import { EARLY_BIRD, PLANS, TRIAL_CREDITS, TRIAL_DAYS, yearlySaving, type Cycle } from "@/modules/billing/plans";
import { SHOW_EB_ILLUSTRATION, SOON_APPS } from "./content";
import { EbFlight } from "./eb-flight";

// The Yearly / Monthly switch looks like the DS SegmentedControl, with the saving in green next to "Yearly"
// (PO, 7 Oct 2026); SegmentedControl only takes a plain-text label, so this is the DS ToggleGroup it is built on.
/** The early bird dialog's copy, in reading order. */
export const EB_DIALOG_KEYS: MessageKey[] = ["ps.ebDialog.title", "ps.free.ctaNote", "ps.ebDialog.p1", "ps.eb.credits", "ps.ebDialog.p3", "ps.ebDialog.p4", "site.cta.earlyBird", "common.close"];

const SEGMENT =
  "h-[30px] flex-none gap-2 rounded-md border border-transparent px-3 text-subtle shadow-none first:rounded-md last:rounded-md hover:bg-transparent hover:text-emphasis data-[state=on]:bg-default data-[state=on]:text-emphasis data-[state=on]:shadow-sm";

export function PricingSection({ locale, heading = "h2" }: { locale: Locale; heading?: "h1" | "h2" }) {
  const t = translator(locale);
  const [cycle, setCycle] = React.useState<Cycle>("yearly");
  const [ebOpen, setEbOpen] = React.useState(false);
  // Two buttons open the dialog, so focus goes back to the one that did (no DialogTrigger to return to).
  const opener = React.useRef<HTMLButtonElement | null>(null);
  const openEb = (e: React.MouseEvent<HTMLButtonElement>) => {
    opener.current = e.currentTarget;
    setEbOpen(true);
  };
  const money = (n: number) => formatMoney(locale, n);
  const n = (v: number) => formatNumber(locale, v);
  const { free, team } = PLANS;
  const ebCredits = t("ps.eb.credits", n(EARLY_BIRD.credits.perMember), n(EARLY_BIRD.credits.min), n(EARLY_BIRD.credits.max));
  const Title = heading;
  const plans = [
    {
      id: "eb", name: t("ps.eb.name"), badge: t("ps.eb.badge", n(EARLY_BIRD.places)), desc: t("ps.eb.desc", n(EARLY_BIRD.minPeople), n(EARLY_BIRD.maxPeople)), price: money(0),
      note: [t("ps.eb.note1", n(EARLY_BIRD.freeDays)), t("ps.eb.note2", n(EARLY_BIRD.priceLockMonths))],
      cta: <Button asChild variant="outline" className="w-full border-transparent"><Link href="/early-bird">{t("site.cta.earlyBird")}</Link></Button>,
      footer: <Button asChild variant="link" size="sm" className="mt-auto self-start text-inverted"><Link href="/early-bird#syarat">{t("ps.eb.cta")}</Link></Button>,
      lines: [ebCredits, t("ps.eb.f2"), t("ps.eb.f3"), t("ps.eb.f4", formatIsoDate(locale, EARLY_BIRD.closesOn))],
    },
    {
      id: "free", name: t("ps.free.name"), desc: t("ps.free.desc"), price: money(0), note: [t("ps.free.note", n(free.maxSeats))],
      cta: <Button variant="outline" className="w-full" onClick={openEb}>{t("ps.free.cta")}</Button>,
      lines: [t("ps.free.f1", n(free.maxSeats)), t("ps.free.f2", n(free.activeProjects)), t("ps.credits.org", n(free.credits.amount)), t("ps.free.f4"), t("ps.trash", n(free.trashDays)), t("ps.free.f6")],
    },
    {
      id: "team", name: t("ps.team.name"), badge: t("ps.team.badge"), desc: t("ps.team.desc"), price: money(team.price[cycle]),
      note: cycle === "yearly" ? [t("ps.team.perSeatYearly"), t("ps.team.perYear", money(team.price.yearly * 12))] : [t("ps.team.perSeatMonthly")],
      cta: <Button variant="outline" className="w-full" onClick={openEb}>{t("ps.team.cta", n(TRIAL_DAYS))}</Button>,
      lines: [t("ps.team.f1"), t("ps.team.f2", n(team.credits.amount)), t("ps.trash", n(team.trashDays)), t("ps.team.f4", n(team.support.replyBusinessDays)), t("ps.team.f5", n(team.minSeats))],
    },
  ];
  return (
    <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-4 md:px-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-[720px] flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-subtle">{t("ps.eyebrow")}</span>
          <Title id="harga-title" className="text-balance text-3xl font-semibold tracking-[-0.05em] text-emphasis md:text-4xl">{t("ps.title")}</Title>
          <p className="text-base text-subtle">{t("ps.lead")}</p>
        </div>
        <ToggleGroup
          type="single"
          aria-label={t("ps.cycle")}
          value={cycle}
          onValueChange={(v) => v && setCycle(v as Cycle)}
          className="self-start rounded-lg bg-muted p-[3px] md:self-auto"
        >
          <ToggleGroupItem value="yearly" className={SEGMENT}>
            {t("ps.yearly")}
            <span className="text-xs font-medium text-success-on-surface">{t("ps.save", String(yearlySaving()))}</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="monthly" className={SEGMENT}>{t("ps.monthly")}</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <ul className="grid items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((p) => {
          // Early bird stands out in black (PO, 7 Oct 2026).
          const dark = p.id === "eb";
          const sub = dark ? "text-inverted opacity-75" : "text-subtle";
          return (
          <li key={p.id} className={cn("flex min-w-0 flex-col gap-5 rounded-xl border border-default bg-default p-6", p.id === "team" && "border-[1.5px] border-[hsl(var(--ag-fg-default))] shadow-elevation-3", dark && "border-transparent bg-inverted text-inverted md:col-span-2 lg:col-span-1")}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className={cn("text-base font-semibold tracking-[-0.025em]", dark ? "text-inverted" : "text-emphasis")}>{p.name}</h3>
                {p.badge && <span className={cn("inline-flex h-6 items-center rounded-full px-2 text-xs font-medium", p.id === "team" ? "bg-inverted text-inverted" : "bg-default text-emphasis")}>{p.badge}</span>}
              </div>
              <p className={cn("text-[13px]", sub)}>{p.desc}</p>
            </div>
            <div>
              <div className={cn("text-4xl font-bold tabular-nums tracking-[-0.05em]", dark ? "text-inverted" : "text-emphasis")}>{p.price}</div>
              <div className={cn("min-h-9 text-[13px] leading-[18px] tabular-nums", sub)}>{p.note.map((line) => <div key={line}>{line}</div>)}</div>
            </div>
            {p.cta}
            <ul className="flex flex-col gap-2.5 text-sm">
              {p.lines.map((line) => (
                <li key={line} className="flex gap-2.5"><Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", dark ? "text-inverted" : "text-success-on-surface")} />{line}</li>
              ))}
            </ul>
            {"footer" in p && p.footer}
          </li>
          );
        })}
      </ul>
      <Dialog open={ebOpen} onOpenChange={setEbOpen}>
        <DialogContent
          padded={false}
          closeLabel={t("common.close")}
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            opener.current?.focus();
          }}
        >
          {SHOW_EB_ILLUSTRATION && (
            <div className="border-b border-default bg-muted">
              <EbFlight />
            </div>
          )}
          <div className="flex flex-col gap-4 p-6">
            <DialogHeader>
              <DialogTitle>{t("ps.ebDialog.title")}</DialogTitle>
              <DialogDescription>{t("ps.free.ctaNote")}</DialogDescription>
            </DialogHeader>
            <DialogBody>
              <ul className="flex flex-col gap-2.5 text-sm">
                {[
                  t("ps.ebDialog.p1", n(EARLY_BIRD.freeDays)),
                  ebCredits,
                  t("ps.ebDialog.p3", n(EARLY_BIRD.priceLockMonths)),
                  t("ps.ebDialog.p4", n(EARLY_BIRD.places), n(EARLY_BIRD.minPeople), n(EARLY_BIRD.maxPeople), formatIsoDate(locale, EARLY_BIRD.closesOn)),
                ].map((line) => (
                  <li key={line} className="flex gap-2.5"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-success-on-surface" />{line}</li>
                ))}
              </ul>
            </DialogBody>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEbOpen(false)}>{t("common.close")}</Button>
              <Button asChild><Link href="/early-bird">{t("site.cta.earlyBird")}</Link></Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold text-emphasis">{t("ps.trial.title", n(TRIAL_DAYS))}</h3>
          <p className="text-[13px] text-subtle">{t("ps.trial.body", n(TRIAL_CREDITS.ownDomain), n(TRIAL_CREDITS.freeEmail))}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold text-emphasis">{t("ps.soon.title")}</h3>
          <p className="text-[13px] text-subtle">{t("ps.soon.body")}</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {SOON_APPS.map((k: MessageKey) => (
              <li key={k} className="inline-flex h-6 items-center rounded-full border border-dashed border-emphasis px-2.5 text-xs font-medium text-subtle">{t(k)}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
