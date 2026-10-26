# AGENTS.md — agere design system 7

Rules for building agere interfaces with `@agere/design-system`. Read before generating or reviewing UI.
MUST and NEVER are blocking; SHOULD needs a stated reason to skip. 42 of 67 rules are enforced automatically.

The bracket after each rule says how it is enforced: G01–G12 run in `npm run lint:guidelines` (G12 warns);
`built-in` means the component or globals.css already does it; `test` is asserted in Vitest or `scripts/verify-browser.py`;
`tokens` is guaranteed by the token build and contrast suite (WCAG 2.1 AA + APCA); `review` needs your judgment.

## agere: use the system

- MUST: Build with `@agere/design-system` components and semantic tokens. The raw palette is removed from the preset; never hard-code a hex value.
- MUST: Status text on neutral surfaces uses `*-on-surface`; text on a status tint uses `*-fg`; fills use `*-solid` with `*-on-solid`, hover `*-solid-hover`.
- MUST: Type comes from `type-*` composite classes; Geist Sans for UI and text, Geist Mono only for the identifier itself.
- MUST: Control heights: sm 32 · md 40 (default) · lg 48; dense workspace modules follow `data-density`.
- MUST: Copy in Bahasa Indonesia uses sentence case, one form of address per product (“kamu” consumer, “Anda” clinical/enterprise), id-ID numbers (1.234,5), Rp with 0 decimals, 24-hour time.
- NEVER: Use `data-contrast="geist"` (or the deprecated `"shadcn"`) in production; it is outside the AA gate.

Adapted from Vercel's Web Interface Guidelines (github.com/vercel-labs/web-interface-guidelines).

## Keyboard & focus

- MUST: Every flow works with the keyboard, following the WAI-ARIA APG pattern for the widget (Radix primitives provide it). [built-in, test]
- MUST: Focus is always visible and never covered by sticky or fixed elements. Use the focus-ring utilities. [built-in, test]
- MUST: Focus is trapped, moved and returned as the APG pattern describes (dialogs, sheets, menus). [built-in, test]
- NEVER: Remove the outline without a visible replacement (focus-ring, focus-ring-inset, focus-ring-field). [G03]

## Targets & input

- MUST: Hit targets are at least 24 px (44 px on mobile). Expand the hit area when the visual is smaller. [review]
- MUST: Inputs are 16 px on phones so iOS never zooms on focus (Input: text-base md:text-sm). [built-in, test]
- NEVER: Disable browser zoom (user-scalable=no, maximum-scale=1). [G05]
- MUST: Controls set touch-action: manipulation (globals.css, v7). [built-in]
- SHOULD: Set -webkit-tap-highlight-color to match the design (globals.css, v7). [built-in]

## Forms

- MUST: Inputs keep focus and value through hydration. [review]
- NEVER: Block paste in inputs or textareas. [G07]
- MUST: Loading buttons show a spinner and keep their label (Button loading sets aria-busy). [built-in, test]
- MUST: Enter submits a focused single input; in a textarea ⌘/Ctrl+Enter submits and Enter adds a line. [review]
- MUST: Submit stays enabled until the request starts, then disables with a spinner. [review]
- MUST: Accept free text and validate afterwards; never swallow keystrokes. [review]
- MUST: Errors sit next to their field (FieldError). On submit, focus the first error. [built-in, review]
- MUST: Set autocomplete, a meaningful name, the right type and inputmode. [review]
- SHOULD: Turn spellcheck off for emails, codes and usernames. [review]
- MUST: Placeholders only in search fields; authoring fields get a visible label and helper text (agere 6.4 guideline, overrides AGENTS.md). [G12]
- MUST: Search placeholders end with … (“Cari pasien…”). Never after an example value: “you@company.com…” reads as if it continues. [G08]
- MUST: Warn before navigation discards unsaved changes (SaveBar). [built-in, review]
- MUST: Work with password managers and 2FA; one-time codes can be pasted (InputOTP). [built-in]
- MUST: Trim values so a trailing space from text expansion never fails validation. [review]
- MUST: Checkboxes and radios have no dead zones: label and control share one hit target. [review]

## State & navigation

