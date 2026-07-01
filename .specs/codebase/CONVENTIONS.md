# Conventions — MindFlush Frontend

## Mandatory Refactor Conventions

This section is mandatory and overrides older text in this file when there is a conflict.

Source of truth:

- Backend contracts come from current backend implementation and `docs/frontend-reference/*.md`.
- `.specs/features/frontend-contract/*.md` is historical unless it matches `docs/frontend-reference/*.md`.
- Existing frontend DTOs, routes, and entity shapes are not authoritative.

API:

- API calls live only in `src/api/{domain}/{action}.ts`.
- Every API file exports one API function.
- Every API function imports `api` from `@/lib/axios`.
- No raw `fetch`, no raw `axios`, and no `api.*` calls inside pages/components/hooks.
- GET requests are consumed through `useQuery`.
- POST/PUT/PATCH/DELETE requests are consumed through `useMutation`.
- Mutation success and error handlers must show backend-provided messages/guidance through Sonner.
- Request and response types must be aligned with backend contracts and must reuse `src/types` entities/domains wherever possible.

Types:

- Interfaces must use `I` + PascalCase: `IUser`, `IPatient`, `IAppointmentResponse`.
- Backend entities/domains must have a single source of truth in `src/types`.
- API files may define action-specific request/response wrappers only when they are not reusable entities.
- UI-only types must be explicitly named as view models and must not replace backend entities.
- No `any`. Use backend-aligned types, `unknown` plus guards, or generics.

Validators and forms:

- Zod schemas live in `src/validators/{domain}/{layer}/{action}-schema.ts`.
- Each validator file exports exactly one schema.
- No inline schemas in components/pages.
- Every form must use React Hook Form + Zod and be fully typed.
- Validated fields must use shadcn form/field primitives.

Components and hooks:

- Prefer shadcn/ui primitives before custom components.
- Components with more than 3 props must use composition or a grouped typed object.
- Creation and editing flows must be separate. Never reuse a create modal/form/schema/hook for edit mode.
- Reusable API/filter logic becomes hooks.
- Shared hooks live in `src/hooks`; feature-only hooks live next to the feature.
- Global state uses Zustand and must live in one consistent store location. Do not put stores in `src/utils`.
- Each `.tsx` file should expose one main function when possible. Compound components are the allowed exception.

CSS:

- Every page/component `.tsx` that owns markup must have its respective CSS file.
- CSS must use Tailwind `@reference`, `@layer`, and `@apply`.
- No pure feature CSS blocks and no inline style blocks for reusable component styling.
- Consolidate duplicated class lists into a shared CSS source when two or more places repeat the same styling.
- Use design tokens and shadcn variants; avoid hardcoded colors.

Legacy conflict notes:

- `useApiMutation` is not canonical while `src/hooks/use-api-mutation.ts` is empty.
- Stores must not live in `src/utils`.
- API request/response interfaces should not be duplicated inside API files when they represent backend entities.
- Components such as `RegisterPatients` must not accept `isEditing` to turn a creation flow into an editing flow. Split into create and edit components with separate schemas, hooks, and mutation logic.

---

## API Layer (`src/api/`)

- Um arquivo por endpoint, nomeado como `verbo-substantivo.ts` (ex: `get-profile.ts`, `create-appointment.ts`).
- Função exportada nomeada em camelCase: `getProfile`, `createAppointment`.
- Interfaces dedicadas para request e response no mesmo arquivo.
- Generic tipado no axios: `api.get<ResponseType>('/path')`.
- Datas enviadas como ISO string: `scheduledAt.toISOString()`.
- Dados brutos mapeados manualmente antes do retorno quando necessário.

```ts
// Padrão
export async function fetchAppointments(params: FetchAppointmentsParams): Promise<FetchAppointmentsResponse> {
  const response = await api.get<FetchAppointmentsResponse>('/appointments', { params })
  return response.data
}
```

## Hooks de Data Fetching

- Encapsulam `useQuery` em um hook nomeado `use<Entidade>.ts`.
- `queryKey` com array descritivo; versionar com sufixo `-v2` se necessário para bust de cache.
- `staleTime` de 10 minutos (600 000ms) para dados de perfil; ajustar por domínio.
- `queryFn` referenciada diretamente (sem wrapper anônimo).

