# Tasks: Dashboard Redesign

**Feature:** dashboard-redesign
**Status:** COMPLETE — build passando, 0 erros TS

---

## Ordem de Execução

```
T1 → T2 → T3 (paralelo com T4, T5, T6, T7) → T8 → T9
```

---

## T1 — Migrar Cards para useQuery + Trend Badges

**REQ:** REQ-02a, REQ-02b, REQ-02c, REQ-09e
**Arquivos:**
- `src/pages/app/dashboard/components/patients-amount-card.tsx`
- `src/pages/app/dashboard/components/total-work-hours-card.tsx`
- `src/pages/app/dashboard/components/month-patients-amount-card.tsx`

**O que fazer:**
1. Substituir `useState+useEffect` manual por `useQuery` em `PatientsAmountCard` e `TotalWorkHoursCard`
2. Adicionar `staleTime: 5 * 60 * 1000` e `gcTime: 10 * 60 * 1000` em todos os queries
3. Adicionar trend badge no `PatientsAmountCard`: delta numérico "+ N vs. 30 dias anteriores"
4. Adicionar trend badge no `MonthPatientsAmountCard`: percentual "▲ +N% vs. mês anterior"
5. Adicionar indicador de meta no `TotalWorkHoursCard`: "— meta mensal: 80h"
6. Adicionar ícone no canto superior direito de cada card (estilo outline, colorido por tema do card)
7. Wrap com `React.memo`

**Done when:**
- Nenhum `useState+useEffect` manual nos 3 cards
- Badge de trend visível com dados mockados/reais
- Skeleton durante loading; error state com retry

---

## T2 — Header de Boas-vindas

**REQ:** REQ-01
**Arquivo:** `src/pages/app/dashboard/components/dashboard-header.tsx` (NOVO)

**O que fazer:**
1. Criar componente `DashboardHeader`
2. Saudação dinâmica por hora: "Bom dia" (5–11h), "Boa tarde" (12–17h), "Boa noite" (18–4h) + nome via `useQuery` para perfil
3. Data formatada: `EEEE, d 'de' MMMM 'de' yyyy` com `date-fns/ptBR`
4. Contador "X sessões hoje" via `fetchAppointments` filtrado pelo dia
5. Seletor de período global: botões "7 dias | 30 dias | 90 dias | Ano" alinhados à direita

**Done when:**
- Saudação correta por faixa de horário
- Data em pt-BR visível
- Seletor de período renderiza os 4 botões com estado ativo

---

## T3 — Agenda de Hoje

**REQ:** REQ-04
**Arquivo:** `src/pages/app/dashboard/components/today-agenda.tsx` (NOVO)

**O que fazer:**
1. Criar `TodayAgenda` component
2. Buscar agendamentos do dia via `fetchAppointments` com `scheduledAt` entre `startOfDay` e `endOfDay` de hoje
3. Renderizar lista: horário, duração, nome do paciente, tipo de consulta, modalidade, badge de status
4. Implementar mapa de status → badge (ver REQ-04)
5. Link "Ver tudo →" aponta para `/appointments`
6. Estado empty: ícone + "Nenhuma sessão hoje"
7. Cabeçalho: título + data + "X sessões"

**Done when:**
- Lista renderiza corretamente com dados da API
- Badges de status com cores corretas
- Estado vazio exibido quando não há sessões
- Link "Ver tudo" funcional

---

## T4 — Gráfico de Volume de Sessões Multi-série [P]

**REQ:** REQ-03
**Arquivo:** `src/pages/app/dashboard/components/sessions-chart.tsx`

**O que fazer:**
1. Adicionar séries Remarcadas e Canceladas ao `BarChart` (além de Concluídas)
2. Adicionar "Ano" ao seletor de período (além de 7d/30d/90d)
3. Adicionar legenda com 3 dots: Concluídas (azul escuro), Remarcadas (azul claro), Canceladas (cinza)
4. Manter `useMemo` já existente; adicionar `React.memo`
5. Verificar se a API retorna as 3 séries ou se precisa de processamento client-side

**Done when:**
- 3 séries visíveis no chart com cores distintas
- Seletor com 4 opções funciona
- Legenda renderiza corretamente

---

## T5 — Faixa Etária: Substituir Donut por Horizontal Bars [P]

**REQ:** REQ-05
**Arquivo:** `src/pages/app/dashboard/components/patients-by-age-chart.tsx`

**O que fazer:**
1. Remover `PieChart/Pie` do componente
2. Implementar barras horizontais usando apenas divs + Tailwind (sem Recharts para este chart — mais leve)
3. Layout: `[label] [barra_preenchida/barra_fundo] [número]`
4. Barra usa `--accent-blue`; fundo usa `bg-muted`
5. `React.memo` + `useMemo` para o cálculo das larguras

**Done when:**
- Barras horizontais visíveis com 5 faixas etárias
- Largura de cada barra proporcional ao total
- Valores numéricos à direita de cada barra

---

## T6 — Donut de Gênero com Total Central [P]

**REQ:** REQ-06
**Arquivo:** `src/pages/app/dashboard/components/patients-by-gender-chart.tsx`

**O que fazer:**
1. Adicionar `label` customizado no centro do `Pie` com total + "pacientes"
2. Migrar legenda de grid 2x2 para lista vertical com percentuais
3. Layout 2 colunas dentro do `CardContent`: chart (60%) | legenda (40%)
4. `React.memo`

**Done when:**
- Total visível no centro do donut
- Legenda vertical com dot + nome + percentual
- Layout 2 colunas em desktop

---

## T7 — Ações Rápidas [P]

**REQ:** REQ-07
**Arquivo:** `src/pages/app/dashboard/components/quick-actions.tsx` (NOVO)

**O que fazer:**
1. Criar `QuickActions` com Card + grid 2x2
2. Botões: "Novo paciente/Cadastrar" → `/patients/new`, "Agendar/Nova sessão" → `/appointments`, "Anamnese/Nova" → `/patients`, "Sala/Iniciar" → `/video-room`
3. Cada botão: ícone Lucide outline, título bold, subtítulo muted-foreground
4. `hover:bg-muted/50 transition-colors`

**Done when:**
- 4 botões visíveis em grid 2x2
- Cada botão navega para a rota correta
- Hover state visível

---

## T8 — Layout Geral da Dashboard + React.lazy

**REQ:** REQ-08, REQ-09a, REQ-09b, REQ-09f
**Arquivo:** `src/pages/app/dashboard/dashboard.tsx`

**O que fazer:**
1. Reestruturar layout para 2 colunas em `lg`: `grid lg:grid-cols-[1fr_340px]`
2. Coluna esquerda: `DashboardHeader` + cards de métricas + gráficos
3. Coluna direita: `TodayAgenda` + `QuickActions`
4. Lazy load dos charts: `React.lazy(() => import('./components/sessions-chart'))`
5. `Suspense` com `fallback` de Skeleton de altura fixa para cada chart
6. Passar `selectedPeriod` do seletor global para todos os componentes como prop

**Done when:**
- Layout 2 colunas em telas lg+
- Stack vertical em mobile
- Charts carregam de forma lazy sem bloquear FCP
- Skeletons visíveis durante carregamento inicial

---

## T9 — Validação Final

**REQ:** Todos
**O que fazer:**
1. Verificar layout em 375px, 768px, 1280px, 1440px
2. Verificar estados: loading, error, empty, data
3. Verificar navegação dos botões de ações rápidas
4. Verificar seletor de período global propagando para charts
5. Checar console por warnings/erros

**Done when:**
- Nenhum overflow em nenhuma breakpoint
- Todos os estados de UI corretos
- Sem erros no console
