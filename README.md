# agere/org — landing page

The public site of agere/org at **www.agereorg.com**: the home page, the early bird program and its
sign-up form, and the legal pages. No accounts, no database.

Moved on 26 Oct 2026 from the `landingpage` release branch of
[`agerelab/agere-org-V1`](https://github.com/agerelab/agere-org-V1) (commit `de70dbf`, the version live
at the time). The app itself stays in that repository.

- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript, Tailwind 3.4, Vitest.
- **UI:** Agere DS 7.0, vendored in `src/components/` (only the components this site uses).
- **Languages:** English (default) and Bahasa Indonesia, from the header switch (cookie `agere-lang`).

## Pages

| Address | What it is |
|---|---|
| `/` | Home (`/beranda` redirects here) |
| `/early-bird` | Early bird program, sign-up form, Early Bird Program Terms (`#syarat`) |
| `/early-bird/keputusan` | Team-only decision page opened from the application email (sealed link, not indexed) |
| `/ketentuan`, `/privasi`, `/refund` | Terms of Service, Privacy Policy, Refund Policy (`?lang=en` for English) |
| `/harga` | Pricing, off until `SHOW_PRICING` in `src/ui/public/content.ts` is turned on (redirects to `/`) |
| `/robots.txt`, `/sitemap.xml` | Crawler files on the domain from `APP_URL` |

Every other address (the app's `/masuk`, `/<organization>`, `/api/…`) redirects to `/` (`src/proxy.ts`).

## Getting started

```bash
npm install
cp .env.example .env.local   # optional locally
npm run dev                  # http://localhost:3000
```

Without `RESEND_API_KEY` and `EMAIL_FROM`, early bird emails are written to the terminal in development;
in production the form refuses to "send" until both are set.

| Command | What it does |
|---|---|
| `npm run dev` | Local site on :3000 |
| `npm run check` | Everything CI runs: typecheck, lint, DS guidelines, JSX comments, tests, build |
| `npm test` | Vitest |
| `npm run build` | `next build` |
| `npm run start:cpanel` | Node server used by cPanel / Passenger (`server.js`) |

## Deploy

- **Production: Vercel (D164, D166).** `main` deploys to the Vercel project `agereorg-landingpage`, which
  serves `www.agereorg.com` and the apex `agereorg.com` (no redirect, D165). `vercel.json` pins region
  `sin1`. Set the variables from `.env.example`. The project stays on the Hobby plan: the PO accepted the
  non-commercial-use risk on 26 Oct 2026 (PRD-00 D163, Q-D163-1).
- **Fallback: the app's VPS, same day (Q-D163-1).** If Vercel pauses or blocks the project, the site runs
  as a Node process on the VPS that serves `app.agereorg.com` (D163): `npm ci && npm run build`, then
  `npm run start:cpanel` (`server.js`; `server.cjs` is the CommonJS entry for hosts that need one) behind
  the same reverse proxy, and DNS for `www` and the apex moves there. The fallback is tested once before
  R2 (FE-18).
- **cPanel is retired** (D164 superseded D147): `.cpanel.yml` is removed; nothing deploys to DomaiNesia.

## Content shared with the app

These files are copies of the app's and must say the same thing in both repositories (prices, credits
and legal versions are binding, D134–D137). Change them in both, in the same release:

- `src/modules/billing/plans.ts` — plans, prices, early bird rules
- `src/content/legal/**` — legal documents (versions are recorded in early bird consent)
- `src/i18n/en.json`, `src/i18n/id.json` — public copy (the files still carry the app's keys)
- `src/components/`, `src/styles/`, `src/tokens/`, `tailwind.preset.ts` — Agere DS 7.0

### Waiting on the app's decisions of 26 Oct 2026 (D162, D163; Index C-41)

These texts change only through the legal review (OPS-02) before R2, in both repositories at once:

| File | What it says now | What changes | When |
|---|---|---|---|
| `src/content/legal/*/privacy-policy.md`, `kebijakan-privasi.md` §6 "AI models" | "through a model intermediary and model providers that do not keep the data" | No intermediary: the OpenAI API is called directly (D162). Whether "do not keep" stays depends on the ZDR / Modified Abuse Monitoring request; otherwise up to 30 days of abuse-monitoring retention is disclosed | Compliance gate 8 Jan 2027 |
| Same files, §5 and §8.3 | Providers "do not keep the data" | As above | 8 Jan 2027 |
| Same files, §6–§7 hosting and database | Singapore | The app runs on a VPS with a managed Postgres and an S3-compatible store (D163); the location stays Singapore only if Q-D163-3, Q-D163-4 and Q-D163-6 choose it | Before R2 |
| `src/content/legal/*/terms-of-service.md`, `ketentuan-layanan.md` Article 2 | "The agere/org web app at www.agereorg.com" | `app.agereorg.com` (D165) | Before R2 |
| `src/i18n/*.json` `ctl.ai.*` ("AI without keeping data") | Providers that do not keep data | Follows the Privacy Policy outcome above | 8 Jan 2027 |
| `src/ui/public/site-header.tsx` "Sign in" (`SHOW_SIGN_IN`) | Links to `/masuk`, which this site redirects home | Link to `https://app.agereorg.com/masuk` (and sign-up to `/daftar`) when the flag is turned on (D165) | When the app opens |
