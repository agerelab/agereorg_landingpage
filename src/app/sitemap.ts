// sitemap.xml (FE-18): the public pages on the environment's domain; legal pages join once final.
import type { MetadataRoute } from "next";
import { appUrl } from "@/lib/app-url";
import { sitemapPaths } from "@/ui/public/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await appUrl();
  return sitemapPaths().map((path) => ({ url: `${base}${path}` }));
}
