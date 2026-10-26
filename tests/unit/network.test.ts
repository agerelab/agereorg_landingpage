// PRD-22 §2 R1 (D128): one client helper turns a network failure into a result instead of an uncaught
// error; server answers pass through unchanged; other errors still reach the error page (R5).
import { afterEach, describe, expect, it, vi } from "vitest";
import { callAction, isNetworkError, isOffline, OFFLINE } from "@/lib/network";

afterEach(() => vi.unstubAllGlobals());

describe("PRD-22 R1 — callAction", () => {
  it("turns a failed fetch into the offline result", async () => {
    expect(await callAction(() => Promise.reject(new TypeError("Failed to fetch")))).toEqual({ ok: false, error: "common.offline", offline: true });
  });

  it("recognises the network errors of Chrome, Firefox and Safari", () => {
    for (const message of ["Failed to fetch", "NetworkError when attempting to fetch resource.", "Load failed", "network error"]) {
      expect(isNetworkError(new TypeError(message))).toBe(true);
    }
  });

  it("treats any failure while the browser reports offline as a network failure", async () => {
    vi.stubGlobal("navigator", { onLine: false });
    expect(await callAction(() => Promise.reject(new Error("anything")))).toBe(OFFLINE);
  });

  it("passes server answers through unchanged, including refusals", async () => {
    expect(await callAction(() => Promise.resolve({ ok: true as const, id: "t1" }))).toEqual({ ok: true, id: "t1" });
    expect(await callAction(() => Promise.resolve({ ok: false as const, error: "people.error.forbidden" }))).toEqual({ ok: false, error: "people.error.forbidden" });
  });

  it("lets other errors through, so the error page can show them", async () => {
    vi.stubGlobal("navigator", { onLine: true });
    await expect(callAction(() => Promise.reject(new Error("server exploded")))).rejects.toThrow("server exploded");
    await expect(callAction(() => Promise.reject(new TypeError("x is not a function")))).rejects.toThrow("x is not a function");
  });

  it("marks reads that are not results (a task, a count) as offline, so the screen can say so", async () => {
    const read = await callAction(() => Promise.reject<number>(new TypeError("Failed to fetch")));
    expect(isOffline(read)).toBe(true);
    expect(isOffline(await callAction(() => Promise.resolve(3)))).toBe(false);
    expect(isOffline(await callAction(() => Promise.resolve(null)))).toBe(false);
  });
});
