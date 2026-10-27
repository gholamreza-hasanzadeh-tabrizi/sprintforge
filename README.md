# SprintForge — Project planning workspace

A frontend-only project-planning workspace built with React and TypeScript. It borrows familiar patterns from modern issue trackers, with original branding and UI. There is no backend in this repository; fictional demo data and all edits are stored in browser `localStorage`.

## Features

- Board, list, backlog, and sprint-insights views
- Dedicated My Work, project Activity, and due-date Calendar sections
- Drag issues between board columns; view a Jira-inspired issue detail panel
- Edit issue metadata, labels, due date, story points, and description
- Activity timeline and persistent comments
- Watch/unwatch issues and add, complete, or delete subtasks
- Search, assignee and priority filters, upcoming due dates, and browser-local persistence
- Light/dark themes, responsive layout, keyboard focus states, and accessible Radix Dialog

Navigation controls that are not in the feature list may still be demo placeholders. There is no authentication, remote collaboration, file upload, or server API.

## Architecture

Atomic Design is used for composition. Each reusable component—and each page—is in its own folder. Implementations, tests, and barrel exports stay together; shared contracts are in a separate `src/types` tree.

```text
src/
  components/
    atoms/button/{button.tsx, index.ts, button.test.tsx}
    atoms/form-field/{form-field.tsx, index.ts, form-field.test.tsx}
    molecules/issue-card/{issue-card.tsx, index.ts}
    molecules/subtask-list/{subtask-list.tsx, index.ts, subtask-list.test.tsx}
    organisms/issue-dialog/{issue-dialog.tsx, index.ts}
    organisms/comment-composer/{comment-composer.tsx, index.ts, comment-composer.test.tsx}
    templates/workspace-layout/{workspace-layout.tsx, index.ts}
  pages/project-page/{project-page.tsx, index.ts, project-page.test.tsx}
  types/
    domain/{issue.ts, view.ts}
    components/{atoms, molecules, organisms, templates, pages}/...
  lib/{id.ts, utils.ts}
  data.ts
  index.css
```

All imports inside `src` use `@/`, configured in both Vite and TypeScript. Tailwind CSS v4 handles styling and theme tokens. The component primitives follow shadcn-style patterns with class-variance-authority, tailwind-merge, Radix Slot, and Radix Dialog.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm test
npm run typecheck
npm run build
npm audit
```

The current suite covers component variants and states, form controls, comment composition/activity, subtask interactions, watch controls, and an issue workflow that checks local persistence.

## Performance notes

- Strict TypeScript checks; domain types and component prop contracts are separate from implementation
- `React.memo`, memoized issue grouping/filtering, and stable callbacks where repeated rendering is expected
- Reports are lazy-loaded as a separate bundle
- Tailwind production output includes only used utilities

## Backend boundary

Watchers, comments, subtasks, activity, and issue fields are local to the current browser. They do not sync to another user or device. A later API should replace this persistence layer before the application is treated as collaborative or production-ready. Avoid putting real personal data in the demo.

## License

MIT — see `LICENSE`.
