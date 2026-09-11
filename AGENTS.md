# AGENTS.md

## Project Rules

This project uses the latest installed version of Next.js. Do not rely on
older Next.js knowledge when implementing features.

<!-- BEGIN:nextjs-agent-rules -->

This is NOT the Next.js you know.

This version may contain breaking changes, new APIs, new conventions, and
different file structures. Before writing or modifying code, inspect the
relevant documentation inside:

`node_modules/next/dist/docs/`

The `next` package may be located inside a workspace package in a monorepo,
so resolve the documentation relative to the package containing Next.js.

Follow current Next.js documentation and deprecation notices.

This block is managed by Next.js and may be re-added automatically by
`next dev`. Do not remove it unnecessarily.

<!-- END:nextjs-agent-rules -->

---

## 1. Before Writing Code

Before implementing a feature:

1. Inspect the existing project structure.
2. Check existing components, utilities, hooks, and patterns before creating new ones.
3. Read the relevant installed Next.js documentation for Next.js-specific APIs.
4. Prefer existing project patterns over introducing new patterns.
5. Keep the implementation as small and focused as possible.
6. Do not introduce dependencies unless they are genuinely required.

---

## 2. Next.js Architecture

Use the current Next.js App Router architecture.

The `src/app` directory is responsible primarily for:

* Routes
* Layouts
* Loading states
* Error states
* Metadata
* Route-specific Next.js configuration

Keep substantial UI/page implementation outside `src/app`.

### View Architecture

All page-level UI should live inside:

`src/view/`

Example:

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
│
├── view/
│   ├── home/
│   │   └── home-view.tsx
│   ├── dashboard/
│   │   └── dashboard-view.tsx
│   └── settings/
│       └── settings-view.tsx
│
├── components/
├── hooks/
├── lib/
├── services/
├── types/
└── styles/
```

A route should remain thin.

Example:

```tsx
import { DashboardView } from "@/view/dashboard/dashboard-view";

export default function DashboardPage() {
  return <DashboardView />;
}
```

The route should not contain large UI implementations.

---

## 3. View Rules

`src/view` contains page-level compositions.

A view may compose:

* Feature components
* Shared components
* Hooks
* Services
* Forms
* Tables
* Sections

Do not put reusable global components inside a view unless they are truly
specific to that view.

Prefer:

```text
src/view/dashboard/
├── dashboard-view.tsx
├── dashboard-header.tsx
└── dashboard-stats.tsx
```

For reusable UI:

```text
src/components/
├── ui/
├── layout/
└── shared/
```

---

## 4. Component Rules

Use shadcn/ui components whenever an appropriate component exists.

Prefer composition over creating large components.

Before creating a new component:

1. Check `src/components`.
2. Check shadcn/ui components.
3. Check the current feature/view.
4. Reuse existing functionality where possible.

Do not duplicate components with slightly different names.

---

## 5. Styling Rules

### No Static Colors

Never hardcode colors in components.

Do NOT use:

```tsx
<div className="bg-blue-500 text-white" />
```

Do NOT use:

```tsx
style={{ color: "#ffffff" }}
```

Do NOT use:

```css
color: #000000;
```

Use the project's CSS variables and semantic design tokens instead.

Preferred:

```tsx
<div className="bg-background text-foreground" />
```

Examples:

```text
bg-background
bg-card
bg-muted
bg-primary
bg-secondary
bg-accent
bg-destructive

text-foreground
text-muted-foreground
text-primary
text-primary-foreground

