// PRD-12 US-0 "Light by default" (D125, supersedes D122): which theme the server renders.
import { beforeEach, describe, expect, it, vi } from "vitest";

const jar = new Map<string, string>();

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: (name: string) => (jar.has(name) ? { name, value: jar.get(name) } : undefined) }) }));

const { getTheme, getThemePreference } = await import("@/i18n/server");
const { COOKIE } = await import("@/ui/shell/cookies");

beforeEach(() => {
  jar.clear();
});

describe("PRD-12 US-0 — Light by default (D125)", () => {
  it("renders a signed-out visitor without a theme cookie in Terang", async () => {
    expect(await getThemePreference()).toBe("light");
    expect(await getTheme()).toBe("light");
  });

  it("ignores a choice saved under the dark default of D122", async () => {
    jar.set("agere-theme-d122", "dark");
    jar.set("agere-theme", "dark");
    expect(COOKIE.theme).toBe("agere-theme-d125");
    expect(await getTheme()).toBe("light");
  });

  it("keeps Gelap for a visitor who chose it with the footer toggle", async () => {
    jar.set(COOKIE.theme, "dark");
    expect(await getTheme()).toBe("dark");
  });
});
