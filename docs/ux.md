# UX Patterns & Guidelines

This document defines current UX patterns for the HeroUI-based app.

## Core Principles

- Keep behavior predictable across pages.
- Prefer existing shared components before creating new ones.
- Show immediate user feedback for async actions.
- Keep interactions keyboard-accessible and screen-reader friendly.

## Forms

### Validation and submission

- Use `react-hook-form` + `zod`.
- Show inline field errors near fields.
- Show pending state during submission.
- Use HeroUI toast feedback (`toast` from `@heroui/react`) for success/error.

```tsx
<Button type="submit" isDisabled={isPending}>
  {isPending ? "Saving..." : "Save"}
</Button>
```

### HeroUI interaction rules

- Use `onPress` for HeroUI interaction handlers.
- Use `isDisabled` for HeroUI buttons.
- Keep `disabled` on native inputs only where needed.

## Buttons and Actions

### Primary action placement

- Put primary page actions at top-right of page headers.
- Keep destructive actions visually distinct (`variant="danger"` or danger styling).
- Use icon + label for primary actions when it improves scanability.

### Button-style navigation

- For internal routes, use `ButtonLink` wrapper.
- Do not nest `<Link>` inside `<Button>`.

```tsx
<ButtonLink to="/dashboard/community/create-post" variant="primary">
  Create Post
</ButtonLink>
```

## Modals and Confirmations

Use HeroUI `Modal` for confirmation and edit flows.

```tsx
<Modal isOpen={open} onOpenChange={setOpen}>
  <Modal.Backdrop>
    <Modal.Container>
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Heading>Delete item</Modal.Heading>
        </Modal.Header>
        <Modal.Body>
          This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline" onPress={() => setOpen(false)}>Cancel</Button>
          <Button variant="danger" onPress={onConfirm} isDisabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal.Dialog>
    </Modal.Container>
  </Modal.Backdrop>
</Modal>
```

## Tooltips and Helper Text

Use HeroUI `Tooltip` for icon-only controls and constrained actions.

- Explain why an action is unavailable.
- Prefer concise tooltip text.
- Use aria labels on icon-only controls.

```tsx
<Tooltip content="Cannot continue until all required fields are complete">
  <Button isIconOnly isDisabled aria-label="Continue">
    <ArrowRight className="h-4 w-4" />
  </Button>
</Tooltip>
```

## Breadcrumb Navigation

Use `AppBreadcrumb` for consistency and route-safe typing.

### Rules

- Internal crumbs: use `to` (and typed `params/search/hash` when needed).
- External crumbs: use `href`.
- Current page crumb: no link props.
- Do not nest links inside breadcrumb items.

```tsx
<AppBreadcrumb
  items={[
    { label: "Dashboard", to: "/dashboard", icon: Home },
    { label: "Community", to: "/dashboard/community", icon: Users },
    { label: "Post" },
  ]}
/>
```

### Active-state behavior

Parent breadcrumb links should use exact active matching so parent items stay clickable on nested routes.

## Notifications and Status Feedback

- Use `toast.success`, `toast.error`, and `toast.info` for user feedback.
- Surface actionable errors near the relevant control when possible.
- Keep async buttons and UI state synchronized with request state.

## Accessibility Baseline

- Ensure meaningful labels for all controls.
- Ensure visible focus states.
- Ensure color contrast in light and dark themes.
- Ensure keyboard navigation for menus, dialogs, and forms.

## Component Reference (Current)

Use these shared patterns/components in new work:
- `AppBreadcrumb`
- `PageTitle`
- `Panel` (`src/components/ui/panel.tsx`)
- `Link`, `ButtonLink` (`src/components/ui/link.tsx`)
- `BreadcrumbItem` (`src/components/ui/breadcrumbs.tsx`)
- HeroUI primitives from `@heroui/react`

## Implementation Notes

- This repository is HeroUI-first.
- Old shadcn examples should not be copied into new code.
- If a legacy pattern exists, migrate toward HeroUI conventions when touching that code.
