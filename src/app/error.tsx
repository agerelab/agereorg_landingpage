"use client";

// Route error boundary (PRD-22 §2 R5, D128): any page that fails, including on a lost connection, shows the
// agere error state instead of the framework's page; "Coba lagi" re-renders the segment.
import { ErrorState } from "@/ui/shell/error-state";

export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState onRetry={reset} />;
}
