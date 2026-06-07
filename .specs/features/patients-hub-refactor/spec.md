# Patients Hub Architecture Refactor — Specification

## Problem Statement

The `/patients-hub` feature predates the current `CLAUDE.md` and `.specs/codebase/` standards. It has accumulated systematic violations across every layer: god components mixing UI and business logic, missing hook extractions, `any` type holes, duplicated formatting and serialization logic, no feature-scoped CSS, no `constants.ts`/`helpers.ts` separation, and a naming violation (`patient-Info.tsx`). The technical debt compounds across every subsystem — anamnesis, files, timeline, resume — making the feature harder to maintain and extend.

## Goals

- [ ] Every file in `/patients-hub` complies with `CLAUDE.md` and `.specs/codebase/` standards
- [ ] Zero `any` types — all entity types imported from `src/types/`
- [ ] All business logic extracted from UI components into purpose-built hooks
- [ ] Compound component / namespace composition applied consistently
- [ ] Duplicated logic eliminated (formatters, PDF export, word count)
- [ ] Feature CSS files with `ph-` prefix co-located with each `.tsx`
- [ ] `constants.ts` and `helpers.ts` at feature root for shared utilities
- [ ] `hooks/` subfolder at feature root holding all feature-local hooks
- [ ] Zero behavioral or visual regressions
- [ ] `tsc --noEmit`, `pnpm lint`, and `pnpm build` all pass

## Out of Scope

| Feature | Reason |
|---|---|
| New anamnesis functionality | Behavior preserved — refactor only |
| Replacing hardcoded mock data in resume tab with real API | Requires backend endpoints — separate feature |
| `BACKEND_FALLBACK_URL` env config migration | Requires backend coordination — mark as constant in `constants.ts` for now |
| New fields or actions on patient hub | No feature additions |
| Global `src/types/` refactor | Only add missing types; don't touch existing globals |
| Test suite introduction | No test framework in v1 per `TESTING.md` |
| Design token changes | Design system unchanged; only fix token violations |
| Replacing `@react-pdf/renderer` | Library stays; usage is consolidated only |
| Replacing hardcoded mock data in `patient-resume-tab.tsx` | Separate feature — mock data preserved as-is |

---

## User Stories

### P1: Thin Orchestrator and Compound Component Structure ⭐ MVP

**User Story**: As a developer, I want `patients-details.tsx` to be a thin orchestrator that only wires hooks and composes layout, so that I can understand the page structure at a glance without reading 316 lines.

**Why P1**: The orchestrator is the foundation. Until it is lean, extracted hooks and subcomponents have no clear composition point.

**Acceptance Criteria**:

1. WHEN `patients-details.tsx` is reviewed THEN it SHALL contain only hook composition, top-level layout, and tab-based conditional rendering — no inline queue navigation, no `sessionStorage` calls, no `useHeaderStore` coordination beyond a single hook call
2. WHEN tab rendering uses ≥3 states THEN it SHALL use a named `renderTab` function with a `switch` statement — no nested ternaries
3. WHEN the page renders layout regions THEN they SHALL use namespace-composed subcomponents (e.g., `PatientDetailsShell.Header`, `PatientDetailsShell.Content`)
4. WHEN the file length is measured THEN it SHALL be ≤200 lines

**Independent Test**: Read `patients-details.tsx` top-to-bottom — sees hook calls, a layout shell, and a switch render. No `sessionStorage`, no `localStorage`, no `useEffect` with navigation logic.

**Requirement IDs**: PHR-01, PHR-02, PHR-03

---

### P1: Hook Architecture ⭐ MVP

**User Story**: As a developer, I want all cross-cutting concerns extracted into purpose-built hooks inside `patients-hub/hooks/`, so that each component has a single, explicit responsibility.

**Why P1**: Without extracted hooks, components cannot be lean. Hook extraction is the primary mechanism for separating business logic from rendering, and unblocks every other refactor.

**Acceptance Criteria**:

