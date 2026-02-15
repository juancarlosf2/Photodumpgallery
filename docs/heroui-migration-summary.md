# HeroUI Migration Summary (Compact)

## Scope
- Objective: Replace shadcn/ui usage with HeroUI v3, remove shadcn component files, and update docs/skills.
- Keep local UI helpers: `panel`, `fade-in`, `file-upload`, `form`, `toast`.

## Patterns Used
- Imports: `@heroui/react` for UI primitives.
- Events: `onClick` → `onPress` for HeroUI components.
- Disabled: `disabled` → `isDisabled` for HeroUI `Button`; **keep** `disabled` for `Input`/`TextArea`.
- Icon buttons: use `isIconOnly` and set sizes via `size="sm"`.
- Dialogs: shadcn Dialog/Sheet → HeroUI `Modal` with `Modal.Backdrop`, `Modal.Container`, `Modal.Dialog`.
- Select: HeroUI `Select` + `ListBox`, `value` + `onChange` (not `selectedKey`/`onSelectionChange`).
- Switch: HeroUI `Switch` with `Switch.Control` + `Switch.Thumb`.
- Badges: `Badge` → `Chip`.
- Cards: `Card.Header`, `Card.Content`, `Card.Footer` compound API.
- Routing links in TanStack Start: use `Link`, `ButtonLink`, and `BreadcrumbItem` wrappers built with `createLink`.
- Breadcrumb runtime pattern (current repo): internal crumbs use nested `Link` inside `BreadcrumbItem` and exact `activeOptions` defaults for parent crumbs.

## Key Code Changes (Highlights)

### Dependencies
- Added: `@heroui/react@beta`, `@heroui/styles@beta`, `tailwind-variants`.
- Removed: `@radix-ui/*`, `class-variance-authority`, `tailwindcss-animate`, `tw-animate-css`.
- Lockfile updated via `bun install`.

### Theme & Styles
- `src/styles/app.css`: import `@heroui/styles` and use HeroUI token mapping + compatibility aliases.
- `src/components/theme-provider.tsx` and `src/routes/__root.tsx`: use `data-theme` + `data-theme-preference`.
- Latest token equivalence remap (shadcn -> HeroUI semantics):
  - `muted` background intent -> `surface-secondary`
  - `muted-foreground` text intent -> `muted`
  - `input` intent -> `border`
  - legacy `var(--primary)` usages replaced with `var(--accent)` in custom CSS/shadows.
- Removed remaining legacy root aliases (`--primary`, `--card`, `--popover`, etc.) from `app.css`.

### Components / Routes
- Converted to HeroUI: buttons, dropdowns, modals, selects, inputs, textareas, chips, cards, avatars.
- Replaced shadcn dialogs in:
  - `AddContentDialog`, `EditCommentDialog`, `EventDialog`, `EventModal`, `ModuleDialog`, `PortfolioItemForm`, `ConfirmDeleteDialog`, `DeletePostDialog`, `DeleteCommentDialog`.
- Replaced badges with chips in:
  - `PlanBadge`, `SubscriptionStatus`, `PortfolioItemCard`, `SkillsInput`, `profile/$userId` route, classroom/community pages.
- Converted multiple forms to HeroUI inputs:
  - `ContentForm`, `EventForm`, `PostForm`, `CommentForm`, `ModuleForm`, `ExtendedProfileForm`.
- Buttons converted to `onPress` across:
  - landing sections (`Hero`, `FinalCTASection`, `BenefitsSection`, `FAQSection`, etc.),
  - dashboard pages, profile page, messaging components.
- Breadcrumb fix:
  - `src/components/AppBreadcrumb.tsx` types internal crumbs from `LinkComponentProps<typeof BreadcrumbItem>`, forwards internal link props to wrapper + nested `Link`, and defaults parent crumb active matching to `exact`.

### UI File Removals
- Deleted shadcn UI files in `src/components/ui/`:
  - `accordion`, `alert-dialog`, `avatar`, `badge`, `breadcrumb`, `button`, `card`, `checkbox`, `dialog`, `dropdown-menu`, `input`, `label`, `select`, `sheet`, `slider`, `switch`, `textarea`, `tooltip`.
- Removed `components.json` (shadcn config).

## Documentation & Skills Updates
- Added migration guide: `docs/heroui-migration-guide.md`.
- Updated project docs: `README.md`, `CLAUDE.md` to reference HeroUI.
- Updated skills:
  - `agentic-jumpstart-frontend` (HeroUI patterns)
  - `agentic-jumpstart-react` (HeroUI modal/forms)
  - `agentic-jumpstart-code-quality` (local UI helpers only)
  - `agentic-jumpstart-dependency-management` (HeroUI deps)
  - `agentic-jumpstart-performance` (UI vendor chunk)
  - `shadcn-to-heroui-migration` (new dedicated migration skill)

## What Was Not Changed
- Local helper components: `Panel`, `FadeIn`, `FileUpload`, `Sonner` kept.
- Non-UI logic (hooks, data access, business logic) untouched.
- Existing layout/spacing/visual composition preserved where possible, except for HeroUI default styling adoption.

## Known Follow-ups / Notes
- Build currently passes with `bun run build`.
- Environment prerequisites are already satisfied:
  - Node baseline: `v20.19.0`
  - `pyyaml` installed (`6.0.3`)
- Operational rule: do **not** re-run `nvm use 20.19` or reinstall `pyyaml` on every migration pass; only re-run if environment/version actually changed.
- Vite still reports a large bundle warning for the main chunk; code-splitting remains an optional follow-up.
