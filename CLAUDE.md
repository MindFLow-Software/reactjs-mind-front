# CLAUDE.md — MindFLush Frontend

## Mandatory Frontend Refactor Rules

These rules are non-negotiable for every frontend change. If an existing rule in this file or in `.specs/codebase/*.md` conflicts with this section, this section wins.

Canonical documents:

- Mandatory conventions: `.specs/codebase/CONVENTIONS.md`
- Target structure: `.specs/codebase/STRUCTURE.md`
- Architecture rules: `.specs/codebase/ARCHITECTURE.md`
- Backend/API integration rules: `.specs/codebase/INTEGRATIONS.md`
- Refactor audit map: `.specs/codebase/FRONTEND_REFACTOR_AUDIT.md`
- Claude execution prompt: `.specs/codebase/CLAUDE_FRONTEND_REFACTOR_PROMPT.md`
- Backend contract reference: `docs/frontend-reference/*.md`

Source priority for contracts:

1. Current backend implementation and `docs/frontend-reference/*.md`.
2. `.specs/features/frontend-contract/*.md` only when it does not conflict with current backend references.
3. Existing frontend code never overrides backend contracts.

Required standards:

- API calls live only in `src/api/{domain}/`, separated by domain and action.
- Every API function imports and uses `api` from `@/lib/axios`. No raw `fetch`, no raw `axios`, no `api.*` calls inside pages/components/hooks.
- Every API request/response is fully typed and aligned with backend entities. Reuse domain/entity types whenever possible.
- Frontend entity/domain types must match backend entities exactly, except for explicitly documented UI-only view models.
- Interfaces use `I` + PascalCase, for example `IUser`, `IPatient`, `IAppointmentResponse`.
- GET requests are consumed through `useQuery`.
- POST, PUT, PATCH, and DELETE requests are consumed through `useMutation`.
- Every mutation success and error path displays backend-provided guidance/message through Sonner.
- Zod schemas live in `src/validators/{domain}/{layer}/{action}-schema.ts`; each file exports exactly one schema.
- Forms always use React Hook Form + Zod and are fully typed. No manual `FormData` or untyped form state for validated fields.
- Prefer shadcn/ui primitives for tables, forms, dialogs, sheets, cards, empty states, alerts, skeletons, badges, and layout primitives.
- Use Zustand for global client state. Do not place stores in `src/utils`.
- Reusable API flows, filter logic, and cross-page logic become hooks. Shared hooks live in `src/hooks`; feature-only hooks live beside the page/feature.
- Components receiving more than 3 props must be rewritten as composition or receive a grouped typed object when composition is not appropriate.
- Never reuse a creation modal/form/schema/hook to perform editing. Create and edit flows must have separate modal components, submit logic, schemas, validators, and API hooks.
- Components/pages must have their respective CSS file using Tailwind `@reference`, `@layer`, and `@apply`; no pure CSS blocks for feature styling.
- Consolidate duplicated CSS/classes into a single CSS source when two or more places repeat the same styling.
- Page directories contain only the page file, local components, local hooks, local styles, and feature-local constants/helpers.
- Each `.tsx` file should expose one main function when possible. Compound composition is the allowed exception.
- Shared constants live in `src/constants`.
- Shared/reusable components live in `src/components`.
- Use existing utilities in `src/utils` (`Isness`, `Sanitizer`, `Normalizer`, `Time`, formatters, mappers) as the single source of truth for validation, formatting, normalization, and guards.
- No `any`, no duplicated entity definitions, no inline backend DTOs inside pages/components, no speculative abstractions.

`src/pages/app/profiles` can be used as an inspiration for cleaner composition, but it is not exempt from these rules and still needs fixes called out in the refactor audit.

---

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
| Icons | Lucide (primary) · Phosphor Icons (legacy — avoid new uses) |
| Animation | Framer Motion |
| Toasts | Sonner |
| Charts | Recharts |
| Video | LiveKit |

---

## UI/UX — Design System

**Canonical reference:** `.specs/project/design-system.md`

Read it before building any new screen, component, or state. It defines tokens, typography scale, gender colors, spacing grid, component patterns, dark mode rules, and accessibility requirements. Do not invent new colors or patterns — map everything to what is already documented there.

Key rules from the design system:

- **Dark mode:** replace all `bg-white`/`bg-slate-*`/`text-slate-*`/`border-slate-*` with semantic tokens (`bg-card`, `bg-muted/50`, `text-foreground`, `text-foreground/80`, `text-muted-foreground`, `border-border`). Add `dark:` hover variants for blue (`dark:hover:bg-blue-950/30`) and red (`dark:hover:bg-red-950/30`) fills.
- **Gender colors:** Feminino = pink, Masculino = blue, Outro = purple. Always. No exceptions, no zinc/slate fallback.
- **Input focus:** `border-blue-600 ring-[3px] ring-blue-600/[.18]`
- **Input height:** `h-[38px]`
- **Form fields:** patient email/phone/CPF inputs use `autoComplete="off"` — they are third-party data, not the user's own.

