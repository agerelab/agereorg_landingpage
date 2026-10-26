"use client";

// Offline banner (PRD-22 §2 R4, D128). While the browser reports it is offline the banner says so; when the
// connection returns it says "Tersambung lagi." for 4 s. The live region always exists so screen readers
// hear both changes (polite). Save buttons stay enabled: a try shows the inline message (R2).
import * as React from "react";
import { CloudOff, Wifi } from "lucide-react";
import { translator, type Locale } from "@/i18n";

const BACK_MS = 4000;

const subscribe = (notify: () => void) => {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
};

export function OfflineBanner({ locale }: { locale: Locale }) {
  const t = translator(locale);
  const online = React.useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  const [back, setBack] = React.useState(false);

  // "online" only fires after the browser was offline, so it is exactly the moment to say "Tersambung lagi."
  React.useEffect(() => {
    let timer: number | undefined;
    const onOnline = () => {
      window.clearTimeout(timer);
      setBack(true);
      timer = window.setTimeout(() => setBack(false), BACK_MS);
    };
    const onOffline = () => {
      window.clearTimeout(timer);
      setBack(false);
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const message = !online ? t("offline.banner") : back ? t("offline.back") : null;
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-toast flex justify-center px-4">
      {message && (
        <p className="pointer-events-auto flex items-center gap-2 rounded-lg border border-default bg-default px-4 py-2 text-sm text-emphasis shadow-elevation-3">
          {online ? <Wifi aria-hidden className="size-4 text-success-on-surface" /> : <CloudOff aria-hidden className="size-4 text-attention-on-surface" />}
          {message}
        </p>
      )}
    </div>
  );
}
