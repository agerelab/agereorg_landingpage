# agere/org landing page — instructions for coding agents

The public site of agere/org (www.agereorg.com). Read `README.md` first. The product spec lives in the
PRD package of `agerelab/agere-org-V1` (`docs/`); this site is card **FE-18** there.

## Rules

1. **Public pages only.** No sign-in, no session, no database. A new page is added to `PUBLIC_SITE` in
   `src/ui/public/site-mode.ts`, or the proxy redirects it to `/`.
2. **Only Agere DS components and tokens** (`src/components/`, vendored, never edited here). Need a DS
   component that is not here? Copy it unchanged from agere-org-V1 `src/components/`. One default
   button per screen. Follow `src/components/AGENTS.md` and tick `src/components/GUIDELINES.md` in UI PRs.
3. **No UI string in components:** everything through `t()`, keys in `en.json` and `id.json`.
   English is the source, Bahasa Indonesia the translation.
4. **Shared content** (see README "Content shared with the app"): prices, credits, legal texts and
   their versions change in both repositories in the same release, with the decision number (D-xx).
5. **Secrets** only in the environment (`.env.example` lists the names). Never commit keys or build
   output (`.next/`, zip files).

## Branches and pull requests

- `main` is what production serves. Never push to it directly: branch (`feat/fe-18-<slug>`,
  `fix/fe-18-<slug>`, `content/<slug>`), open a PR against `main`, and the PO merges it.
- A PR title starts with the card code (`FE-18: …`) and lists the AC it covers.
- Done means `npm run check` is green (typecheck, lint, DS guidelines, JSX comments, tests, build).
