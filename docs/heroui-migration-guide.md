# HeroUI Migration Guide

This guide documents how to migrate a TanStack Start + Tailwind CSS app from shadcn/ui (and Radix UI wrappers) to HeroUI v3. It is intended for repeatable use across future projects.

## Scope

- Replace shadcn/ui components with HeroUI v3 equivalents
- Remove shadcn/ui component files and configuration
- Update theme tokens to HeroUI defaults
- Update documentation and skills to reference HeroUI

## Current Project Decision

- **Adopt HeroUI default styling and tokens** for this project, even if it changes the look and feel.

## Open Decision (For Future Migrations)

When migrating other projects, decide whether to keep existing design tokens or adopt HeroUI defaults:

- [ ] **Keep existing tokens** (map HeroUI variables to legacy tokens; preserve existing look)
- [ ] **Adopt HeroUI defaults** (use HeroUI tokens directly; accept a new look)

Record the decision in the migration log for each project.

## Migration Checklist

1. **Install HeroUI v3**
   - `@heroui/react@beta`
   - `@heroui/styles@beta`
   - `tailwind-variants`

2. **Global styles**
   - Ensure Tailwind v4 is enabled
   - Import HeroUI styles after Tailwind:
     - `@import "@heroui/styles";`

3. **Theme tokens**
   - Prefer HeroUI default tokens
   - Add compatibility aliases only when required to reduce refactors
   - Map by semantic intent, not by token name similarity

4. **Component replacement**
   - Replace shadcn/ui imports with HeroUI components
   - Convert dialog/sheet/dropdown/tooltip to HeroUI equivalents
   - Replace `onClick` → `onPress` for HeroUI controls
   - Replace `disabled` → `isDisabled` for HeroUI Buttons (keep `disabled` for Input/TextArea)

5. **Remove shadcn/ui**
   - Delete `components.json`
   - Delete `src/components/ui/*` shadcn component files
   - Keep only project-specific UI helpers (e.g., `panel`, `fade-in`, `file-upload`, `form`, `toast`)

6. **Docs + skills**
   - Update project docs to mention HeroUI
   - Update agent skills that reference shadcn/ui

## Component Mapping (Common)

- `Button` → `@heroui/react` `Button`
- `Badge` → `Chip`
- `Card` → `Card` with `Card.Header`, `Card.Content`, `Card.Footer`
- `Dialog`/`Sheet` → `Modal`
- `DropdownMenu` → `Dropdown`
- `Select` → `Select` + `ListBox`
- `Textarea` → `TextArea`
- `Switch` → `Switch` with `Switch.Control` and `Switch.Thumb`
- `Avatar` → `Avatar` with `Avatar.Image` and `Avatar.Fallback`
- `Accordion` → `Accordion` with `Accordion.Item`, `Accordion.Trigger`, `Accordion.Panel`

## HeroUI Usage Notes

- **No Provider required** in HeroUI v3
- **Use compound components** (e.g., `Card.Header`, `Modal.Header`)
- **Use `onPress`** on HeroUI interactive components
- **Prefer semantic variants**: `primary`, `secondary`, `tertiary`, `outline`, `ghost`, `danger`

## Token Equivalence (shadcn -> HeroUI)

Use this mapping when old shadcn utility classes remain during migration:

- `muted` (background utility intent, e.g. `bg-muted`) -> `surface-secondary`
- `muted-foreground` (subdued text, e.g. `text-muted-foreground`) -> `muted`
- `card` -> `surface`
- `card-foreground` -> `surface-foreground`
- `popover` -> `overlay`
- `popover-foreground` -> `overlay-foreground`
- `destructive` -> `danger`
- `ring` -> `focus`
- `input` (border intent) -> `border`
- `primary` -> `accent`
- `primary-foreground` -> `accent-foreground`

Important:

- Do not map shadcn `muted` to HeroUI `muted` directly for background utilities; HeroUI `muted` is a subdued foreground color token.
- For custom CSS and arbitrary Tailwind values, use HeroUI vars directly (`var(--accent)`, `var(--surface-secondary)`) rather than legacy vars (`var(--primary)`, `var(--card)`).

