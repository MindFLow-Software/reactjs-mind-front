# Testing — MindFlush Frontend

## Mandatory Refactor Verification

Every refactor batch must run:

```bash
pnpm.cmd exec tsc -b --pretty false --noEmit
pnpm.cmd exec eslint src --ext ts,tsx
```

Use `pnpm.cmd` on Windows because `pnpm exec` can be blocked by PowerShell execution policy.

Before calling a module done, verify:

- No direct HTTP calls outside `src/api`.
- No `any`.
- No inline Zod schemas in pages/components.
- Every form uses React Hook Form + Zod.
- Every mutation shows backend success/error messages.
- Every GET is consumed through `useQuery`.
- Every POST/PUT/PATCH/DELETE is consumed through `useMutation`.
- Touched `.tsx` pages/components have CSS using `@reference`, `@layer`, and `@apply`.
- Backend entity/DTO types match `docs/frontend-reference/*.md`.
- No chained or nested ternaries, especially inside JSX, unless there is no cleaner and more readable alternative.
- Existing helpers/utils are reused instead of reimplemented inline.
- Functions used in two or more places are extracted to a helper class or helper/util/shared file.
- Logged-in user profile data is read through `useAuth`.
- Closed domain values use native TypeScript `enum`, not exported `const` objects plus `typeof` aliases.
- Enum values are consumed through enum members, for example `Honorific.MASC_DR`, not raw strings such as `'MASC_DR'`.
- No reexports, barrel exports, or one-line compatibility wrapper exports. Every symbol is imported from its canonical source module.

Manual smoke tests for the final refactor:

- Sign in/sign out/session refresh.
- Profile and practice context selection.
- Patient list/create/edit/status/delete.
- Patient hub/docs/records.
- Appointment list/create/edit/cancel/reschedule.
- Admin suggestions/dashboard when admin access is available.

---

## Estado Atual

Nenhum framework de teste está configurado. O `package.json` não possui script `test` nem dependências de teste (vitest, jest, testing-library).

## Gates Automatizados (v1)

| Gate | Comando | O que verifica |
|---|---|---|
| Type checking | `pnpm build` (via `tsc -b`) | Erros de tipo TypeScript em todo o projeto |
| Lint | `pnpm lint` | Regras ESLint + import sort |

Execute `pnpm build` antes de qualquer PR para garantir que o código compila sem erros de tipo.

## Testes Manuais

Verificação visual e funcional manual é o processo atual para validar features.

## Recomendação Futura (pós-v1)

- **Unit/Integration**: Vitest (alinhado com Vite, sem config extra)
- **Component testing**: @testing-library/react
- **E2E**: Playwright (integra bem com Vite)