1. WHEN `patients-hub/hooks/` is reviewed THEN it SHALL contain at minimum: `use-patient-queue.ts`, `use-anamnesis-editor.ts`, `use-patient-files.ts`, `use-sessions-timeline.ts`
2. WHEN `use-patient-queue.ts` is read THEN it SHALL encapsulate all `sessionStorage` queue-read/write and patient navigation logic currently inline in `patients-details.tsx`
3. WHEN `use-anamnesis-editor.ts` is read THEN it SHALL encapsulate: block state initialization from API data, draft recovery from `localStorage`, auto-save debounce, and the `saveAnamnesis` mutation — everything currently in `anamnesis-form.tsx` effects
4. WHEN `use-patient-files.ts` is read THEN it SHALL encapsulate upload state, active filter, and delete confirmation — currently spread as `useState` calls in `patient-files-tab.tsx`
5. WHEN `use-sessions-timeline.ts` is read THEN it SHALL encapsulate search query, active status filter, and pagination — currently as `useState` calls in `patient-sessions-timeline.tsx`
6. WHEN any hook exposes a non-trivial options or return shape THEN it SHALL have explicit TypeScript interfaces: `UseFooOptions`, `UseFooReturn`
7. WHEN any handler is returned from a hook THEN it SHALL be wrapped with `useCallback`
8. WHEN a hook needs React Hook Form primitives THEN it SHALL accept `trigger`/`setValue` as options rather than owning the form instance

**Independent Test**: Open each hook file — returns a typed interface, all handlers are `useCallback`-wrapped, no JSX, no direct DOM access.

**Requirement IDs**: PHR-05, PHR-06, PHR-07, PHR-08, PHR-09, PHR-12

---

### P1: TypeScript Safety ⭐ MVP

**User Story**: As a developer, I want zero `any` types and all entity types imported from `src/types/`, so that the type system is fully enforced and data shapes are documented.

**Why P1**: `any` types silently disable type checking across every consumer. This is a foundational quality gate that must pass before the feature can be considered standards-compliant.

**Acceptance Criteria**:

1. WHEN any file in `/patients-hub` is reviewed THEN it SHALL contain zero `any` type annotations (including eslint-disable-next-line workarounds)
2. WHEN `metric-card.tsx` is reviewed THEN the `icon` prop SHALL use `LucideIcon` from `lucide-react` — not `any`
3. WHEN `export-pdf-button.tsx` is reviewed THEN the `session` prop SHALL reference the canonical `Session` type from `src/types/`
4. WHEN `patient-sessions-timeline.tsx` defines or uses a local `Session` interface THEN it SHALL be removed and replaced with an import from `src/types/`
5. WHEN `tsc --noEmit` runs against the project THEN it SHALL produce zero errors

**Independent Test**: `grep -rn ": any\|as any" src/pages/app/patients/patients-hub` — zero matches. `pnpm tsc --noEmit` — exits 0.

**Requirement IDs**: PHR-10, PHR-11

---

### P1: File and Folder Naming Conventions ⭐ MVP

**User Story**: As a developer, I want `/patients-hub` to follow the project's naming and folder conventions exactly, so that files are predictably located and consistent with every other feature.

**Why P1**: Naming violations create discoverability gaps and signal that a feature is "outside the standard". `patient-Info.tsx` with a capital `I` is an unambiguous CLAUDE.md breach that must be fixed before any other tooling runs against the folder.

**Acceptance Criteria**:

1. WHEN the components folder is reviewed THEN `patient-Info.tsx` SHALL be renamed to `patient-info.tsx` and all imports SHALL be updated to match
2. WHEN the feature root is reviewed THEN it SHALL contain `constants.ts` with feature-level option arrays, numeric limits, and branded type aliases — using `as const`
3. WHEN the feature root is reviewed THEN it SHALL contain `helpers.ts` with pure transformation functions used by more than one file
4. WHEN a constant or helper is used in only one file THEN it SHALL remain in that file — not moved to `constants.ts`/`helpers.ts` just for organization

**Independent Test**: `ls patients-hub/` shows `constants.ts`, `helpers.ts`. `ls patients-hub/components/` shows `patient-info.tsx` with lowercase `i`.

**Requirement IDs**: PHR-13, PHR-14

---

### P2: Feature CSS Organization

**User Story**: As a developer, I want each component in `/patients-hub` to have a co-located `.css` file with `ph-` prefixed class names, so that styles are scoped, non-colliding, and consistent with the project's CSS conventions.

**Why P2**: Feature CSS is a required CLAUDE.md convention but doesn't block structural work. It lands after the component restructure is stable.

**Acceptance Criteria**:

1. WHEN the feature folder is reviewed THEN each `.tsx` component file SHALL have a co-located `.css` file with the same base name (e.g., `patient-info.tsx` → `patient-info.css`)
2. WHEN CSS class names in any feature CSS file are reviewed THEN they SHALL use the `ph-` prefix (subsystem variants permitted: `ph-anamnesis-`, `ph-files-`, `ph-timeline-`)
3. WHEN generic layout utilities that map 1:1 to Tailwind tokens are reviewed THEN they SHALL remain as Tailwind classes in JSX — not extracted to CSS
4. WHEN a component imports a CSS file THEN the import SHALL reference its co-located file

