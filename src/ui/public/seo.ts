// Search engines (FE-18, PO 9 Oct 2026): which public pages the sitemap lists and which addresses crawlers
// skip. The domain is not written here: robots.ts and sitemap.ts take it from APP_URL, else the request,
// so each environment sets its own.
import { LEGAL_DOCS, type LegalDoc } from "@/ui/legal/docs";

const PUBLIC_PAGES = ["/", "/harga", "/early-bird"];

/** The sitemap's pages. A legal page joins once its final text replaces the draft (OPS-02). */
export const sitemapPaths = (docs: Pick<LegalDoc, "slug" | "status">[] = LEGAL_DOCS) => [
  ...new Set([...PUBLIC_PAGES, ...docs.filter((d) => d.status !== "draft").map((d) => `/${d.slug}`)]),
];

/** Crawlers skip the API, the dev gallery, sign-in and account screens. Organization addresses need a
 *  session, so a crawler there only ever reaches /masuk. The early bird decision page is for the team. */
export const CRAWL_CLOSED = [
  "/api/",
  "/galeri",
  "/pengaturan",
  "/masuk",
  "/daftar",
  "/lupa-kata-sandi",
  "/reset-kata-sandi",
  "/verifikasi",
  "/cek-email",
  "/undangan",
  "/buat-organisasi",
  "/pilih-organisasi",
  "/tidak-tersedia",
  "/early-bird/keputusan",
];
