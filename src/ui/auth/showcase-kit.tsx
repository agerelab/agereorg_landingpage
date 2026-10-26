import type * as React from "react";

// Timing for the animated mock-ups (D121; the auth feature panel and the public site): every step is a motion
// class plus a delay from the moment its scene plays.

/** Animation delay in seconds from the moment the scene appears. */
export const at = (seconds: number): React.CSSProperties => ({ animationDelay: `${seconds}s` });