### shadcn/ui Rules

This project uses shadcn/ui with the **new-york** style and **neutral** base color. All component usage must follow these conventions:

### Component Usage
- Always import from `@/components/ui/<component>`
- Never install raw Radix primitives directly — always use the shadcn wrapper
- Use `cn()` from `@/lib/utils` for conditional class merging
- Prefer composition over custom styling
- **Never duplicate JSX across files.** Any element used in more than one place must be extracted into its own component before use. No exceptions — inline duplication is always wrong.

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
- Simple single-endpoint mutations: use `useApiMutation` from `@/hooks/use-api-mutation`.
- Complex flows with multiple sequential mutations or non-critical side effects: use `useMutation` from TanStack Query directly — see `use-patient-submit.ts` as the canonical example.
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

## Coding Patterns

**Canonical references:**
- Page composition → `src/pages/app/patients/patients-list/patients-list.tsx`
- Multi-step form → `src/pages/app/patients/patients-list/register-patients/`

Claude must follow these patterns exactly. No deviations.

### Component Composition

- Orchestrator components compose hooks, minimal local state, and top-level layout only. No business logic in the root.
- Extract local subcomponents when a UI region has its own responsibility: headers, toolbars, footers, action bars, content blocks. Inline JSX that grows complex or repeats must become a named component.
- Use namespace composition (`Parent.Child`) when it improves readability of regions within a compound component:
  - `PatientsPageShell.Header` / `PatientsPageShell.Content`
  - `PatientsDataBlock.Header` / `PatientsDataBlock.Toolbar` / `PatientsDataBlock.Content` / `PatientsDataBlock.Footer`
  - `MetricCard.Icon` / `MetricCard.Value` / `MetricCard.Label` / `MetricCard.Trend`
- Group related props into an object when it reduces noise at the call site: `sort={{ by, order, onSort }}` instead of three separate props.
- Keep handlers named and small. No anonymous arrow functions with logic inlined in JSX beyond single-expression calls.
- Actions not yet implemented must be `disabled`. They must not look interactive or pretend to work.

### Conditional Rendering

- Two states: ternary is fine.
- Three or more states: use a named `renderXyz` function with a `switch` statement.
- Never nest ternaries.

### Hook Architecture

- Each cross-cutting concern gets its own hook: data fetching, form steps, submission, filters, file selection, address lookup.
- Feature-local hooks live in a `hooks/` subfolder inside the feature directory, not in global `src/hooks/`, unless they are reused across multiple features.
- Hook options and return shapes have explicit interfaces when not trivial (`UsePatientFormStepsOptions`, `UsePatientFormStepsReturn`).
- Hooks receive RHF primitives (`trigger`, `setValue`) as options instead of owning the form instance — hooks augment the form, they do not create it.
- All handlers returned from hooks are wrapped with `useCallback`.
- The root orchestrator composes all hooks and passes results down as props. Step/child components never call feature-level hooks directly.

### CSS

- Feature-scoped CSS is acceptable. Co-locate `.css` files with their `.tsx` counterparts (same directory, same base name).
- Every CSS class in a feature file uses a short feature-specific prefix: `rp-` for register-patients, `pl-` for patients-list. This prevents global collisions.
- Do not scatter generic utility classes as global CSS rules — use Tailwind tokens directly in JSX.
- `cn()` from `@/lib/utils` for all conditional class merging in JSX.

### Masks & Formatters

- Input masking and normalization run on `onChange`, not in `useEffect`.
- Always use the existing utilities: `formatCPF`, `formatPhone`, `formatCEP`, `formatDateInput`, `Normalizer`, or `date-fns`. Never write raw regex inline for a format that an existing utility already handles.

### Constants, Helpers, Types

- Feature-level option arrays, step config, numeric limits, and branded type aliases live in `constants.ts` (or `constants.tsx` if JSX is needed). Use `as const` for literal type inference.
- Pure transformation functions live in `helpers.ts`.
- Local constants used only in one file stay in that file — do not move them to `constants.ts` just for organization.
- Entity types have a single source of truth in `src/types/`. Never redefine an entity type inside a feature — import it.

### Code Quality Checklist

Every new or refactored piece of code must be:

- **Lean**: no unused state, no speculative abstractions, no code for hypothetical future requirements.
- **Performant**: wrap stable callbacks in `useCallback`; wrap expensive pure renders in `memo`.
- **Readable**: short blocks, clear names, linear flow, minimal nesting.
- **Typed without `any`**: explicit interfaces; entity types imported from `src/types/`.
- **Single-source-of-truth**: one canonical definition per entity type.
- **Comment-free for obvious logic**: one short line at most when the WHY is non-obvious.
- **JSX-duplication-free**: extract before reusing — never copy-paste JSX.

