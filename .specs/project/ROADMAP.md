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

## M2 — Melhorias de UX Contínuas

**Goal:** Iterações baseadas em feedback após M1

### Features

**[F10] Filtros de Período Globais** - PLANNED
- Sincronizar o seletor de período entre todos os componentes da dashboard

**[F11] Animações de Entrada** - PLANNED
- Staggered animation nos cards ao carregar (Framer Motion já instalado)

---

## Future Considerations

- Dark/light mode polishing nos novos componentes
- Export de relatório PDF direto da dashboard
- Notificações em tempo real de novos agendamentos