- MUST: The URL reflects state: filters, tabs, pagination, expanded panels. [review]
- MUST: Back and Forward restore scroll position. [review]
- MUST: Navigation uses <a> or a router Link (Button asChild) so Cmd/Ctrl/middle-click work. [built-in]
- NEVER: Put click handlers on <div> or <span>. [G06]

## Feedback

- SHOULD: Update optimistically, reconcile with the server, roll back or offer Undo on failure. [review]
- MUST: Destructive actions need a confirmation (AlertDialog) or an Undo window. [built-in, review]
- MUST: Toasts and save status announce through a polite live region (Toaster, SaveStatus, SaveBar). [built-in, test]
- SHOULD: Items that open a follow-up and loading states end with …: “Ganti nama…”, “Menyimpan…”. [G04]

## Touch, drag & tooltips

- MUST: The first tooltip waits; neighbours open instantly (Radix TooltipProvider defaults). [built-in, test]
- MUST: Modals, sheets and drawers set overscroll-behavior: contain (globals.css, v7). [built-in, test]
- MUST: While dragging, disable text selection and mark dragged elements inert. [review]
- MUST: Every drag has a click and keyboard alternative (Kanban card sheet status change, Nested list keyboard moves). [built-in, review]
- MUST: If it looks clickable, it is clickable. [review]
- SHOULD: Autofocus a single primary input on desktop; rarely on mobile. [review]

## Animation

- MUST: Honor prefers-reduced-motion (globals.css). [built-in]
- MUST: Animate transform and opacity only. [G02]
- NEVER: Animate top, left, width or height. (v7: Sidebar collapse snaps; a transform slide is planned for 7.1.) [G02]
- NEVER: Use transition: all. List the properties. [G01]
- SHOULD: Match the easing to the change: ease-standard, ease-enter, ease-exit tokens. [tokens]
- MUST: Animations can be interrupted; autoplay only muted, non-essential loops, with pause after 5 s. [review]
- MUST: transform-origin sits where the motion physically starts; SVG transforms go on a <g> with transform-box: fill-box. [review]

## Layout

- MUST: Align deliberately to the grid, a baseline, an edge or an optical centre. [review]
- MUST: Check mobile, laptop and ultra-wide (50% zoom). [test, review]
- MUST: Respect safe areas with env(safe-area-inset-*) (Drawer does). [review]
- MUST: No unwanted scrollbars; fix overflow at the source. [test]

## Content & accessibility

- MUST: Skeletons mirror the final content so nothing shifts. [review]
- MUST: <title> matches the current context. [review]
- MUST: No dead ends: empty and error states offer a next step (EmptyState actions). [review]
- MUST: Status is never colour alone: pair it with text or an icon label. [review]
- MUST: Accessible names exist even when the visual label is omitted; decoration is aria-hidden. [test]
- MUST: Use the … character, never three periods. [G04]
- MUST: Headings are hierarchical and clear sticky headers (scroll-margin-top, globals.css v7). [built-in, test]
- MUST: Layouts survive short, average and very long user content; flex children get min-w-0. [review]
- MUST: Dates, times, numbers and currency follow the locale; agere defaults to id-ID. [built-in, test]
- MUST: Glue numbers to units and keys with a no-break space: 10 MB, ⌘ K. [G11]
- MUST: Images have explicit width and height (no layout shift). [G09]
- MUST: The brand is lowercase “agere” in visible copy; the legal name PT Agere Teknologi Indonesia keeps its casing. [G10]

## Visual design

- MUST: Text meets WCAG 2.1 AA and APCA (Lc 60 body, Lc 45 UI); boundaries and focus meet 3:1. [tokens, test]
- MUST: Hover and active increase contrast: primary-hover, *-solid-hover, never a faded /90. [tokens, test]
- SHOULD: Shadows layer ambient and direct light (Geist materials in shadow.elevation-*). [tokens]
- SHOULD: Nested radii are concentric: child ≤ parent. [review]
- MUST: Charts use the validated colour-blind-safe chart palette and label series directly. [tokens, review]
- MUST: Dark themes set color-scheme: dark (globals.css). [built-in, test]
