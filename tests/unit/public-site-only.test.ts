// FE-18 — this repository serves only the public site (D138; moved out of the `landingpage` branch of
// agere-org-V1, where the same behavior needed PUBLIC_SITE_ONLY=true):
//   When a visitor opens any app address, Then the home page opens
//   Then the public pages and the crawler files stay open
//   Then the health check, which is about the app's database, is not served here either
// No page reads a database, so the site runs without DATABASE_URL.
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

const go = (path: string, cookie?: string) => {
  const res = proxy(new NextRequest(`https://www.agereorg.example${path}`, cookie ? { headers: { cookie } } : undefined));
  const to = res.headers.get("location");
  return to ? new URL(to).pathname + new URL(to).search : "open";
};

describe("FE-18 — public site only (D138)", () => {
  it("When a visitor opens an app address, Then the home page opens", () => {
    for (const path of ["/masuk", "/daftar?plan=team", "/maju-jaya", "/maju-jaya/desk", "/pengaturan/profil", "/undangan?token=x", "/buat-organisasi", "/api/me", "/api/health", "/galeri"]) {
      expect(go(path), path).toBe("/");
    }
  });

  it("Then the public pages and the crawler files stay open", () => {
    for (const path of ["/", "/beranda", "/harga", "/early-bird", "/early-bird?lang=en", "/ketentuan", "/privasi?lang=en", "/refund", "/robots.txt", "/sitemap.xml", "/favicon.ico", "/icon.svg"]) {
      expect(go(path), path).toBe("open");
    }
  });

  it("Then a session cookie does not open the app either", () => {
    expect(go("/maju-jaya", "agere_session=abc")).toBe("/");
  });

  it("Given a stale session cookie, Then a public page never sees it", () => {
    const res = proxy(new NextRequest("https://www.agereorg.example/beranda", { headers: { cookie: "agere-lang=id; agere_session=abc" } }));
    expect(res.headers.get("location")).toBeNull();
    const forwarded = res.headers.get("x-middleware-request-cookie") ?? "";
    expect(forwarded).not.toContain("agere_session");
    expect(forwarded).toContain("agere-lang=id");
  });

  it("does not mistake an app address that only starts like a public one", () => {
    expect(go("/hargaku")).toBe("/");
    expect(go("/beranda-lama")).toBe("/");
  });
});
