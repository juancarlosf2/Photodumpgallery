# HeroUI Migration Context Window (Compact)

## Locked Decisions
- Use direct HeroUI imports (`@heroui/react`) and HeroUI default token styling.
- Keep project-local helpers in `src/components/ui`: `panel`, `fade-in`, `file-upload`, `form`, `toast`.
- For TanStack Start internal navigation, use wrapper components (`Link`, `ButtonLink`, `BreadcrumbItem`) instead of raw internal `href`.

## Current Wrapper Pattern
- `src/components/ui/link.tsx`:
  - `Link` = `createLink(HeroUI Link wrapper)` with `preload="intent"`.
  - `ButtonLink` = `createLink(anchor + HeroUI `buttonVariants`)` with `preload="intent"`.
- `src/components/ui/breadcrumbs.tsx`:
  - `BreadcrumbItem` = `createLink(Breadcrumbs.Item)` with `preload="intent"`.
- `src/components/AppBreadcrumb.tsx`:
  - Internal entries are typed from `LinkComponentProps<typeof BreadcrumbItem>` so `to`/`params`/`search`/`hash` align with wrapper props.
  - Supports three entry modes: internal (`to`), external (`href`), and current page label.
  - Internal breadcrumb items currently render a nested `Link` inside `BreadcrumbItem` (project-specific workaround for reliable internal anchor behavior).
  - Parent/internal crumbs default to exact `activeOptions` matching when not explicitly provided.
  - Current crumb styling uses group/current-state classes on the content span.

## Breadcrumb Application Fixes (Latest)
- Converted all `AppBreadcrumb` call sites from internal `href` to internal `to`.
- Corrected broken profile breadcrumb path:
  - `/members` -> `/dashboard/members`.
- Updated files:
  - `src/routes/dashboard/classroom.tsx`
  - `src/routes/dashboard/community/index.tsx`
  - `src/routes/dashboard/members.tsx`
  - `src/routes/dashboard/settings.tsx`
  - `src/routes/profile/$userId/index.tsx`
  - `src/routes/dashboard/community/create-post.tsx`
  - `src/routes/dashboard/community/post/$postId/index.tsx`
  - `src/routes/dashboard/community/post/$postId/edit.tsx`

## Visual/Token Fixes Already Applied
- `src/styles/app.css`:
  - Added semantic shadcn-compat mappings using HeroUI tokens:
    - `--color-muted` -> `--surface-secondary` (background usage)
    - `--color-muted-foreground` -> `--muted` (subdued text usage)
    - `--color-input` -> `--border`
  - Removed legacy `:root`/`.dark` shadcn variable aliases (`--primary`, `--card`, `--popover`, etc.).
  - Replaced all remaining `var(--primary)` usages with HeroUI-native `var(--accent)`.
  - Replaced invalid `rgba(var(--primary), ...)` shadows with `color-mix(..., var(--accent), ...)`.
- Section-level contrast updates:
  - `src/components/BenefitsSection.tsx`
  - `src/components/CurriculumSection.tsx`
  - `src/components/PricingCard.tsx`
  - `src/components/PricingSection.tsx`
  - `src/routes/sign-in.tsx`
  - `src/routes/sign-up.tsx`

## Docs + Skills Updated
- Migration guide:
  - `docs/heroui-migration-guide.md` includes typed breadcrumb contract and current repository-specific breadcrumb pattern.
- Skills updated with wrapper typing guidance:
  - `/Users/sonofzeus/.agents/skills/agentic-jumpstart-frontend/SKILL.md`
  - `/Users/sonofzeus/.agents/skills/heroui-react/SKILL.md`
  - `/Users/sonofzeus/.agents/skills/shadcn-to-heroui-migration/SKILL.md` (new dedicated migration skill, validated with `quick_validate.py`).

## Validation Status
- Node: `v20.19.0` (`nvm use 20.19`).
- `pyyaml` available for skill tooling.
- `bun run build` passes (client, SSR, Nitro, and `tsc --noEmit`) after token remap.
