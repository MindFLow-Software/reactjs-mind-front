# State — MindFlush Frontend

## Decisions

- Autenticação via `localStorage` (`isAuthenticated`, `user`) — decisão consciente para MVP, sem JWT httpOnly cookie por ora.
- Tailwind CSS 4 (não v3) — configuração via CSS (`@import "tailwindcss"`) em vez de `tailwind.config.js`.
- LiveKit instalado mas sem implementação intencional no v1 — dependência presente, não deve ser ativada.
- Financeiro v1 = apenas UI básica, sem lógica de negócio completa.

## Deferred Ideas

- LinkedIn OAuth (pós-v1)
- Videochamadas LiveKit (pós-v1)
- Features com IA (pós-v1)
- Módulo financeiro completo (pós-v1)
- PWA / mobile-first (avaliar após MVP)

## Preferences

- Telas padronizadas com alta qualidade visual são prioridade — consistência do design system antes de novas features.

## Blockers

*(nenhum registrado)*

## Todos

- [ ] Padronizar todas as telas do v1 com o design system
- [ ] Completar CRUDs de pacientes e agendamentos
- [ ] Preparar demo para investidores (4–5 meses)
