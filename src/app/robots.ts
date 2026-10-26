// robots.txt (FE-18): read the public site, skip the app. The domain comes from the environment.
import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/app-url";
import { CRAWL_CLOSED } from "@/ui/public/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  return { rules: { userAgent: "*", allow: "/", disallow: CRAWL_CLOSED }, sitemap: `${await appUrl()}/sitemap.xml` };
}
