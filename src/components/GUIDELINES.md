# agere interface review checklist

Generated from `src/docs/registry/interface-rules.ts`. 42 of 67 rules are enforced automatically; tick the rest in every UI pull request.

## Targets & input

- [ ] MUST: Hit targets are at least 24 px (44 px on mobile). Expand the hit area when the visual is smaller.

## Forms

- [ ] MUST: Inputs keep focus and value through hydration.
- [ ] MUST: Enter submits a focused single input; in a textarea ⌘/Ctrl+Enter submits and Enter adds a line.
- [ ] MUST: Submit stays enabled until the request starts, then disables with a spinner.
- [ ] MUST: Accept free text and validate afterwards; never swallow keystrokes.
- [ ] MUST: Errors sit next to their field (FieldError). On submit, focus the first error.
- [ ] MUST: Set autocomplete, a meaningful name, the right type and inputmode.
- [ ] SHOULD: Turn spellcheck off for emails, codes and usernames.
- [ ] MUST: Warn before navigation discards unsaved changes (SaveBar).
- [ ] MUST: Trim values so a trailing space from text expansion never fails validation.
- [ ] MUST: Checkboxes and radios have no dead zones: label and control share one hit target.

## State & navigation

- [ ] MUST: The URL reflects state: filters, tabs, pagination, expanded panels.
- [ ] MUST: Back and Forward restore scroll position.

## Feedback

- [ ] SHOULD: Update optimistically, reconcile with the server, roll back or offer Undo on failure.
- [ ] MUST: Destructive actions need a confirmation (AlertDialog) or an Undo window.

## Touch, drag & tooltips

- [ ] MUST: While dragging, disable text selection and mark dragged elements inert.
- [ ] MUST: Every drag has a click and keyboard alternative (Kanban card sheet status change, Nested list keyboard moves).
- [ ] MUST: If it looks clickable, it is clickable.
- [ ] SHOULD: Autofocus a single primary input on desktop; rarely on mobile.

## Animation

- [ ] MUST: Animations can be interrupted; autoplay only muted, non-essential loops, with pause after 5 s.
- [ ] MUST: transform-origin sits where the motion physically starts; SVG transforms go on a <g> with transform-box: fill-box.

## Layout

- [ ] MUST: Align deliberately to the grid, a baseline, an edge or an optical centre.
- [ ] MUST: Check mobile, laptop and ultra-wide (50% zoom).
- [ ] MUST: Respect safe areas with env(safe-area-inset-*) (Drawer does).

## Content & accessibility

- [ ] MUST: Skeletons mirror the final content so nothing shifts.
- [ ] MUST: <title> matches the current context.
- [ ] MUST: No dead ends: empty and error states offer a next step (EmptyState actions).
- [ ] MUST: Status is never colour alone: pair it with text or an icon label.
- [ ] MUST: Layouts survive short, average and very long user content; flex children get min-w-0.

## Visual design

- [ ] SHOULD: Nested radii are concentric: child ≤ parent.
- [ ] MUST: Charts use the validated colour-blind-safe chart palette and label series directly.

## Placeholder backlog (G12)

Run `npm run lint:guidelines -- --warnings` for the current list of authoring fields that still use a placeholder.
