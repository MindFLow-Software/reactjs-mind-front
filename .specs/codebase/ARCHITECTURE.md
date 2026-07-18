# Architecture — MindFlush Frontend

## Visão Geral

SPA client-side (Vite + React Router). Sem SSR. Autenticação via `localStorage`. Sidebar dinâmica por role.

## Mandatory Refactor Architecture

The target architecture is layered and contract-first:

1. Backend contract and `docs/frontend-reference/*.md`.
2. `src/types` backend-aligned entities/domains.
3. `src/api/{domain}/{action}.ts` typed HTTP functions using `api`.
4. Named domain hooks (`use<Entity>.ts` wrapping `useQuery`, `use<Action><Entity>.ts` wrapping `useMutation`/`useApiMutation`) for server-state consumption and mutation side effects. `useQuery`, `useMutation`, and `useApiMutation` are never called directly outside these hooks.
5. Page orchestrators that compose hooks and layout.
6. Shared helpers/utilities for any pure function reused in two or more places.
7. Local/shared components built with shadcn/ui primitives and feature CSS.

Forbidden architectural shortcuts:

- Direct HTTP calls in pages/components/hooks.
- `useQuery`, `useMutation`, or `useApiMutation` called directly inside a page/component instead of through a named domain hook — including one-off, single-use queries and mutations.
- Component-local remote data fetching with `useEffect`.
- Entity or DTO definitions duplicated in feature files.
- Form validation outside React Hook Form + Zod.
- Global state outside Zustand.
- Zustand stores in `src/utils`.
- Prop drilling through components with more than 3 independent props.
- Reusing creation modals/forms/schemas/hooks for editing through flags such as `isEditing`, `mode`, or `initialData`.
- CSS embedded in TSX or pure feature CSS outside Tailwind `@layer`/`@apply`.
- Chained or nested ternaries, especially inside JSX, unless there is no cleaner and more readable alternative.
- Authenticated user data reads outside `useAuth`.
- Duplicating a helper/utility function when an equivalent helper already exists.
- Keeping a function local after it is used in two or more places.
- Authenticated user data from any source other than `useAuth`, including `localStorage`, duplicate profile queries, route guards, API responses, or stale snapshots.
- Date formatting, parsing, validation, comparison, or treatment outside `Time` from `src/utils/time.ts`.
- Direct `date-fns` usage outside `Time`. `Time` must use `date-fns` internally for date methods.
- Local utility logic when it belongs in an existing utility class. Add a static method to `Sanitizer`, `Normalizer`, `Time`, or the correct utility class first.
- Enum-like `const` objects plus `typeof` aliases for closed domain values. Use native TypeScript enums.
- Raw string literals for enum values. Use enum members such as `Honorific.MASC_DR`, not `'MASC_DR'`.
- Reexports of any kind. Every type, enum, helper, constant, component, and hook must be exported from exactly one canonical module and imported directly from there.

`src/pages/app/profiles` is an inspiration for composition, but not a perfect target. It must still be corrected for CSS, effects, typing, and backend contract alignment.

---

## Layouts

Três layouts raiz em `src/pages/_layouts/`:

```
/ → LandingLayout (apenas <Outlet>)
/sign-in, /sign-up → AuthLayout (grid 2 colunas: branding | form)
/dashboard, /patients-*, ... → AppLayout (protegido por authLoader)
```

### AppLayout (`src/pages/_layouts/app.tsx`)

```
SidebarProvider (Radix context)
  ├── AppSidebar          ← menu dinâmico por role, carrega profile via React Query
  └── SidebarInset
      ├── Header          ← breadcrumb + ações globais
      ├── <Outlet />      ← rota atual renderizada aqui
      └── PopupManager    ← modais/toasts globais centralizados
```

## Autenticação & Autorização

- **Auth guard**: `authLoader` (React Router loader) verifica `localStorage.getItem('isAuthenticated') === 'true'`; redireciona para `/sign-in` se falso.
- **Role guard**: `adminLoader` lê `localStorage.getItem('user')` (JSON), verifica `role === 'SUPER_ADMIN'`; redireciona para `/dashboard`.
- **ProtectedRoute**: componente wrapper para dupla verificação em runtime (auth + role opcional).
- Roles ativos: `PSYCHOLOGIST` e `SUPER_ADMIN`.

