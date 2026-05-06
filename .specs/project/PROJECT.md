# MindFLush — Plataforma para Psicólogos

## Visão

Uma plataforma web completa para psicólogos gerenciarem pacientes, sessões, prontuários e finanças — com foco em clareza visual, performance e fluxo de trabalho eficiente.

## Goals

- Dar ao psicólogo uma visão 360° de sua clínica em tempo real
- Reduzir fricção no agendamento, prontuário e atendimento online
- Rodar com qualidade em hardware modesto (computadores de entrada)
- Manter consistência visual com o design system interno (shadcn/ui + Tailwind v4)

## Stack

- React 19 + Vite 6 + TypeScript
- Tailwind CSS v4 + shadcn/ui (Radix UI)
- TanStack Query v5 (data fetching / cache)
- Recharts v2 (gráficos)
- React Router v7
- Zustand (state global leve)
- LiveKit (video sessions)
- date-fns v4, Framer Motion

## Usuários

- **Psicólogo(a)**: usuário principal — acessa dashboard, pacientes, agenda, prontuários, videoconferência
- **Admin**: moderação de aprovações e sugestões (painel separado)
