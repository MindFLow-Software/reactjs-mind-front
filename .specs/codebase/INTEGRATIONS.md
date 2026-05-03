# Integrations — MindFlush Frontend

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
