import "server-only";
// Public base URL of the site, for robots.txt, sitemap.xml and links in early bird emails.
// Extracted from the app's `modules/identity/web.ts` (agere-org-V1): the landing page has no session,
// so this is the only request helper it needs.
import { headers } from "next/headers";

/** APP_URL, else the request's own origin. */
export async function appUrl(): Promise<string> {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
