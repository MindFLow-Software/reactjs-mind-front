# Conventions — MindFlush Frontend

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
- **Não criar classes CSS customizadas** — usar tokens do sistema.

## Ícones

- Preferir `@phosphor-icons/react` para novos componentes.
- `lucide-react` está presente por legado — evitar adicionar novos usos.

## Tradução de Enums

- Centralizado em `src/utils/mappers.ts` como `Record<string, string>` (ex: `ROLE_TRANSLATIONS`, `EXPERTISE_TRANSLATIONS`).
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
