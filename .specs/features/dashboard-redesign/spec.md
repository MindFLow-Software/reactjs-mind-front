# Feature Spec: Dashboard Redesign

**ID:** dashboard-redesign
**Status:** Specified — aguardando prints do design para confirmar detalhes visuais
**Scope:** Large (multi-component, novo layout, novos componentes, otimização de performance)

---

## Contexto

A dashboard atual existe em `src/pages/app/dashboard/dashboard.tsx` com 7 componentes filhos. Comparando com o design de referência, há diferenças significativas de layout, componentes ausentes e problemas de qualidade de código.

### Estado Atual

| Componente | Status |
|---|---|
| `PatientsAmountCard` | Usa `useState+useEffect` (sem cache) |
| `MonthPatientsAmountCard` | Usa `useQuery` ✓ |
| `TotalWorkHoursCard` | Usa `useState+useEffect` (sem cache) |
| `SessionsBarChart` | Usa `useQuery` ✓, série única |
| `NewPatientsBarChart` | Precisa verificar |
| `PatientsByAgeChart` | Donut chart (design pede horizontal bars) |
| `PatientsByGenderChart` | Donut sem total central |
| Header de boas-vindas | **AUSENTE** |
| Agenda de hoje | **AUSENTE** |
| Ações rápidas | **AUSENTE** |
| Seletor global de período | **AUSENTE** |

---

## Requisitos

### REQ-01: Header de Boas-vindas
- **O que:** Linha de saudação dinâmica ("Bom dia / Boa tarde / Boa noite, [nome]")
- **Onde:** Topo da página, antes dos cards
- **Dados:** Nome do psicólogo (via `useProfileStore` ou `useQuery` para `/profile`), data atual em pt-BR, contagem de sessões do dia
- **Aceite:** Saudação muda conforme hora; data no formato "Segunda-feira, 20 de abril de 2026"; contador "X sessões hoje"

### REQ-02: Cards de Métricas com Trends
- **REQ-02a:** Card "Pacientes ativos" — exibe total + badge delta "+N vs. 30 dias anteriores" em verde
- **REQ-02b:** Card "Sessões no mês" — exibe total + badge "+N% vs. mês anterior" em verde/vermelho
- **REQ-02c:** Card "Horas atendidas" — exibe horas formatadas + indicador vs. meta mensal (ex: "— meta mensal: 80h")
- **Todos os cards:** Migrar para `useQuery` com `staleTime: 5min`
- **Ícones:** Manter ícones superiores direitos em estilo outline (azul, verde, laranja/roxo)
- **Aceite:** Skeleton durante loading; error state com retry; trend badge visível

### REQ-03: Gráfico de Volume de Sessões
- **O que:** Bar chart com séries Concluídas (azul escuro), Remarcadas (azul claro), Canceladas (cinza)
- **Seletor:** 7 dias / 30 dias / 90 dias / Ano — posicionado no header do card
- **Tooltip:** pt-BR, mostra todas as séries
- **Aceite:** Período padrão 30 dias; legenda com 3 dots coloridos; dados do endpoint existente

### REQ-04: Agenda de Hoje
- **O que:** Card lateral com lista de agendamentos do dia atual
- **Campos por item:** Horário (HH:mm), duração ("50 min"), nome do paciente, tipo ("Retorno", "1ª consulta", "Avaliação"), modalidade ("Online", "Presencial"), badge de status
- **Status badges:**
  - `FINISHED` → "Concluída" (fundo cinza, texto escuro)
  - `SCHEDULED` → "Confirmada" (fundo verde claro, texto verde)
  - `ATTENDING` → "Em andamento" (fundo azul claro, texto azul)
  - `RESCHEDULED` → "Remarcada" (fundo amarelo/laranja claro)
  - `NOT_ATTEND` / `CANCELED` → "Cancelada" (fundo vermelho claro)
  - Aguardando confirmação → "Aguardando" (fundo amarelo, texto âmbar)
- **Cabeçalho:** "Agenda de hoje", data do dia, "X sessões", link "Ver tudo →"
- **Fonte de dados:** `fetchAppointments` com filtro por data de hoje
- **Aceite:** Lista vazia mostra estado empty; máximo ~6 itens visíveis; scroll se necessário

### REQ-05: Distribuição por Faixa Etária — Horizontal Bars
- **O que:** Substituir donut chart por barras horizontais empilhadas
- **Layout:** Label da faixa etária à esquerda, barra no meio, número à direita
- **Faixas:** 0–17, 18–25, 26–35, 36–50, 51+
- **Cor:** Barra azul primário (`--accent-blue`), fundo barra = muted
- **Aceite:** Sem animação pesada; valores absolutos visíveis; responsive

### REQ-06: Perfil por Gênero — Donut com Total Central
- **O que:** Donut chart com número total de pacientes no centro
- **Centro:** número + "pacientes" abaixo
- **Legenda:** Lista vertical com dot colorido, nome do gênero, percentual
- **Layout:** 2 colunas dentro do card (chart | legenda)
- **Aceite:** Total centralizado visível; percentuais somam 100%

### REQ-07: Ações Rápidas
- **O que:** Card com grid 2x2 de botões de atalho
- **Botões:** "Novo paciente / Cadastrar", "Agendar / Nova sessão", "Anamnese / Nova", "Sala / Iniciar"
- **Visual:** Cada botão com ícone (outline, tamanho médio), título bold, subtítulo muted
- **Navegação:** Cada botão leva à rota correspondente
- **Aceite:** 4 botões visíveis; hover state; navegação funcional

### REQ-08: Layout Responsivo de 2 Colunas
- **Desktop (lg+):** Coluna esquerda (gráficos + cards), coluna direita (agenda + ações rápidas)
- **Tablet/Mobile:** Stack vertical, agenda antes das ações rápidas
- **Seletor de período global:** Header da página, alinha direita, persiste em todos os componentes
- **Aceite:** Sem overflow horizontal em 1280px; mobile funcional em 375px

### REQ-09: Performance
- **REQ-09a:** `React.lazy` + `Suspense` nos componentes de chart (SessionsBarChart, PatientsByAgeChart, PatientsByGenderChart, NewPatientsBarChart)
- **REQ-09b:** `React.memo` nos componentes que recebem props estáveis (cards de métrica)
- **REQ-09c:** `useMemo` nos cálculos de `chartData` e `totalSessions` (já existem em alguns, padronizar)
- **REQ-09d:** `staleTime: 5 * 60 * 1000` + `gcTime: 10 * 60 * 1000` em todos os `useQuery` da dashboard
- **REQ-09e:** Eliminar `useState+useEffect` manual nos cards — usar `useQuery`
- **REQ-09f:** Fallback Skeleton para `Suspense` boundaries
- **Aceite:** First paint da dashboard sem Recharts bloqueando; FCP melhorado em hardware lento

---

## Fora de Escopo

- Mudanças em outras páginas (pacientes, agenda, finanças)
- Backend — apenas consome endpoints existentes
- Autenticação / permissões
- Testes automatizados (nenhum setup de teste no projeto)

---

## Dependências

- Endpoint `GET /appointments` com filtro de data (já existe)
- Endpoint `GET /profile` para nome do psicólogo (já existe via `useProfileStore` / `get-profile.ts`)
- Todos os outros endpoints de dashboard já existem

---

## Riscos

- **R1:** O design de referência pode conter detalhes ainda não compartilhados — aguardando prints adicionais
- **R2:** Endpoint de "meta mensal de horas" pode não existir no backend — fallback para valor fixo configurable
- **R3:** `React.lazy` com Recharts pode causar flicker em conexões lentas — mitigar com Skeleton de altura fixa