**Independent Test**: Every `.tsx` in the feature has a `.css` sibling. No `ph-` class appears outside its owning file.

**Requirement IDs**: PHR-15

---

### P2: Code Deduplication

**User Story**: As a developer, I want all duplicated logic removed from `/patients-hub`, so that there is a single source of truth for formatting, PDF export, and utility computations.

**Why P2**: Duplication creates maintenance risk — one copy gets updated, others don't. Doesn't block structural work but must be resolved for the refactor to be complete.

**Acceptance Criteria**:

1. WHEN `patient-info.tsx` is reviewed THEN it SHALL NOT define `formatCPF` or `formatPhone` inline — it SHALL import from `src/utils/`
2. WHEN PDF generation logic is reviewed across the feature THEN it SHALL exist in a single location (a hook in `hooks/` or a helper in `helpers.ts`) and be called by all three consumers: `anamnesis-form.tsx`, `patient-sessions-timeline.tsx`, and `export-pdf-button.tsx`
3. WHEN word count logic is reviewed THEN it SHALL exist in exactly one file — `helpers.ts` if shared, or inline in its single consumer
4. WHEN `simple-preview-modal.tsx` is reviewed THEN `BACKEND_FALLBACK_URL` SHALL be sourced from a named constant in `constants.ts` — not a raw `'http://localhost:8080'` string literal

**Independent Test**: `grep -rn "function formatCPF\|function formatPhone" patients-hub/` — zero matches. `grep -rn "localhost" patients-hub/` — zero matches (moved to constant).

**Requirement IDs**: PHR-16, PHR-17, PHR-18, PHR-19

---

### P2: Anamnesis Subsystem Decomposition

**User Story**: As a developer, I want the anamnesis subsystem to follow the orchestrator + hook + subcomponent pattern, so that the 312-line `anamnesis-form.tsx` is replaced by a lean orchestrator backed by `useAnamnesisEditor`.

**Why P2**: The anamnesis component is the most complex in the feature. Its decomposition depends on the `hooks/` subfolder and hook architecture (P1) being in place first.

**Acceptance Criteria**:

1. WHEN `anamnesis-form.tsx` is reviewed THEN it SHALL be ≤200 lines and contain only: `useAnamnesisEditor` call, block list render, toolbar render — no `useEffect` managing draft recovery or auto-save
2. WHEN `useAnamnesisEditor` is reviewed THEN it SHALL own: block initialization from API response, `localStorage` draft recovery, debounced auto-save, and the `saveAnamnesis` mutation call
3. WHEN `anamnesis-utils.ts` is reviewed THEN it SHALL contain ONLY pure transformation functions with no side effects — no state, no API calls, no localStorage access
4. WHEN anamnesis-specific types (`AnamnesisBlock`, `SerializedBlock`) are reviewed THEN they SHALL live in `src/types/anamnesis.ts` if used outside the feature, or remain in `anamnesis-types.ts` if feature-local only
5. WHEN `anamnesis-header.tsx`, `anamnesis-toolbar.tsx`, `anamnesis-editor-block.tsx`, and `anamnesis-navigation.tsx` are reviewed THEN each SHALL be ≤150 lines with a single, explicit responsibility

**Independent Test**: Read `anamnesis-form.tsx` — it renders blocks and calls `useAnamnesisEditor` methods. No `useEffect` with `localStorage` or debounce logic visible in the component.

**Requirement IDs**: PHR-20, PHR-21, PHR-22

---

### P2: React Query Conformance

**User Story**: As a developer, I want all React Query usage in `/patients-hub` to follow the canonical query key and mutation patterns from `CLAUDE.md` and `CONVENTIONS.md`, so that cache invalidation is predictable and data fetching is consistent.

**Why P2**: React Query conformance improves cache correctness and error handling consistency but doesn't block structural work.

**Acceptance Criteria**:

1. WHEN any `useQuery` in the feature is reviewed THEN its `queryKey` SHALL use array format: `['patient-hub', patientId, subKey]`
2. WHEN a mutation has related query invalidations THEN it SHALL invalidate via `Promise.all([queryClient.invalidateQueries(...), ...])` — not fire-and-forget or sequential
3. WHEN combined loading state is derived from multiple mutations THEN it SHALL be expressed as `isA || isB || isC` — no duplication or inconsistent naming
4. WHEN a non-critical mutation side effect fails THEN it SHALL be wrapped in `try/catch` with `console.warn` — not block the primary success path

