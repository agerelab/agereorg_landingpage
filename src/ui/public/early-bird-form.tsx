"use client";

// "Daftar early bird" form (FE-18 v2, agere-org-landing-v2.html). Every error shows on its field and the
// first wrong field takes focus; values stay after an error. The success panel takes focus and offers to
// register another organization. A dropped connection keeps the form (D128).
import * as React from "react";
import Link from "next/link";
import { Check, Info } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { translator, type Locale, type MessageKey } from "@/i18n";
import { EARLY_BIRD, TRIAL_DAYS } from "@/modules/billing/plans";
import { callAction } from "@/lib/network";
import { submitEarlyBirdAction } from "@/app/(publik)/early-bird/actions";
import { outsideProgram, ROLES, TEAM_SIZES, type EarlyBirdState } from "./early-bird";

const send = async (prev: EarlyBirdState, form: FormData): Promise<EarlyBirdState> => {
  const r = await callAction(() => submitEarlyBirdAction(prev, form));
  return "offline" in r ? { ok: false, error: "common.offline" } : r;
};

export function EarlyBirdForm({ locale }: { locale: Locale }) {
  const [round, setRound] = React.useState(0);
  return <Round key={round} locale={locale} onAgain={() => setRound((n) => n + 1)} />;
}

function Round({ locale, onAgain }: { locale: Locale; onAgain: () => void }) {
  const t = translator(locale);
  const [state, action, pending] = React.useActionState(send, {});
  const ref = React.useRef<HTMLFormElement>(null);
  const done = React.useRef<HTMLDivElement>(null);
  const failed = "ok" in state && !state.ok ? state : null;
  const [size, setSize] = React.useState(failed?.values?.size ?? "");
  // Submitted by hand, not through `action`: React resets a form after its action, which would clear the
  // team size, role and the terms box after an error.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    React.startTransition(() => action(data));
  };
  const err = (k: "email" | "name" | "organization" | "size" | "role" | "agree") => (failed?.fields?.[k] ? t(failed.fields[k] as MessageKey) : undefined);

  React.useEffect(() => {
    if ("ok" in state && state.ok) done.current?.focus();
    else if (failed?.fields) ref.current?.querySelector<HTMLElement>("[aria-invalid=true]")?.focus();
  }, [state, failed]);

  if ("ok" in state && state.ok)
    return (
      <div ref={done} tabIndex={-1} role="status" className="flex flex-col gap-4 rounded-xl border border-default bg-default p-5 shadow-elevation-3 outline-none md:p-8">
        <span aria-hidden className="grid size-10 place-items-center rounded-full bg-success-bg text-success-on-surface"><Check className="size-5" /></span>
        <h2 className="text-xl font-semibold tracking-[-0.025em] text-emphasis">{t("eb.done.title")}</h2>
        <p className="text-sm text-subtle">{t("eb.done.body", state.email)}</p>
        <Button variant="outline" className="self-start" onClick={onAgain}>{t("eb.done.again")}</Button>
      </div>
    );

  const agreeErr = err("agree");
  return (
    <form ref={ref} onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-xl border border-default bg-default p-5 shadow-elevation-3 md:p-8">
      <div>
        <h2 className="text-xl font-semibold tracking-[-0.025em] text-emphasis">{t("eb.form.title")}</h2>
        <p className="mt-1 text-sm text-subtle">{t("eb.form.lead")}</p>
      </div>
      {failed?.error && <Alert variant="error">{t(failed.error)}</Alert>}
      <FormField label={t("eb.f.email")} hint={t("eb.f.emailHelp")} error={err("email")} required>
        <FormControl><Input name="email" type="email" autoComplete="email" defaultValue={failed?.values?.email} /></FormControl>
      </FormField>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={t("eb.f.name")} error={err("name")} required>
          <FormControl><Input name="name" autoComplete="name" maxLength={80} defaultValue={failed?.values?.name} /></FormControl>
        </FormField>
        <FormField label={t("eb.f.organization")} error={err("organization")} required>
          <FormControl><Input name="organization" autoComplete="organization" maxLength={120} defaultValue={failed?.values?.organization} /></FormControl>
        </FormField>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label={t("eb.f.size")} hint={t("eb.f.sizeHelp", String(EARLY_BIRD.minPeople), String(EARLY_BIRD.maxPeople))} error={err("size")} required>
          <Select name="size" value={size} onValueChange={setSize}>
            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
            <SelectContent>{TEAM_SIZES.map((s) => <SelectItem key={s} value={s}>{t(`eb.size.${s}` as MessageKey)}</SelectItem>)}</SelectContent>
          </Select>
        </FormField>
        <FormField label={t("eb.f.role")} error={err("role")} required>
          <Select name="role" defaultValue={failed?.values?.role}>
            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
            <SelectContent>{ROLES.map((r) => <SelectItem key={r} value={r}>{t(`eb.role.${r}` as MessageKey)}</SelectItem>)}</SelectContent>
          </Select>
        </FormField>
      </div>
      {outsideProgram(size) && (
        <Alert variant="attention" icon={<Info />}>{t("eb.f.sizeNote", String(EARLY_BIRD.minPeople), String(EARLY_BIRD.maxPeople), String(TRIAL_DAYS))}</Alert>
      )}
      <div className="grid gap-1.5">
        <label className="flex items-start gap-2.5 text-sm">
          <Checkbox name="agree" aria-invalid={agreeErr ? true : undefined} aria-describedby={agreeErr ? "eb-agree-err" : undefined} className="mt-0.5" />
          <span>
            {t("eb.f.agreeA")} <Link href="#syarat" className="underline underline-offset-2 focus-ring rounded-sm">{t("eb.f.agreeTerms")}</Link> {t("eb.f.agreeAnd")}{" "}
            <Link href="/privasi" className="underline underline-offset-2 focus-ring rounded-sm">{t("eb.f.agreePrivacy")}</Link>.
          </span>
        </label>
        {agreeErr && <p id="eb-agree-err" className="text-sm text-error-on-surface">{agreeErr}</p>}
      </div>
      <div aria-hidden className="absolute left-[-9999px] h-0 overflow-hidden">
        <label>{t("eb.f.website")}<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <input type="hidden" name="lang" value={locale} />
      <Button type="submit" size="lg" className="w-full" loading={pending}>{t("eb.f.submit")}</Button>
      <p className="text-xs text-subtle">{t("eb.f.contactNote")}</p>
    </form>
  );
}
