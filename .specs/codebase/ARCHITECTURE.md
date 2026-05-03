# Architecture — MindFlush Frontend

## Visão Geral

SPA client-side (Vite + React Router). Sem SSR. Autenticação via `localStorage`. Sidebar dinâmica por role.

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
PageComponent
  └── useHeaderStore.setTitle()   ← define breadcrumb do Header
  └── useXyzFilters()             ← filtros sincronizados com URL (useSearchParams + Zod)
  └── useQuery(queryFn, queryKey) ← dados do servidor via React Query
  └── <Table> / <List>
      └── <Row> / <Card>
          └── dialogs inline (edit, delete, detail)
```

## Estado Global

| Store | Responsabilidade | Localização |
|---|---|---|
| `useHeaderStore` | Título e subtítulo do Header | `src/hooks/use-header-store.ts` |
| `useInviteStore` | Dados de convite (persist localStorage) | `src/hooks/use-invite-store.ts` |

## PopupManager

`src/components/popup-renderer.tsx` — renderiza popups/achievements de forma centralizada no AppLayout. Alimentado por `src/api/popups.ts`.
