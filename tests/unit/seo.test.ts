// FE-18 — search engines before go-live (PO, 9 Oct 2026): crawlers get the public pages and skip the app;
// the domain comes from the environment (APP_URL, else the request), never from the code; legal pages
// stay out of search while they are drafts (OPS-02 on hold); one language per address, English by default.
import { beforeEach, describe, expect, it, vi } from "vitest";

let host = "preview.example.test";
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ host, "x-forwarded-proto": "https" }),
  cookies: async () => ({ get: () => undefined }),
}));

const { default: robots } = await import("@/app/robots");
const { default: sitemap } = await import("@/app/sitemap");
const { CRAWL_CLOSED, sitemapPaths } = await import("@/ui/public/seo");
const { LEGAL_DOCS } = await import("@/ui/legal/docs");
const { legalMetadata } = await import("@/ui/legal/legal-page");
const { isPublicPath } = await import("@/proxy");

describe("FE-18 — robots.txt and sitemap.xml", () => {
  beforeEach(() => {
    delete process.env.APP_URL;
    host = "preview.example.test";
  });

  it("Given APP_URL is set, When a crawler reads robots.txt, Then the sitemap is on that domain", async () => {
    process.env.APP_URL = "https://agere.example/";
    expect((await robots()).sitemap).toBe("https://agere.example/sitemap.xml");
  });

  it("Given no APP_URL, When a crawler reads robots.txt, Then the sitemap is on the address it asked", async () => {
    expect((await robots()).sitemap).toBe("https://preview.example.test/sitemap.xml");
  });

  it("lets crawlers read the site but skip the API, the dev gallery, sign-in and account screens", async () => {
    expect((await robots()).rules).toEqual({ userAgent: "*", allow: "/", disallow: CRAWL_CLOSED });
    for (const path of ["/api/", "/galeri", "/pengaturan", "/masuk", "/daftar", "/verifikasi", "/undangan", "/buat-organisasi"]) {
      expect(CRAWL_CLOSED).toContain(path);
    }
    for (const path of sitemapPaths()) expect(CRAWL_CLOSED.some((closed) => path.startsWith(closed))).toBe(false);
  });

  it("lists the public pages and the final legal documents on the environment's domain", async () => {
    process.env.APP_URL = "https://agere.example";
    expect((await sitemap()).map((entry) => entry.url)).toEqual([
      "https://agere.example/",
      "https://agere.example/early-bird",
      "https://agere.example/ketentuan",
      "https://agere.example/privasi",
      "https://agere.example/refund",
    ]);
  });

  it("Given no session, When a crawler asks for robots.txt or sitemap.xml, Then it gets them, not sign-in", () => {
    expect(isPublicPath("/robots.txt")).toBe(true);
    expect(isPublicPath("/sitemap.xml")).toBe(true);
  });

  it("lists only pages readable without signing in", () => {
    for (const path of sitemapPaths()) expect(isPublicPath(path)).toBe(true);
  });

  it("Given a legal page has its final text (D134), Then search engines may index it, titled from the document", async () => {
    for (const doc of LEGAL_DOCS) expect((await legalMetadata(doc.slug)).robots).toBeUndefined();
    expect((await legalMetadata("ketentuan")).title).toBe("Ketentuan Layanan agere/org");
    expect((await legalMetadata("ketentuan", Promise.resolve({ lang: "en" }))).title).toBe("Terms of Service");
  });

  it("Given a legal page is a draft, Then it stays out of the sitemap; the early bird page is listed once", () => {
    const draft = LEGAL_DOCS.map((doc) => ({ ...doc, status: "draft" as const }));
    expect(sitemapPaths(draft)).toEqual(["/", "/early-bird"]);
    expect(sitemapPaths()).toEqual(["/", "/early-bird", "/ketentuan", "/privasi", "/refund"]);
  });
});
