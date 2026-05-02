# Concerns — MindFlush Frontend

## Autenticação Frágil

**Risco: Médio**
Auth via `localStorage` (`isAuthenticated`, `user` JSON) é vulnerável a XSS — um script malicioso pode ler o token. Aceitável para MVP/demo, mas deve ser migrado para HttpOnly cookies antes de produção com dados reais de pacientes (LGPD).

## Dois Sistemas de Ícones

**Risco: Baixo**
`@phosphor-icons/react` e `lucide-react` coexistem. Aumenta bundle size e cria inconsistência visual. Preferir Phosphor para novos componentes; evitar adicionar novos usos de Lucide.

## QueryClient sem Configuração Global

**Risco: Baixo**
`src/lib/react-query.ts` exporta `new QueryClient()` sem `defaultOptions`. Cada query define seu próprio `staleTime` e `retry`. Risco de inconsistência — queries sem `staleTime` usam o default de 0 (sem cache).

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