```ts
export function usePsychologistProfile() {
  return useQuery({
    queryKey: ['psychologist-profile-v2'],
    queryFn: getProfile,
    staleTime: 1000 * 60 * 10,
  })
}
```

## Mutations

- **Mutations simples** (único endpoint, sem efeitos colaterais independentes): usar `useApiMutation` de `@/hooks/use-api-mutation`.
- **Mutations complexas** (múltiplos endpoints sequenciais, uploads separados, efeitos colaterais não-críticos): usar `useMutation` do TanStack Query diretamente, encapsulado em um hook de domínio próprio.
- Invalidar query keys relacionadas em paralelo com `Promise.all([queryClient.invalidateQueries(...), ...])` após sucesso.
- Estado de loading combinado: derivar de múltiplas flags (`isCreating || isUpdating || isUploading`) — não criar estado local para isso.
- Uploads sequenciais (attachments): usar `for...of` + `await`, não `Promise.all`, para respeitar rate limits do servidor.
- Efeitos colaterais não-críticos (ex: upload de avatar): envolver em `try/catch` separado com `console.warn` — não devem bloquear o caminho de sucesso principal.

Referência canônica: `src/pages/app/patients/patients-list/register-patients/hooks/use-patient-submit.ts`.

## Filtros de Página

- Filtros persistidos na URL via `useSearchParams()` (React Router).
- Parsing seguro com Zod: `z.coerce.number().catch(0)`.
- Page é 1-indexed na URL, convertida para 0-indexed para a API.
- Hook retorna `setPage`, `setFilters`, `clearFilters`.

## Stores Zustand

- Ficam em `src/hooks/`, não em pasta `stores/` separada.
- Nomeados `use<Nome>Store.ts`.
- Persistência via `persist` middleware + `createJSONStorage(() => localStorage)`.

## Tipagem

- Enums como type unions: `type Status = 'SCHEDULED' | 'DONE' | 'CANCELLED'`
- Objetos-enum com `as const` quando precisar iterar valores:
  ```ts
  export const AppointmentStatus = { SCHEDULED: 'SCHEDULED', ... } as const
  type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus]
  ```
- `Record<string, string>` para dicionários de tradução.
- `?` para campos opcionais, nunca `| undefined` explícito desnecessário.

## Estilização

- Sempre usar `cn()` de `@/lib/utils` para merge de classes.
- Variantes de componente com `cva()` da `class-variance-authority`.
- Tokens de cor e tipografia definidos em `src/global.css` via `@theme inline` (Tailwind 4).
- Cor primária: `#4f35e1` (roxo). Sistema de cores em OKLch.
- Dark mode via classe `.dark` (custom variant no global.css).
- Feature-scoped CSS files are acceptable when co-located with their `.tsx` component (same directory, same base name). All class names in a feature CSS file must carry a short feature prefix (`rp-`, `pl-`) to prevent global collisions.
- Do not create standalone global utility classes — use Tailwind tokens directly in JSX for anything that is not feature-specific.

## Ícones

- Usar `lucide-react` para todos os novos componentes — é o sistema primário.
- `@phosphor-icons/react` é legado — não adicionar novos usos. Substituir oportunisticamente ao tocar em código existente que o usa.

## Tradução de Enums

- Centralizado em `src/constants` como `Record<string, string>` (ex: `translatedExpertise`, `translatedHonorific`).
- Chaves em SCREAMING_SNAKE_CASE (valor do backend), valores em PT-BR.

## Formatadores

Em `src/utils/`:
- `formatCPF(raw: string): string`
- `formatPhone(raw: string): string`
- `formatCEP(raw: string): string`
- `formatAGE(birthDate: string): number`

## Importações

- Alias `@/` para `src/` em todos os imports internos.
- Ordenação automática via `eslint-plugin-simple-import-sort`.

## Variáveis de Ambiente

- Acessar via `env` de `@/env` (não `import.meta.env` diretamente).
- Novas env vars: adicionar ao schema Zod em `src/env.ts`.
