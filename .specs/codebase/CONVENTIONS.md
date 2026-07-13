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
- Use native TypeScript `enum` for closed domain values. Do not create enum-like `const` objects plus `typeof` type aliases such as `export type Languages = (typeof Languages)[keyof typeof Languages]`; export `enum Languages` instead.
- Always consume enum values through the enum member, never through raw string literals. Use `Honorific.MASC_DR`, not `'MASC_DR'`; use `AppointmentStatus.SCHEDULED`, not `'SCHEDULED'`.
- Never reexport anything. Every symbol must be exported from exactly one module and imported directly from that source module. No barrel exports, no one-line compatibility wrappers, and no `import type { IExample } from './example'; export { IExample }`.
- No `any`. Use backend-aligned types, `unknown` plus guards, or generics.

Conditional logic:

- Simple two-state ternaries are allowed only when they are the clearest option.
- Never chain or nest ternaries, especially inside JSX, unless there is no cleaner and more readable alternative.
- Three or more states must use a named render function, `if`, `switch`, lookup map, or precomputed variable.

Reuse:

- If an equivalent utility-class method exists, reuse it. Do not reimplement formatting, normalization, validation, guards, date handling, or mapping logic inline.
- Always use the utility classes in `src/utils` (`Sanitizer`, `Normalizer`, `Time`, `Isness`, etc.) instead of recreating local functions or duplicated code.
- If related utility behavior is missing, add a static method to the correct utility class before using it elsewhere.
- Any function used in two or more places must be extracted to a helper class or helper/util/shared file and reused from there.
- Shared reusable helpers belong in `src/utils`, `src/shared`, or the closest established shared location for that domain.

Dates and time:

- Date formatting, parsing, validation, comparison, and date treatment must always use `Time` from `src/utils/time.ts`.
- Do not import or use `date-fns`, manual `Date` formatting, or ad hoc date helpers outside `Time`.
- `Time` methods must use `date-fns` internally. If a needed date operation is missing, add a static method to `Time` first and use that method everywhere else.

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
- Authenticated user data must always come from `useAuth`. Do not read authenticated user data from `localStorage`, duplicate profile queries, route guards, API responses, or stale user snapshots when `useAuth` is available.
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

- Valores fechados de dominio devem usar `enum` TypeScript nativo:
  ```ts
  export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    ATTENDING = 'ATTENDING',
    FINISHED = 'FINISHED',
  }
  ```
- Usar sempre o membro do enum nos call sites, por exemplo `AppointmentStatus.SCHEDULED` e `Honorific.MASC_DR`; nunca strings cruas como `'SCHEDULED'` ou `'MASC_DR'`.
- Nao exportar objeto `const` + type alias com `typeof AppointmentStatus[keyof typeof AppointmentStatus]`; criar `enum` nativo.
- Nunca reexportar tipos, enums, helpers, constantes, componentes ou hooks. Cada simbolo deve ter um unico arquivo exportador canonico, e todos os imports devem apontar diretamente para ele.
- Dicionarios de traducao devem usar chaves tipadas pelo enum, por exemplo `Record<Honorific, string>`, nao `Record<string, string>`, quando as chaves sao valores de enum.
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

- Centralizado em `src/constants` como `Record<EnumName, string>` quando as chaves pertencem a um enum (ex: `translatedExpertise`, `translatedHonorific`).
- Chaves devem ser membros do enum (`Honorific.MASC_DR`), nao strings cruas em SCREAMING_SNAKE_CASE.

## Formatadores

Em `src/utils/`:
- Usar classes utilitarias com metodos estaticos (`Sanitizer`, `Normalizer`, `Time`, `Isness`, etc.).
- Datas: sempre via `Time`; `date-fns` so pode ser usado dentro de `src/utils/time.ts`.
- Se faltar um formatador, validador, normalizador, sanitizador ou tratativa de data, adicionar o metodo estatico na classe utilitaria correta antes de usar no codigo.

## Importações

- Alias `@/` para `src/` em todos os imports internos.
- Ordenação automática via `eslint-plugin-simple-import-sort`.

## Variáveis de Ambiente

- Acessar via `env` de `@/env` (não `import.meta.env` diretamente).
- Novas env vars: adicionar ao schema Zod em `src/env.ts`.