border-border
ring-ring
```

Use shadcn/ui semantic tokens whenever possible.

### CSS Variables

All project colors must ultimately be controlled through CSS variables.

Do not create random color values inside individual components.

If a new design token is genuinely required:

1. Add it to the global theme variables.
2. Support the project's theme strategy.
3. Use the semantic token from components.

Keep styling centralized and themeable.

---

## 6. Dark Mode

All UI must support the project's dark/light theme system.

Do not introduce styling that works only in light mode.

Avoid assumptions such as:

```tsx
text-black
bg-white
border-gray-200
```

Prefer semantic tokens:

```tsx
text-foreground
bg-background
border-border
```

---

## 7. File Size Rule

### Maximum 100 Lines

Every source code file should normally remain at or below **100 lines**.

This applies to:

* `.tsx`
* `.ts`
* `.css`
* `.js`
* `.jsx`

If a file approaches 100 lines, split it into meaningful modules.

Do not artificially reduce line count by:

* Compressing code
* Removing readability
* Creating meaningless one-line abstractions
* Using confusing code

Extract logical responsibilities instead.

For example:

```text
dashboard-view.tsx
dashboard-header.tsx
dashboard-stats.tsx
dashboard-table.tsx
```

is preferred over one 300-line component.

---

## 8. Separation of Responsibilities

Keep responsibilities separated.

### `src/app`

Routing and Next.js route concerns.

### `src/view`

Page-level composition.

### `src/components`

Reusable UI components.

### `src/components/ui`

shadcn/ui primitives.

### `src/hooks`

Reusable React hooks.

### `src/lib`

Framework-independent utilities and helpers.

### `src/services`

API, server communication, and external service logic.

### `src/types`

Shared TypeScript types.

Do not place unrelated responsibilities into a single file.

---

## 9. TypeScript

Use TypeScript strictly.

Prefer explicit types for:

* API responses
* Component props
* Service boundaries
* Complex objects

Avoid `any`.

Do not use type assertions to hide real type problems.

Prefer narrowing and proper type definitions.

---

## 10. Data Fetching

Follow the current Next.js recommended data-fetching patterns.

Do not automatically make every component a Client Component.

Prefer Server Components when possible.

Use `"use client"` only when the component actually requires:

* React state
* Effects
* Event handlers
* Browser APIs
* Client-only libraries

Keep Client Components as small as possible.

---

## 11. Server and Client Boundaries

Do not move server-only code into Client Components.

Keep secrets, database access, and server-only logic on the server.

Never expose:

* API secrets
* Database credentials
* Private environment variables
* Server-only tokens

to browser code.

---

## 12. Naming

Use clear and predictable names.

Examples:

```text
dashboard-view.tsx
user-card.tsx
create-user-form.tsx
use-user.ts
user.service.ts
user.types.ts
```

Prefer descriptive names over generic names such as:

```text
data.ts
utils.ts
helper.ts
thing.ts
component.tsx
```

unless the file is genuinely generic.

---

## 13. Imports

Use the project's configured path aliases.

Prefer:

```tsx
import { Button } from "@/components/ui/button";
```

instead of deeply nested relative imports:

```tsx
import { Button } from "../../../components/ui/button";
```

Keep imports clean and remove unused imports.

---

## 14. Forms

Use the project's existing form conventions.

For complex forms, separate:

* Form UI
* Validation schema
* Submission logic
* API/service logic

Do not put large validation and API implementations directly inside the
page component.

---

## 15. Error Handling

Handle expected errors explicitly.

Do not silently swallow errors.

Avoid:

```ts
try {
  await request();
} catch {}
```

Provide useful error handling appropriate to the application.

Use Next.js error/loading conventions where applicable.

---

## 16. Accessibility

All UI should be accessible by default.

Use:

* Semantic HTML
* Proper labels
* Keyboard-accessible controls
* Accessible buttons
* Meaningful `alt` text
* Appropriate ARIA attributes when required

Do not use clickable `div` elements when a button or link is appropriate.

---

## 17. Performance

Prefer simple solutions.

Avoid unnecessary:

* Client Components
* `useEffect`
* `useMemo`
* `useCallback`
* Global state
* API requests
* Dependencies

Do not optimize prematurely.

Use optimization when there is a real reason or measurable benefit.

---

## 18. Dependencies

Before installing a package:

1. Check whether the project already provides the functionality.
2. Check whether shadcn/ui or an existing utility can solve it.
3. Check whether the feature can be implemented with native Next.js/React APIs.
4. Add a dependency only when it provides meaningful value.

Do not install packages for trivial functionality.

---

## 19. UI Consistency

Follow the existing design system.

Use:

* shadcn/ui
* Existing spacing conventions
* Existing typography
* Existing radius tokens
* Existing CSS variables
* Existing component patterns

Do not introduce unrelated visual styles.

Do not create a new design system for a single page.

---

## 20. Code Quality

Code should be:

* Simple
* Readable
* Typed
* Modular
* Maintainable
* Testable where appropriate
* Consistent with the existing project

Prefer boring, understandable code over clever code.

Avoid unnecessary abstraction.

---

## 21. Before Finishing a Task

Before considering a task complete:

1. Verify the implementation follows current Next.js documentation.
2. Check that routes remain thin.
3. Check that page UI belongs in `src/view`.
4. Check that reusable UI is extracted appropriately.
5. Check that no static colors were introduced.
6. Check that CSS variables and shadcn semantic tokens are used.
7. Check that files remain at or below 100 lines where practical.
8. Remove unused imports and code.
9. Run the project's relevant lint/typecheck/build commands.
10. Fix errors rather than ignoring them.

---

## Golden Rules

1. **Read the installed Next.js docs before using unfamiliar Next.js APIs.**
2. **Keep `src/app` thin.**
3. **Put page-level UI in `src/view`.**
4. **Use shadcn/ui and semantic CSS variables.**
5. **Never hardcode static colors in UI code.**
6. **Keep source files at 100 lines or less whenever practical.**
7. **Prefer small, focused components.**
8. **Reuse existing project patterns before creating new ones.**
9. **Avoid unnecessary dependencies and abstractions.**
10. **Write production-quality TypeScript that is easy to maintain.**
