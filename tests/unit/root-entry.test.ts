// FE-18 — the site's address opens the landing page (D133, PO 9 Oct 2026). This repository has no
// session, so "/" always renders the home page, and every app address goes to "/" (D138).
import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => undefined }) }));

const { default: Home } = await import("@/app/page");
const { proxy } = await import("@/proxy");

describe("FE-18 — the site's address (D133)", () => {
  it("When a visitor opens /, Then the landing page opens directly", async () => {
    expect(proxy(new NextRequest("https://www.agereorg.example/")).headers.get("location")).toBeNull();
    expect(await Home()).toBeTruthy();
  });

  it("When a visitor opens an app address, Then the home page opens, without redirect_to", () => {
    const res = proxy(new NextRequest("https://www.agereorg.example/maju-jaya/desk?tab=1"));
    const to = new URL(res.headers.get("location")!);
    expect(to.pathname).toBe("/");
    expect(to.search).toBe("");
  });
});
