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

- **cPanel (DomaiNesia), current production (D147):** `.cpanel.yml` copies the repository to the
  account's `agereorg.com/` folder; Passenger starts `server.cjs` → `server.js`. Build on the server with
  `npm ci && npm run build`.
- **Vercel (D136):** `vercel.json` pins region `sin1`. Set the variables from `.env.example`.

## Content shared with the app

These files are copies of the app's and must say the same thing in both repositories (prices, credits
and legal versions are binding, D134–D137). Change them in both, in the same release:

- `src/modules/billing/plans.ts` — plans, prices, early bird rules
- `src/content/legal/**` — legal documents (versions are recorded in early bird consent)
- `src/i18n/en.json`, `src/i18n/id.json` — public copy (the files still carry the app's keys)
- `src/components/`, `src/styles/`, `src/tokens/`, `tailwind.preset.ts` — Agere DS 7.0