---

## What NOT to Do

- No comments explaining WHAT the code does — names do that
- No error handling for impossible cases
- No feature flags or backwards-compat shims
- No raw HTML elements when shadcn component exists
- No hardcoded colors or spacing — use design tokens
- No `any` types — always type explicitly
- No direct DOM manipulation — use React state/refs
- No duplicated JSX — extract to a component first, then use it everywhere

---

## Feature Patterns — register-patients

Patterns extracted from `src/pages/app/patients/patients-list/register-patients/`. Use this as the canonical reference for multi-step form features.

### Component Structure

- The root orchestrator (`register-patients.tsx`) only wires hooks together and renders the shell. No business logic lives there.
- Step components (`step-basic-data.tsx`, `step-contact-address.tsx`, `step-clinical.tsx`) own layout and field rendering only. They receive only what they cannot get from `useFormContext`.
- Components that own their own server state (`AttachmentsList`) call `useQuery` / `useMutation` directly — they do not receive data as props.
- Atomic UI primitives (`SectionTitle`, `PillRadio`) accept only the minimum needed: icon + label, or options + value + onChange.
- Wrap performance-sensitive leaf components with `memo()` and `useCallback` on their handlers (`UploadZone` is the example).
- File-scoped helper functions used only within one component (`calcAge` in `step-basic-data.tsx`) stay in that file, not in `helpers.ts`.

### Hook Composition

- Each cross-cutting concern gets its own hook: `useFormSteps` (navigation), `usePatientSubmit` (submission), `useCepLookup` (address lookup), `useFileSelection` (file state).
- Feature-local hooks live in a `hooks/` subfolder inside the feature directory, not in global `src/hooks/`.
- Hook options and return shapes are always typed as explicit interfaces (`UsePatientFormStepsOptions`, `UsePatientFormStepsReturn`).
- Hooks receive React Hook Form primitives (`trigger`, `setValue`) as options instead of owning the form instance — hooks augment the form, they do not create it.
- All handlers returned from hooks are wrapped with `useCallback` (`handleNext`, `handleBack`, `goToStep`).
- The root component composes hooks and passes results as props. Step components never call feature-level hooks directly.

### Form Patterns

- Step components access the form via `useFormContext<PatientFormData>()` — never receive the form object as a prop.
- Validation mode is `"onTouched"` — errors appear after the user blurs a field, not on mount.
- Every field uses the full shadcn Form anatomy: `FormField` → `FormItem` → `FormLabel` → `FormControl` → `FormMessage`. Never skip a layer.
- Invalid state drives class changes via `fieldState.invalid` inside `cn()`: `cn("patient-input", fieldState.invalid && "border-red-600 focus-visible:ring-red-600/20")`.
- Masking runs on `onChange`, not in effects. `formatCPF`, `formatPhone`, `formatCEP` are applied inline inside the `onChange` handler.
- Per-step validation uses a `STEP_FIELDS` map (in `use-patient-form-steps.ts`) to call `trigger(fields)` before advancing — do not validate the whole form on step change.
- Default values are computed by a dedicated `buildPatientDefaults(patient?)` helper in `helpers.ts`. Never inline `defaultValues` in `useForm`.
- Optional string fields default to `""`. Only `dateOfBirth` uses `null` as the empty sentinel.

### API & Mutations

- After a successful mutation, invalidate all related query keys in parallel via `Promise.all([queryClient.invalidateQueries(...), ...])` — see `use-patient-submit.ts`.
- Derive the combined loading state from multiple pending flags: `isCreating || isUpdating || isUploading`.
- Non-critical side effects (avatar upload in `use-patient-submit.ts`) are wrapped in their own `try/catch` with a `console.warn` — they must not block the primary success path.
- Error toasts use an `AxiosError` type guard: `error instanceof AxiosError ? error.message : "Fallback message"`.
- Sequential uploads (attachments) are done with `for...of` + `await` — not `Promise.all` — to respect server rate limits.

### File Organization

- Feature root holds: `register-patients.tsx` (orchestrator), `constants.ts` (step config, option arrays, limits), `helpers.ts` (pure functions), `form-components.css` (shared form CSS).
- Step components live in a `steps/` subfolder inside the feature directory.
- Every `.tsx` file has a co-located `.css` file with the same base name (`step-basic-data.tsx` / `step-basic-data.css`).
- CSS class names use a feature prefix (`rp-` for register-patients) to avoid global collisions.
- Option arrays in `constants.ts` use `as const` for literal type inference (`GENDER_OPTIONS`, `MODALITY_OPTIONS`).
- Branded type aliases for constrained values are exported from `constants.ts` (`StepId = 1 | 2 | 3 | 4`).
- Local constants used only in one file (`FREQUENCY_OPTIONS` in `step-clinical.tsx`) stay in that file, not in `constants.ts`.
