# Concerns — MindFlush Frontend

## Autenticação Frágil

**Risco: Médio**
Auth via `localStorage` (`isAuthenticated`, `user` JSON) é vulnerável a XSS — um script malicioso pode ler o token. Aceitável para MVP/demo, mas deve ser migrado para HttpOnly cookies antes de produção com dados reais de pacientes (LGPD).

## Dois Sistemas de Ícones

**Risco: Baixo**
`@phosphor-icons/react` e `lucide-react` coexistem, aumentando bundle size. **Decisão tomada:** Lucide é o sistema primário. Todo código novo usa Lucide. Phosphor é legado — não adicionar novos usos e substituir oportunisticamente ao tocar arquivos existentes.

## QueryClient sem Configuração Global

**Risco: Baixo**
`src/lib/react-query.ts` exporta `new QueryClient()` sem `defaultOptions`. Cada query define seu próprio `staleTime` e `retry`. Risco de inconsistência — queries sem `staleTime` usam o default de 0 (sem cache).

## Refactor Blockers And High-Risk Debt

**Risco: Alto**
The frontend currently has systemic architecture drift:

- API calls are not consistently isolated in `src/api`.
- Several frontend routes and DTOs do not match current backend references.
- Validators are flat and multi-export instead of `src/validators/{domain}/{layer}/{action}-schema.ts`.
- Forms are not consistently React Hook Form + Zod.
- `any` exists in appointment, admin, finance, billing, auth, utilities, and popup code.
- Chained/nested ternaries make JSX branches hard to audit and are forbidden unless no cleaner and more readable alternative exists.
- Helper logic is duplicated instead of consistently reusing `src/utils`/shared helpers.
- Logged-in profile data is sometimes read from stale local sources instead of `useAuth`.
- Enum-like `const` objects and type aliases create avoidable drift where native TypeScript `enum` must be used.
- Raw string enum values such as `'MASC_DR'` create drift; call sites must use enum members such as `Honorific.MASC_DR`.
- Reexports hide ownership and create multiple import paths; every symbol must be exported from exactly one canonical module.
- CSS is missing for most `.tsx` feature components and several CSS files do not use `@layer`.
- Zustand stores are split between `src/hooks`, `src/store`, and `src/utils`.
- Mutation success/error feedback is inconsistent and often does not show backend guidance.
- Components with large prop surfaces and duplicated UI patterns need composition/consolidation.

The detailed map is `.specs/codebase/FRONTEND_REFACTOR_AUDIT.md`.

---

## SWR Instalado junto com React Query

**Risco: Baixo**
`swr` está no `package.json` mas React Query é o padrão. SWR é legado ou não utilizado. Pode ser removido para reduzir bundle.

## Typo em Rota

**Risco: Baixo**
`/menagement-suggestions` deveria ser `/management-suggestions`. Inofensivo agora, mas pode confundir se a rota for linkada externamente.

## LiveKit no Bundle de Produção

**Risco: Baixo**
Dependências LiveKit (`livekit-client`, `@livekit/components-react`) estão instaladas e importadas, aumentando o bundle mesmo sem a feature ativa. Considerar lazy-loading ou mover para dynamic import quando a feature for ativada.

## `"use client"` Directive em Hooks

**Risco: Baixo**
Alguns hooks (ex: `use-psychologist-profile.ts`) têm a diretiva `"use client"` (padrão Next.js). O projeto usa Vite — a diretiva é ignorada mas indica que o código pode ter sido copiado de um projeto Next.js. Inofensivo, mas inconsistente.

## localStorage Acoplado na Camada de API

**Risco: Baixo**
`src/api/get-profile.ts` chama `localStorage.setItem('user', ...)` diretamente. Acopla efeito colateral na função de API. Dificulta testes e SSR futuro.

## Paginação 1-indexed vs 0-indexed

**Risco: Baixo**
A URL usa paginação 1-indexed (página 1 = primeiro resultado), mas a API espera 0-indexed. A transformação é feita via Zod em `usePatientFilters` (`z.coerce.number().transform(val => val - 1)`). Manter esse padrão em todos os novos hooks de filtro.