## TanStack Start Link Pattern (Required)

When using HeroUI inside TanStack Start, keep routing behavior centralized in custom wrappers so links remain typed (`to`, `params`, `search`) and do not regress to full page reloads.

1. Create a router-aware HeroUI link wrapper with TanStack `createLink`.
2. Create a router-aware button-link wrapper using HeroUI `buttonVariants`.
3. For HeroUI components that render links internally (for example `Breadcrumbs.Item`), create a dedicated TanStack `createLink` wrapper for that component.
4. Use these wrappers instead of raw `href` whenever the destination is an internal route.

### Reference Implementation

File: `src/components/ui/link.tsx`

```tsx
import { createLink } from "@tanstack/react-router";

export const Link = createLink(/* HeroUI Link wrapper */);
export const ButtonLink = createLink(/* anchor using buttonVariants */);
```

File: `src/components/ui/breadcrumbs.tsx`

```tsx
import { Breadcrumbs } from "@heroui/react";
import { createLink } from "@tanstack/react-router";

export const BreadcrumbItem = createLink(Breadcrumbs.Item);
```

### Usage Rules

- Internal links: `Link` or `ButtonLink`.
- Button-like navigation: `ButtonLink` (not nested `<Button><Link /></Button>`).
- Breadcrumbs: wrapper item (`BreadcrumbItem`) for internal crumbs.
- External links: keep native `href` (or HeroUI Link directly), plus `target`/`rel` as needed.

### Typed Breadcrumb Contract

`AppBreadcrumb` should type internal breadcrumb items from TanStack link props so `to`, `params`, `search`, and `hash` stay route-safe and consistent with wrapper components.

File: `src/components/AppBreadcrumb.tsx`

```tsx
import type { LinkComponentProps } from "@tanstack/react-router";
import { Breadcrumbs } from "@heroui/react";

type RouterBreadcrumbLinkOptions = Omit<
  LinkComponentProps<typeof BreadcrumbItem>,
  "children" | "className"
>;

type InternalBreadcrumbEntry = {
  label: string;
  to: RouterBreadcrumbLinkOptions["to"];
} & Omit<RouterBreadcrumbLinkOptions, "to" | "href">;
```

Rules:

- Prefer internal breadcrumb entries with `to` (and optional `params`/`search`/`hash`) for app routes.
- Use `href` entries only for true external links.
- Keep internal link typing anchored to wrapper-compatible types (`LinkComponentProps` + `createLink` wrappers).
- For parent crumbs, default `activeOptions` to exact matching to avoid false current-state on prefix routes (e.g. `/dashboard` while on `/dashboard/community`).

### Project-Specific Breadcrumb Note

Current project implementation (`src/components/AppBreadcrumb.tsx`) intentionally renders a nested TanStack `Link` inside `BreadcrumbItem` for internal crumbs to guarantee anchor output and navigation behavior in this codebase.

Pattern currently used:

- Keep typed internal entries based on `LinkComponentProps<typeof BreadcrumbItem>`.
- Forward internal navigation props (`to`, `params`, `search`, `hash`, `state`, etc.) to both:
  - outer `BreadcrumbItem`
  - nested `Link`
- Default `activeOptions` to exact route matching when not provided.
- Apply current-page visual treatment through wrapper classes (for example, group/current-state classes on breadcrumb content).

Migration guidance:

- Treat this nested breadcrumb-link pattern as a repository-specific convention unless the shared wrapper implementation is refactored and re-verified.

## QA Checklist

- Verify all shadcn/ui imports are removed
- Verify all deleted UI files are unused
- Confirm HeroUI styles are imported and Tailwind v4 is active
- Smoke test major flows: auth, posts, comments, uploads, profile, settings

## Migration Log (Template)

- Project:
- Date:
- Token Strategy: (Keep legacy tokens / Adopt HeroUI defaults)
- eotes:
