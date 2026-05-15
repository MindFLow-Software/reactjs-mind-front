# CLAUDE.md — MindFLush Frontend

## Communication Style

Always use **caveman lite** mode: no filler, no hedging, no pleasantries. Keep articles and full sentences. Professional and direct.

- Drop: "Sure!", "Certainly!", "I'd be happy to", "basically", "just", "actually"
- Keep: full sentences, articles, technical precision
- Pattern: state the fact, then the action

Off only when user says "normal mode" or "stop caveman".

---

## Planning & Feature Work

Use the **tlc-spec-driven** skill for all non-trivial tasks:

- New features → `/tlc-spec-driven specify`
- Existing codebase exploration → `/tlc-spec-driven map codebase`
- Implementation with verification → `/tlc-spec-driven implement`
- Quick fixes → `/tlc-spec-driven quick fix`

Always create atomic commits per task. Never batch unrelated changes into one commit.

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Routing | React Router DOM v7 |
| State/Server | TanStack Query v5 |
| Forms | React Hook Form + Zod v4 |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (new-york style, neutral base) |
| Icons | Phosphor Icons (`@phosphor-icons/react`) + Lucide |
| Animation | Framer Motion |
| Toasts | Sonner |
| Charts | Recharts |
| Video | LiveKit |

---

## UI/UX — shadcn/ui Rules

This project uses shadcn/ui with the **new-york** style and **neutral** base color. All component usage must follow these conventions:

### Component Usage
- Always import from `@/components/ui/<component>`
- Never install raw Radix primitives directly — always use the shadcn wrapper
- Use `cn()` from `@/lib/utils` for conditional class merging
- Prefer composition over custom styling

### Styling
- Use CSS variables (`hsl(var(--primary))`) — never hardcode colors
- Tailwind v4 syntax — no `tailwind.config.js`, config is in CSS
- Theme toggle already implemented via `next-themes` + `ThemeProvider`
- `tw-animate-css` available for entrance animations

### Icons
- Prefer **Lucide** for new UI elements — consistent weight and style
- Lucide is available for shadcn internal components — do not replace those

### Forms
- Always use `react-hook-form` + `zod` + shadcn `<Form>` components
- Never use uncontrolled inputs for validated fields
- Use `<Field>` from `@/components/ui/field` for consistent form layout

### Layout Patterns
- Sidebar: use `@/components/ui/sidebar` (already configured)
- Cards: use shadcn `<Card>` — never raw `div` with manual border/shadow
- Tables: use shadcn `<Table>` — never HTML `<table>` directly
- Dialogs/Sheets: use shadcn `<AlertDialog>` / `<Sheet>` — not custom modals

---

## File & Folder Conventions

```
src/
  api/           # One file per API call, named by action (get-patients.ts)
  components/
    ui/          # shadcn primitives — do not edit manually, use CLI
    <name>.tsx   # Shared app-level components
  hooks/         # Custom hooks (use-*.ts)
  lib/           # Utilities and config (utils.ts, react-query.ts)
  pages/
    app/         # Authenticated routes
    auth/        # Public/auth routes
  types/         # Shared TypeScript types
  utils/         # Pure formatting functions (formatCPF.ts, formatAge.ts)
```

### Naming
- Components: PascalCase (`PatientsList.tsx`)
- Hooks: camelCase with `use` prefix (`use-patient-achievements.ts`)
- API files: kebab-case verb-noun (`get-patients.ts`, `create-patient.ts`)
- Utils: camelCase verb (`formatCPF`, `formatAge`)

---

## API Layer

- All API calls live in `src/api/`
- Use `axios` instance — never raw `fetch`
- All mutations use `useApiMutation` from `@/hooks/use-api-mutation`
- TanStack Query for all server state — no local state for remote data
- Query keys: array format `['patients', { page, search }]`

---

## Commit Convention

Conventional Commits format. Subject ≤ 50 chars. Body only when "why" is non-obvious.

```
feat(patients): add age filter to patient list
fix(auth): align token expiry check to use <=
refactor(api): extract slot fetching to dedicated hook
```

Types: `feat`, `fix`, `refactor`, `perf`, `docs`, `test`, `chore`, `build`, `ci`

---

## What NOT to Do

- No comments explaining WHAT the code does — names do that
- No error handling for impossible cases
- No feature flags or backwards-compat shims
- No raw HTML elements when shadcn component exists
- No hardcoded colors or spacing — use design tokens
- No `any` types — always type explicitly
- No direct DOM manipulation — use React state/refs
