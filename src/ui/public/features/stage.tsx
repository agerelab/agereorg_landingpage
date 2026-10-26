"use client";

// The frame every feature mock-up sits in (FE-18 v2, agere-org-landing-v2.html "stage"): a dotted surface with
// the product window rising from the bottom edge. The scene plays when the stage scrolls into view and replays
// while it stays there (Replay, also used by the hero mock-up); with reduced motion the global rule shows its
// finished frame without movement. The mock-up is a picture (role="img"); the text beside it carries the meaning.
import * as React from "react";
import { cn } from "@/lib/utils";
import s from "@/ui/auth/feature-showcase.module.css";

const REPLAY_MS = 12000;

/**
 * Plays a scene when it scrolls into view and replays it every 12 s while it stays there; leaving stops the
 * replay. `children` remount on every run (the motion classes restart), and stay on their first frame until the
 * first run. Everything inside is a picture: inert and not selectable.
 */
export function Replay({ className, innerClassName, children }: { className?: string; innerClassName?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [run, setRun] = React.useState(0);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearInterval(timer);
        if (!e.isIntersecting) return;
        setRun((n) => n + 1);
        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) timer = window.setInterval(() => setRun((n) => n + 1), REPLAY_MS);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      <div inert key={run} className={cn("pointer-events-none select-none", innerClassName, run === 0 && s.paused)}>
        {children}
      </div>
    </div>
  );
}

export function Stage({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative h-[460px] overflow-hidden rounded-2xl border border-default bg-muted [background-image:radial-gradient(hsl(var(--ag-border-emphasis))_1px,transparent_1px)] [background-size:20px_20px] md:h-[520px]"
    >
      <Replay className="absolute inset-0" innerClassName="absolute inset-x-4 bottom-[-1px] top-4 md:inset-x-10 md:top-10">
        <div className="flex h-full flex-col overflow-hidden rounded-t-2xl border border-default bg-default shadow-elevation-4">{children}</div>
      </Replay>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-b from-transparent to-[hsl(var(--ag-bg-muted))]" />
    </div>
  );
}

/** The window bar of a mock-up: three dots and the address. */
export function WindowBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap border-b border-default bg-muted px-4 font-mono text-xs text-subtle">
      <span aria-hidden className="mr-1 flex gap-1.5">{[0, 1, 2].map((i) => <i key={i} className="size-2.5 rounded-full border border-default bg-emphasis" />)}</span>
      {children}
    </div>
  );
}
