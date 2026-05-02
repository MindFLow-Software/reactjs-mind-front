# MindFlush — Frontend

**Vision:** Plataforma de gestão clínica completa para psicólogos brasileiros — controle de pacientes, agendamentos e financeiro num único produto.
**For:** Psicólogo autônomo ou de pequena clínica que hoje usa planilha, papel ou ferramentas genéricas (Google Calendar, Excel).
**Solves:** Fragmentação de ferramentas e falta de um sistema especializado que unifique agenda, prontuário e recebimentos.

## Goals

- **MVP funcional em 4–5 meses:** Todas as telas padronizadas com alta qualidade visual, CRUDs de pacientes e agendamentos prontos para demo a investidores.
- **Qualidade visual consistente:** Design system coeso em 100% das telas — sem inconsistências de componentes, espaçamento ou tipografia.

## Tech Stack

**Core:**

- Framework: Vite 6 + React 19
- Language: TypeScript ~5.9
- Styling: Tailwind CSS 4
- Package manager: pnpm

**Key dependencies:**

- `react-router-dom` v7 — roteamento client-side com loaders e guards
- `@tanstack/react-query` v5 — cache e sincronização de estado servidor
- `zustand` v5 — estado global client-side
- `react-hook-form` + `zod` v4 — formulários tipados com validação
- `axios` — cliente HTTP para a REST API do backend
- `@radix-ui/*` + `shadcn/ui` — primitivos acessíveis de UI
- `recharts` — gráficos do dashboard
- `sonner` — notificações toast
- `framer-motion` — animações

**Backend (separado):** NestJS 11 + Prisma + PostgreSQL + Redis + RabbitMQ (Clean Architecture + DDD)

## Scope

**v1 inclui:**

- Landing page pública
- Autenticação (sign-in / sign-up de psicólogos)
- Dashboard principal com métricas e gráficos
- Módulo de pacientes: listagem, cadastro, prontuário (anamnese), documentos e hub de detalhes
- Módulo de agendamentos: lista, calendário, disponibilidade e sala de vídeo (LiveKit — instalado, não priorizado)
- Módulo financeiro: UI básica com cards de métricas e gráficos
- Conta do psicólogo: perfil e upload de avatar
- Área admin (SUPER_ADMIN): aprovações, dashboard admin, gestão de sugestões
- Sistema de sugestões de feature pelos usuários

**Explicitamente fora do escopo do v1:**

- LinkedIn OAuth
- Videochamadas via LiveKit (dependência instalada, sem implementação intencional)
- Features com IA
- Funcionalidades financeiras avançadas (apenas UI básica no v1)

## Constraints

- Timeline: 4–5 meses para MVP com qualidade para apresentação a investidores
- Technical: SPA client-side (Vite), sem SSR; autenticação via `localStorage` (token + flags)
- Resources: Time pequeno / desenvolvimento solo