## Rotas

| Caminho | Módulo | Acesso |
|---|---|---|
| `/` | Landing page | Público |
| `/sign-in`, `/sign-up` | Auth | Público |
| `/dashboard` | Dashboard psicólogo | Auth |
| `/dashboard-finance` | Financeiro | Auth |
| `/patients-list` | Listagem de pacientes | Auth |
| `/patients/:id/details` | Hub do paciente | Auth |
| `/patients-docs` | Documentos | Auth |
| `/patients-records` | Prontuários | Auth |
| `/appointment` | Agenda | Auth |
| `/availability` | Horários disponíveis | Auth |
| `/video-room` | Sala de atendimento (LiveKit) | Auth |
| `/account` | Perfil do psicólogo | Auth |
| `/suggestion` | Sugestões de feature | Auth |
| `/admin-dashboard` | Dashboard admin | Auth + SUPER_ADMIN |
| `/approvals` | Aprovações | Auth + SUPER_ADMIN |
| `/admin-suggestions` | Gestão de sugestões | Auth + SUPER_ADMIN |
| `/menagement-suggestions` | Management (typo na rota) | Auth + SUPER_ADMIN |

## Módulo de Pacientes

Sub-dividido em 4 partes com rotas independentes:

```
patients-list     → /patients-list        (tabela + cadastro)
patients-hub      → /patients/:id/details (anamnese, timeline, arquivos)
patients-docs     → /patients-docs        (gestão de documentos/attachments)
patients-records  → /patients-records     (prontuários)
```

Componentes compartilhados entre sub-módulos: `src/pages/app/patients/components/`.

## Padrão de Página

```
PageComponent                          ← orquestrador: só hooks + layout raiz
  ├── useHeaderStore.setTitle()        ← define breadcrumb do Header
  ├── useXyzFilters()                  ← filtros sincronizados com URL (useSearchParams + Zod)
  ├── useQuery(queryFn, queryKey)      ← dados do servidor via React Query
  │
  ├── <PageShell>                      ← layout de página reutilizável
  │     ├── <PageShell.Header>         ← título + descrição + actions
  │     │     └── <LocalHeaderActions> ← subcomponente local com os botões do topo
  │     └── <PageShell.Content>        ← área principal
  │           ├── métricas (MetricCard.Icon / MetricCard.Value / MetricCard.Label)
  │           └── <DataBlock>
  │                 ├── <DataBlock.Header>   ← título + actions secundárias
  │                 ├── <DataBlock.Toolbar>  ← filtros
  │                 ├── <DataBlock.Content>  ← tabela / lista
  │                 └── <DataBlock.Footer>   ← paginação
  └── dialogs (Dialog + conteúdo interno)
```

Referência canônica: `src/pages/app/patients/patients-list/patients-list.tsx`.

### Regras de Composição

- Componente orquestrador (a página) não contém lógica de UI — apenas compõe hooks e delega rendering.
- Regiões com responsabilidade própria (header da página, toolbar da tabela, footer com paginação) viram subcomponentes locais nomeados.
- Composição com namespace (`Shell.Header`, `DataBlock.Footer`, `MetricCard.Value`) é obrigatória em compound components que têm múltiplas regiões.
- Props relacionadas são agrupadas em objetos quando reduzem ruído: `sort={{ by, order, onSort }}`.
- Ações não implementadas ficam `disabled` — nunca parecem funcionais.

## Estado Global

| Store | Responsabilidade | Localização |
|---|---|---|
| `useHeaderStore` | Título e subtítulo do Header | `src/hooks/use-header-store.ts` |
| `useInviteStore` | Dados de convite (persist localStorage) | `src/hooks/use-invite-store.ts` |

## PopupManager

`src/components/popup-renderer.tsx` — renderiza popups/achievements de forma centralizada no AppLayout. Alimentado por `src/api/popups.ts`.
