# Integrations — MindFlush Frontend

## Mandatory Integration Rules

Backend integration is contract-first. Use current backend implementation and `docs/frontend-reference/*.md` as the source of truth.

HTTP:

- All HTTP calls use `api` from `@/lib/axios`.
- No raw `fetch`, raw `axios`, or `api.*` calls outside `src/api`.
- `src/lib/axios.ts` must use `env` from `@/env`, not direct `import.meta.env`.
- Success envelope unwrapping and error extraction must be centralized.
- Backend success/error messages must be exposed so mutation hooks can show them via Sonner.
- Session endpoints may be envelope exceptions only if documented by backend references.

React Query:

- GET => `useQuery`.
- POST/PUT/PATCH/DELETE => `useMutation`.
- Query keys must be stable and typed.
- Mutations must invalidate affected queries and display backend messages.

Auth/profile data:

- Logged-in user profile data must always come from `useAuth`.
- Do not read logged-in profile data directly from `localStorage`.
- Do not duplicate profile queries or pass stale user snapshots when `useAuth` is available.

Practice context:

- Routes requiring practice context must send `x-psychologist-practice-context-id`.
- The active practice context store must be the single source for this header.

Known contract reconciliation points:

- `/psychologist/practice-context` vs `/psychologist/practice-contexts`.
- `/auth/complete-registration` and Google OAuth completion flow.
- `/patient-profiles/*` vs current patient/profile routes.
- Appointment status enum values; closed domain values must use native TypeScript `enum` and be consumed as enum members such as `AppointmentStatus.SCHEDULED`, never raw strings such as `'SCHEDULED'`.
- Any API payload, query parameter, schema default, and UI option value that represents an enum must use the enum member, for example `Honorific.MASC_DR`, not `'MASC_DR'`.
- Integration symbols must be imported from their one canonical source module. Reexports, barrel exports, and compatibility wrapper exports are forbidden.

---

## Backend (NestJS REST API)

- **Configuração**: `VITE_API_URL` em `.env`, validada via Zod em `src/env.ts`.
- **Cliente**: instância Axios em `src/lib/axios.ts` com baseURL e interceptors.
- **Padrão**: todas as chamadas HTTP passam pela instância `api` importada de `@/lib/axios`.
- **Delay de desenvolvimento**: `VITE_ENABLE_API_DELAY=true` ativa delay artificial (para simular latência).

## Cloudflare R2 (Storage)

- Upload de arquivos (avatares de psicólogos e attachments de pacientes) via endpoints do backend.
- O frontend envia multipart form data para a API NestJS, que repassa ao R2.
- Sem SDK R2 direto no frontend.

## AbacatePay (Pagamentos)

- Integração de pagamentos via API do backend.
- Sem SDK AbacatePay direto no frontend.
- Módulo financeiro no v1 é apenas UI/UX básico — sem fluxo de pagamento ativo.

## LiveKit (Videoconferência)

- **Status**: instalado, não implementado no v1.
- Dependências presentes: `livekit-client` (2.15), `@livekit/components-react` (2.9), `@livekit/components-styles`.
- Rota `/video-room` e componentes em `src/pages/app/video-room/` existem mas não são prioridade.
- Token LiveKit: `src/api/livekit.ts`.

## Temas (next-themes)

- Provider em `src/App.tsx`: `<ThemeProvider defaultTheme="light" storageKey="MindFlush-theme">`.
- Alternância light/dark via classe `.dark` no `<html>`.
- Componente de toggle: `src/components/theme/theme-toggle.tsx`.

## Variáveis de Ambiente

| Variável | Tipo | Uso |
|---|---|---|
| `VITE_API_URL` | string (URL) | Base URL da API NestJS |
| `VITE_ENABLE_API_DELAY` | `"true"` \| `"false"` | Delay artificial em dev |

Acesso via `import { env } from '@/env'` — nunca via `import.meta.env` diretamente.
