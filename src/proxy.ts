// Proxy (FE-18, D138): the public pages and nothing else; every other address goes to the home page.
// The app's session cookie (agere_session) is dropped so no page ever acts on it: this site has no
// session store. Same behavior as the `landingpage` branch of agere-org-V1 with PUBLIC_SITE_ONLY=true.
import { NextResponse, type NextRequest } from "next/server";
import { PUBLIC_SITE } from "@/ui/public/site-mode";

const SESSION = "agere_session";

/** Whether an address is part of the public site (and so opens without a redirect). */
export const isPublicPath = (pathname: string) => PUBLIC_SITE.test(pathname);

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_SITE.test(pathname)) {
    if (!req.cookies.has(SESSION)) return NextResponse.next();
    const headers = new Headers(req.headers);
    const kept = req.cookies.getAll().filter((c) => c.name !== SESSION);
    if (kept.length) headers.set("cookie", kept.map((c) => `${c.name}=${c.value}`).join("; "));
    else headers.delete("cookie");
    return NextResponse.next({ request: { headers } });
  }
  const home = req.nextUrl.clone();
  home.pathname = "/";
  home.search = "";
  return NextResponse.redirect(home);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|webp|ico|txt)$).*)"],
};
