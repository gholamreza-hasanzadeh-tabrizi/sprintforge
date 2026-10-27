# Component system

SprintForge uses Atomic Design for composition and a small set of accessible primitives inspired by shadcn/ui. It is a typed React component system, not a runtime UI framework.

## Folder conventions

Every reusable component has its own directory in `src/components/<atomic-layer>/<component-name>/`:

```text
button/
  button.tsx          # implementation
  index.ts            # public export
  button.test.tsx     # component tests (when behavior is testable)
```

Page-level components follow the same rule under `src/pages/`. Shared business/domain types live in `src/types/domain/`; component prop contracts live in `src/types/components/<layer>/`. Tests sit beside the component they exercise. Small private render helpers may remain in their parent component module; reusable or stateful UI should get its own directory.

## Import convention

Use the `@/` alias for application imports. It resolves to `src/` in both Vite and TypeScript.

```tsx
import { Button, IconButton } from '@/components/atoms/button'
import { Input } from '@/components/atoms/form-field'
import type { ButtonProps } from '@/types/components/atoms/button'
import { cn } from '@/lib/utils'
```

Avoid deep relative imports (`../../...`) inside `src`. A component's `index.ts` is its public import boundary.

## Button API

| Concern | Supported values |
|---|---|
| Variants | `default`, `secondary`, `outline`, `ghost`, `destructive`, `success`, `warning`, `soft`, `link` |
| Sizes | `xs`, `sm`, `default`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg` |
| Icons | `icon`, `iconPosition`, `startIcon`, `endIcon`; or `IconButton` with a required accessible label |
| States | Native `disabled`, `loading`, `loadingLabel`, focus-visible ring, full-width |
| Composition | `asChild` through Radix Slot; native button attributes and handlers are retained |

```tsx
<Button variant="outline" startIcon={<Search />} endIcon={<ChevronRight />}>
  Search issues
</Button>
<Button icon={<Plus />} iconPosition="end" loading={saving} loadingLabel="Saving">
  Create issue
</Button>
<IconButton label="Close dialog" variant="ghost" size="icon-sm"><X /></IconButton>
```

## Form controls

- `Input`: native HTML input types including file; `sm`/`md`/`lg`; start/end adornments; error message, accessibility and ref support.
- `Select`: native select behavior, optional chevron, error message, ref and native attributes.
- `Textarea`: controlled or uncontrolled; resizable; helper/error text and native attributes.
- `FieldLabel`, `FormDescription`, and `FieldErrorText`: shared label and feedback atoms.

## Other atoms

- `Badge`: default, secondary, outline, muted, destructive, success, warning, and info variants.
- `StatusBadge`: maps issue status to the shared status palette.
- `Avatar`: image source with initials fallback, sizes, and optional online/offline indicator.
- `IssueTypeMark` and `PriorityMark`: consistent semantic icons.
- `Skeleton`: theme-aware loading placeholder.

## Issue workflow

The detail dialog composes issue fields, `SubtaskList`, activity/comment feeds, and the comment composer. It supports adding/deleting/completing subtasks, watching/unwatching issues, comments, and field edits. State is local-only for now. The browser test for `ProjectPage` covers the watcher/subtask persistence path; component tests cover UI states and comment workflows.
