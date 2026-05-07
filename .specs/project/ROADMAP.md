# Roadmap

**Current Milestone:** M1 — Dashboard Redesign
**Status:** In Progress

---

## M1 — Dashboard do Psicólogo: Redesign Completo

**Goal:** Dashboard totalmente reformulada, alinhada ao novo design, com UI/UX aprimorada e performance otimizada para hardware modesto.
**Target:** Sprint atual

### Features

**[F1] Header de Boas-vindas Contextual** - COMPLETE
**[F2] Cards de Métricas Aprimorados** - COMPLETE
**[F3] Gráfico de Volume de Sessões Melhorado** - COMPLETE (legenda visual; multi-série aguarda backend)
**[F4] Agenda de Hoje (novo componente)** - COMPLETE
**[F5] Distribuição por Faixa Etária — Horizontal Bar Chart** - COMPLETE
**[F6] Perfil de Pacientes — Donut Chart com Centro** - COMPLETE
**[F7] Ações Rápidas (novo componente)** - COMPLETE
**[F8] Layout & Grid Responsivo** - COMPLETE
**[F9] Performance & Qualidade** - COMPLETE (React.lazy, memo, useQuery, staleTime/gcTime padronizados)

---

## M2 — Auth Pages Redesign

**Goal:** Redesign completo das páginas de login e cadastro do psicólogo: dark split-panel, animações, performance e correção de bugs de hooks.
**Target:** Sprint atual

### Features

**[F10] Auth Pages Redesign** - IN PROGRESS
- Dark split-panel layout (AuthLayout overhaul)
- AuthLeftPanel com variantes por rota (sign-in vs sign-up)
- useAuthRedirect hook (extração do auth-check)
- SignInForm: dark theme + Framer Motion + React.memo
- SignUpForm: fix Rules of Hooks + dark theme + agrupamento de seções
- Remove "use client" directives (Next.js artefacts)

---

## M3 — Melhorias de UX Contínuas

**Goal:** Iterações baseadas em feedback após M1/M2

### Features

**[F11] Filtros de Período Globais** - PLANNED
- Sincronizar o seletor de período entre todos os componentes da dashboard

**[F12] Animações de Entrada na Dashboard** - PLANNED
- Staggered animation nos cards ao carregar (Framer Motion já instalado)

---

---

## M4 — Patients Management

**Goal:** Redesign completo da tela `/patients-list`: tabela compacta, ações em dropdown, filtros com UX completa, modal de cadastro em seções e performance otimizada para hardware modesto.
**Target:** Sprint seguinte

### Features

**[F13] Patients List: Redesign Completo** - SPECIFIED
- Tabela com 6 colunas compactas (Avatar+Nome, Status, Telefone, E-mail, Última Sessão, Ações)
- DropdownMenu de ações por linha (Ver / Editar / Inativar)
- Filtros: search com X + spinner, chips de filtros ativos, contador de resultados
- Modal de cadastro em 4 seções (Identificação, Contato, Dados Pessoais, Mídia)
- Performance: lazy loading de 5 modais, React Query 30s staleTime, virtualização >50 itens
- Componentes reutilizáveis padronizados: `UserAvatar` (variantes), `Item` (orientações), `PatientsDataBlock` (isLoading)
- Spec: `.specs/features/patients-list-redesign/`

---

## Future Considerations

- Dark/light mode polishing nos novos componentes
- Export de relatório PDF direto da dashboard
- Notificações em tempo real de novos agendamentos
