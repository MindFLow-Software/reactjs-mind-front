# Stack — MindFlush Frontend

## Mandatory Stack Decisions

These choices are mandatory during the refactor:

- Server state: TanStack React Query only. Do not add SWR usage.
- HTTP: Axios through `api` from `@/lib/axios` only.
- Forms: React Hook Form + Zod only.
- Validation: Zod schemas in the required validator folder structure.
- Global client state: Zustand only.
- UI: shadcn/ui primitives first.
- Icons: Lucide for new or touched UI. Phosphor is legacy.
- Styling: Tailwind CSS v4 through CSS files using `@reference`, `@layer`, and `@apply`.
- Toasts: Sonner for backend success/error guidance.
- TypeScript closed domain values: exported `enum` whenever possible, consumed as `EnumName.VALUE`.
- React auth/profile state: `useAuth` is the only source for logged-in user profile data.
- Conditional rendering: no chained or nested ternaries, especially inside JSX.
- Shared logic: existing helpers/utils must be reused; functions used in two or more places must be extracted to a helper/util/shared module.

Do not introduce another state, form, validation, styling, or HTTP library without explicit approval.

---

## Core

| Camada | Tecnologia | Versão |
|---|---|---|
| Build | Vite | 6.4 |
| Framework | React | 19.1 |
| Linguagem | TypeScript | ~5.9 |
| Roteamento | React Router DOM | 7.9 |
| Estilo | Tailwind CSS | 4.1 |
| Package manager | pnpm | — |

## State & Data

| Responsabilidade | Biblioteca | Versão |
|---|---|---|
| Cache de servidor / queries | TanStack React Query | 5.90 |
| Estado cliente global | Zustand | 5.0 |
| HTTP client | Axios | 1.12 |
| Formulários | React Hook Form | 7.65 |
| Validação / schemas | Zod | 4.1 |

## UI

| Responsabilidade | Biblioteca | Versão |
|---|---|---|
| Componentes headless | Radix UI | 1.4 |
| Variantes de componente | class-variance-authority (CVA) | 0.7 |
| Merge de classes | clsx + tailwind-merge | — |
| Animações | Framer Motion | 12 |
| Toasts | Sonner | 2.0 |
| Temas light/dark | next-themes | 0.4 |
| Ícones (primário) | lucide-react | 0.545 |
| Ícones (legado) | @phosphor-icons/react | 2.1 |

## Componentes Especializados

| Responsabilidade | Biblioteca | Versão |
|---|---|---|
| Gráficos | Recharts | 2.15 |
| Calendário | React Big Calendar | 1.19 |
| Date picker | React Day Picker | 9.13 |
| Manipulação de datas | date-fns | 4.1 |
| Máscaras de input | react-imask | 7.6 |
| Geração de PDF | @react-pdf/renderer | 4.3 |
| QR Code | qrcode.react | 4.2 |
| Videoconferência | LiveKit client + components | 2.15 / 2.9 |
| Título HTML | react-helmet-async | 2.0 |

## Dev / Tooling

| Ferramenta | Detalhe |
|---|---|
| ESLint | `@rocketseat/eslint-config` + `eslint-plugin-simple-import-sort` |
| Tailwind no Vite | `@tailwindcss/vite` (sem postcss, sem tailwind.config.js) |
| Prettier | `prettier-plugin-tailwindcss` |

## Notas

- Tailwind CSS 4 usa `@import "tailwindcss"` no CSS — sem `tailwind.config.js`. Tokens definidos via `@theme inline` no `global.css`.
- Alias `@/` aponta para `src/` (configurado em `vite.config.ts` e `tsconfig.json`).
- SWR também está instalado (2.3) mas React Query é o padrão — SWR é considerado legado.
