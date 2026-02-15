# Theme Documentation

This document defines theming and styling conventions for this project after the HeroUI v3 migration.

## Overview

The app uses:
- Tailwind CSS v4
- HeroUI v3 (`@heroui/react`, `@heroui/styles`)
- CSS variables in `src/styles/app.css`
- SSR-safe theme resolution through `src/components/theme-provider.tsx` and `src/routes/__root.tsx`

Core rule:
- New UI work should default to HeroUI components and HeroUI semantic tokens.

## Theme Architecture

### Style entrypoint

`src/styles/app.css` includes:

```css
@import "tailwindcss" source("../");
@import "@heroui/styles";
```

Tailwind utilities are mapped to semantic tokens using `@theme inline`.

### Theme state and persistence

Theme preference is managed by:
- `src/components/theme-provider.tsx` (theme context + cookie updates)
- `src/routes/__root.tsx` (pre-hydration script to resolve theme and prevent flash)

Document root attributes set at runtime:
- `data-theme` (resolved light/dark)
- `data-theme-preference` (user preference: light/dark/system)
- `data-resolved-theme` (effective theme)

## HeroUI Token System

Prefer HeroUI semantic tokens directly:
- `--background`, `--foreground`
- `--surface`, `--surface-secondary`, `--surface-tertiary`
- `--overlay`
- `--muted`
- `--accent`, `--accent-foreground`
- `--default`, `--default-foreground`
- `--danger`, `--warning`, `--success`
- `--border`, `--focus`, `--field-background`, `--field-border`

### Compatibility mappings still present

For migration stability, shadcn-style Tailwind color utilities still resolve through aliases in `src/styles/app.css`.
Important mappings:
- `muted` background intent -> `surface-secondary`
- `muted-foreground` text intent -> `muted`
- `input` intent -> `border`
- `primary` intent -> `accent`

Use these aliases when touching legacy UI, but prefer HeroUI-native semantics in new code.

## Component Styling Rules

### HeroUI first

Use HeroUI primitives by default:
- `Button`, `Input`, `TextArea`, `Select`, `Switch`, `Modal`, `Dropdown`, `Card`, `Chip`, `Tooltip`, `Breadcrumbs`

### Events and disabled state

- Use `onPress` for HeroUI interactive components.
- Use `isDisabled` for HeroUI `Button`.
- Keep native `disabled` where required for native inputs.

### Compound components

Follow HeroUI composition patterns:

```tsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
    <Card.Description>Description</Card.Description>
  </Card.Header>
  <Card.Content>...</Card.Content>
  <Card.Footer>...</Card.Footer>
</Card>
```

## TanStack + HeroUI Link Rules

For internal navigation in TanStack Start:
- Use `src/components/ui/link.tsx` wrappers: `Link`, `ButtonLink`
- Use `src/components/ui/breadcrumbs.tsx` wrapper: `BreadcrumbItem`

Do not:
- Nest `Link` inside `Button`
- Nest `Link` inside `BreadcrumbItem`

Breadcrumb notes:
- Internal breadcrumb entries should use `to`, not `href`
- Parent breadcrumbs should use exact active matching to avoid false "current" state on nested routes

## Practical Tailwind Usage

### Preferred semantic utility classes

- Backgrounds: `bg-background`, `bg-card`, `bg-muted`, `bg-popover`
- Text: `text-foreground`, `text-muted-foreground`, `text-primary`
- Borders/focus: `border-border`, `ring-ring`

### Custom CSS guidance

When writing custom CSS values (for gradients, glows, shadows), use HeroUI vars directly:

```css
box-shadow: 0 0 20px color-mix(in oklab, var(--accent) 12%, transparent);
```

Avoid legacy vars like `var(--primary)` in new custom CSS.

## Theme QA Checklist

- Verify both light and dark mode on edited screens
- Verify contrast for text on `surface` and `surface-secondary`
- Verify hover/focus states for buttons and links
- Verify form control states (default, focus, disabled, error)
- Verify SSR hydration has no theme flash

## File Reference

- `src/styles/app.css`
- `src/components/theme-provider.tsx`
- `src/components/mode-toggle.tsx`
- `src/components/ui/link.tsx`
- `src/components/ui/breadcrumbs.tsx`
- `src/components/AppBreadcrumb.tsx`
- `src/routes/__root.tsx`
