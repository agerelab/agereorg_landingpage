"use client";

// "Kirim undangan" / "Kirim penolakan" on the early bird decision page (FE-18, PO 13 Oct 2026). The only
// button on the page; nothing is sent until it is pressed, so a link scanner opening the page sends
// nothing. After sending, the button gives way to the confirmation; an error keeps the button to retry.
import * as React from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { translator, type Locale } from "@/i18n";
import { callAction } from "@/lib/network";
import { sendDecisionAction, type DecisionState } from "@/app/(publik)/early-bird/keputusan/actions";

const send = async (prev: DecisionState, form: FormData): Promise<DecisionState> => {
  const r = await callAction(() => sendDecisionAction(prev, form));
  return "offline" in r ? { ok: false, error: "common.offline" } : r;
};

export function DecisionForm({ token, decision, locale }: { token: string; decision: "accept" | "deny"; locale: Locale }) {
  const t = translator(locale);
  const [state, action, pending] = React.useActionState(send, {});
  const done = React.useRef<HTMLDivElement>(null);
  const sent = "ok" in state && state.ok ? state : null;
  React.useEffect(() => {
    if (sent) done.current?.focus();
  }, [sent]);

  if (sent)
    return (
      <div ref={done} tabIndex={-1} className="outline-none">
        <Alert variant="success" live="polite">{t(decision === "accept" ? "ebd.sent.accept" : "ebd.sent.deny", sent.email)}</Alert>
      </div>
    );
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="t" value={token} />
      <input type="hidden" name="d" value={decision} />
      {"ok" in state && !state.ok && <Alert variant="error">{t(state.error)}</Alert>}
      <Button type="submit" loading={pending} className="self-start">
        {t(decision === "accept" ? "ebd.send.accept" : "ebd.send.deny")}
      </Button>
    </form>
  );
}
