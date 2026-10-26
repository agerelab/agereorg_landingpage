// Connection loss (PRD-22 §2, D128 R1). Every write from the browser goes through callAction: a network
// failure becomes the OFFLINE result, which callers already handle like any refused save (the form stays
// open, its fields keep their values, the message says the connection dropped). Server answers pass
// through unchanged; any other error is rethrown so the error page (R5) shows it.

export const OFFLINE = { ok: false, error: "common.offline", offline: true } as const;
export type Offline = typeof OFFLINE;

// Chrome "Failed to fetch", Firefox "NetworkError when attempting to fetch resource.", Safari "Load failed".
const NETWORK_MESSAGE = /failed to fetch|networkerror|network error|load failed/i;

/** True for the offline result, so reads that return a task or a count (not a result) can tell it apart. */
export const isOffline = (value: unknown): value is Offline => value === OFFLINE;

export function isNetworkError(error: unknown): boolean {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return true;
  return error instanceof TypeError && NETWORK_MESSAGE.test(error.message);
}

// The offline result carries every other failure field of the wrapped action as `undefined` (conflict,
// args, fields, …), so callers keep reading `r.conflict` or `r.fields` without narrowing first.
type FailKeys<T> = T extends { ok: false } ? keyof T : never;
export type OfflineFor<T> = Offline & { readonly [K in Exclude<FailKeys<T>, keyof Offline>]?: undefined };

export async function callAction<T>(run: () => Promise<T>): Promise<T | OfflineFor<T>> {
  try {
    return await run();
  } catch (error) {
    // Safe: the extra fields of OfflineFor<T> are all optional and absent.
    if (isNetworkError(error)) return OFFLINE as OfflineFor<T>;
    throw error;
  }
}
