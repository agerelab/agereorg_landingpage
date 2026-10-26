// The public site's addresses (FE-18, D138). This repository serves only the public site, so the proxy
// opens these addresses and sends every other one (the app's /masuk, /<slug>, /api/…) to the home page,
// exactly as the `landingpage` branch of agere-org-V1 did with PUBLIC_SITE_ONLY=true. None of them reads a
// database. Server side only (proxy).

/** The public pages, the crawler files, and Next's own and icon files. */
export const PUBLIC_SITE = /^\/(?:$|beranda|harga|ketentuan|privasi|refund|early-bird|robots\.txt|sitemap\.xml|_next\/|favicon|icon)(?:[/?#.]|$)/;