**Independent Test**: `grep -rn "queryKey" patients-hub/` — all keys match `['patient-hub', ...]` pattern. No ad-hoc string keys.

**Requirement IDs**: PHR-23, PHR-24

---

### P3: Performance Guardrails

**User Story**: As a developer, I want performance-sensitive leaf components to use `React.memo()` with `useCallback`-stabilized handlers, so that re-renders are bounded and list-heavy views remain smooth.

**Why P3**: Performance guardrails improve UX but don't affect correctness. Applied last, after structure is stable and handlers are already `useCallback`-wrapped in hooks.

**Acceptance Criteria**:

1. WHEN `AnamnesisEditorBlock` is reviewed THEN it SHALL be wrapped with `React.memo()`
2. WHEN `FileCard` is reviewed THEN it SHALL be wrapped with `React.memo()`
3. WHEN handlers passed to memoized components are reviewed at the call site THEN they SHALL be `useCallback`-wrapped
4. WHEN stable callbacks are returned from hooks THEN they SHALL be `useCallback`-wrapped

**Independent Test**: React DevTools Profiler — changing one anamnesis block does not re-render sibling blocks.

**Requirement IDs**: PHR-04

---

## Edge Cases

- WHEN `patientId` param is missing or invalid THEN the page SHALL redirect to 404 or patients list (preserve existing behavior)
- WHEN anamnesis API returns legacy format (no `DYNAMIC_TEMPLATE_PREFIX`) THEN `useAnamnesisEditor` SHALL handle fallback deserialization via `anamnesis-utils.ts` — existing logic preserved
- WHEN `localStorage` draft is corrupted or unparseable THEN `useAnamnesisEditor` SHALL discard the draft with `console.warn` — not crash
- WHEN file upload is rejected (wrong type or size) THEN `use-patient-files` SHALL surface the validation error via toast — not silently fail
- WHEN the patient queue has only one entry THEN `use-patient-queue` SHALL disable prev/next navigation buttons gracefully
- WHEN multiple mutations are in-flight simultaneously THEN combined `isPending` flags SHALL reflect all pending states

---

## Requirement Traceability

| Requirement ID | Story | Priority | Status |
|---|---|---|---|
| PHR-01 | Thin Orchestrator | P1 | Pending |
| PHR-02 | Thin Orchestrator | P1 | Pending |
| PHR-03 | Thin Orchestrator | P1 | Pending |
| PHR-04 | Performance Guardrails | P3 | Pending |
| PHR-05 | Hook Architecture | P1 | Pending |
| PHR-06 | Hook Architecture | P1 | Pending |
| PHR-07 | Hook Architecture | P1 | Pending |
| PHR-08 | Hook Architecture | P1 | Pending |
| PHR-09 | Hook Architecture | P1 | Pending |
| PHR-10 | TypeScript Safety | P1 | Pending |
| PHR-11 | TypeScript Safety | P1 | Pending |
| PHR-12 | Hook Architecture | P1 | Pending |
| PHR-13 | Naming Conventions | P1 | Pending |
| PHR-14 | Naming Conventions | P1 | Pending |
| PHR-15 | Feature CSS | P2 | Pending |
| PHR-16 | Code Deduplication | P2 | Pending |
| PHR-17 | Code Deduplication | P2 | Pending |
| PHR-18 | Code Deduplication | P2 | Pending |
| PHR-19 | Code Deduplication | P2 | Pending |
| PHR-20 | Anamnesis Subsystem | P2 | Pending |
| PHR-21 | Anamnesis Subsystem | P2 | Pending |
| PHR-22 | Anamnesis Subsystem | P2 | Pending |
| PHR-23 | React Query Conformance | P2 | Pending |
| PHR-24 | React Query Conformance | P2 | Pending |

**Total:** 24 requirements · 0 mapped to tasks · 0 verified ⚠️

---

## Success Criteria

- [ ] `pnpm tsc --noEmit` exits with zero errors
- [ ] `pnpm lint` exits with zero errors
- [ ] `pnpm build` completes successfully
- [ ] Manual: all 5 patient hub tabs render without visual regression
- [ ] Manual: anamnesis auto-save and draft recovery work correctly
- [ ] Manual: file upload, preview, and delete work correctly
- [ ] Manual: patient queue navigation (prev/next) works correctly
- [ ] Manual: session timeline search, filter, and pagination work correctly
- [ ] `grep -rn ": any\|as any" src/pages/app/patients/patients-hub` — zero matches
- [ ] No console errors during normal usage in browser DevTools
