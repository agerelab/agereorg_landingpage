"use client";

// Root error boundary (PRD-22 §2 R5, D128): replaces the root layout when it fails, so it brings its own
// <html>, <body> and stylesheet. The language comes from the cookie (ErrorState).
import "@/styles/globals.css";
import { ErrorState } from "@/ui/shell/error-state";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <ErrorState onRetry={reset} />
      </body>
    </html>
  );
}
