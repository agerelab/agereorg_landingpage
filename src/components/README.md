# Agere DS 7.3.0 (vendored)

Copied unchanged from the Agere Design System package `@agere/design-system` 7.3.0, the same way
shadcn/ui components are added to a project. It uses the shadcn aliases, which match this repo's
`@/*` → `src/*`:

| Path | From the DS |
|---|---|
| `src/components/ui/` | shadcn-compatible primitives (Button, Dialog, PageHeader, EmptyState, …) |
| `src/components/agere-ds/` | workspace modules (Kanban, DataTable, TaskDrawer, Calendar, …) |
| `src/lib/{agere-tokens,date,dev,theme,tree,utils,workspace}.ts` | helpers (`cn`, date, tree, theme) |
| `src/hooks/`, `src/brand/`, `src/icons/`, `src/tokens/`, `src/styles/` | hooks, logo, icons, generated tokens, `globals.css` |
| `tailwind.preset.ts` (repo root) | Tailwind 3.4 preset |
| `src/components/AGENTS.md` | the DS interface rules (67 rules; G01–G12 checked by `npm run lint:guidelines`) |
| `src/components/GUIDELINES.md` | the rules a person ticks in every UI pull request |
| `scripts/lint-guidelines.mjs`, `scripts/check-jsx-comments.mjs` | the DS's CI checks, adapted to scan this repo's `src/` |

Rules:
- **Do not edit these files.** A change goes to the DS first; upgrade by copying the new release
  over these paths in one PR (note the version here and in `AGENTS.md`).
- They are excluded from ESLint here (linted and tested upstream) but still typechecked.
- License: MIT, see `AGERE-DS-LICENSE`. The agere name and logos are trademarks (not MIT).

**7.2.0 (13 Oct 2026, PO):** adds `ui/rich-text-editor.tsx` (`RichTextEditor`, `RichTextContent` and helpers, exported from `agere-ds/index.ts`) on Tiptap 3.32.0, pinned exactly in `package.json` (`@tiptap/react`, `pm`, `starter-kit`, `extension-list`, `extensions`, `extension-table`). Its own tests (`rich-text-editor.test.tsx`, Testing Library) run upstream and are not copied here; this repo tests the editor where screens use it.

**7.3.0 (22 Oct 2026, for FE-23 Chat, PRD-14 v1.7.1):** chat module v2 in `agere-ds/chat/` (additive: `MessageBubble`, `MessageDivider`, `ChatInputBar` and `ChannelSidebar` keep their 7.2 props). Adds `ChatLabels` with `CHAT_LABELS_EN` / `CHAT_LABELS_ID` and `ChatProvider` (every string through labels, times and sizes through `locale`), structured message segments (no regex mentions), `MessageLog`, `MessageSystem`, `MessageAttachments`, `ConversationHeader`, `ThreadPanel`, `MembersPanel`, `ConversationNavItem` / `ConversationNavSection` for the single navigation bar, and the composer exception in `AGENTS.md` (Enter sends, Shift+Enter adds a line, ⌘/Ctrl+Enter also sends). No new dependencies or tokens. Its own tests (`chat-v2.test.tsx`, 24) run upstream; `tests/unit/ds-chat.test.ts` checks the barrel and the safety helpers here.
