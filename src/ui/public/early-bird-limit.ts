// A small per-address brake for the public early bird form: 5 applications an hour. Kept in memory, so it
// resets with the server; enough to stop a flood from one address, not a security boundary.
import "server-only";

const WINDOW_MS = 60 * 60 * 1000;
const MAX = 5;
const hits = new Map<string, number[]>();

export function allowEarlyBird(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX) {
    hits.set(key, recent);
    return false;
  }
  hits.set(key, [...recent, now]);
  return true;
}

export function resetEarlyBirdLimit() {
  hits.clear();
}
