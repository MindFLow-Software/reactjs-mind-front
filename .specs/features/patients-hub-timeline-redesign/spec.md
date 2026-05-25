# Histórico de Sessões — Redesign

## Problem Statement

A timeline atual exibe sessões numa lista linear com cards clicáveis que abrem um dialog. O design de referência propõe uma timeline agrupada por mês, com filtros por status em chips horizontais, busca inline, e cards com layout mais rico (indicador colorido, date/time/tags, notas e status de cancelamento visíveis diretamente no card — sem dialog).

## Goals

- [ ] Barra de filtros: busca por texto + chips Todas / Realizadas / Canceladas / Faltas
- [ ] Sessões agrupadas por mês com header "MÊS AAAA — N sessões"
- [ ] Cards redesenhados: indicador colorido à esquerda, data/hora/duração/tags, ações, conteúdo inline
- [ ] Cards de sessões canceladas exibem badge de motivo e campo "MOTIVO"
- [ ] `pnpm build` passa sem erros

## Out of Scope

| Feature | Reason |
|---|---|
| Emoji/humor score | Dado não existe na API atual |
| "Online" como tag de modalidade | Não existe no modelo de dados — tag mostra `theme` |
| Período: 6 meses / Ordenar | Botões presentes visualmente, sem lógica (dado futuro) |
| Dialog de detalhe | Removido — conteúdo fica inline no card |
| Export PDF por sessão | Mantido disponível via menu ⋮ |

---

## User Stories

### P1: Filtros por status em chips ⭐ MVP

**User Story**: Como psicólogo, quero filtrar rapidamente as sessões por status (Todas, Realizadas, Canceladas, Faltas) para encontrar o que preciso sem scroll.

**Acceptance Criteria**:
1. WHEN a aba Histórico abre THEN SHALL exibir chips: Todas (N), Realizadas (N), Canceladas (N), Faltas (N) — contagens das sessões da página atual
2. WHEN clico num chip THEN SHALL filtrar as sessões exibidas por aquele status
3. WHEN digito no campo de busca THEN SHALL filtrar por texto dentro de `content` ou `theme`
4. WHEN o filtro ativo não tem resultados THEN SHALL exibir estado vazio

### P1: Timeline agrupada por mês ⭐ MVP

**User Story**: Como psicólogo, quero ver as sessões organizadas por mês com header claro ("ABRIL 2026 — 2 sessões") para navegar pela história do paciente cronologicamente.

**Acceptance Criteria**:
1. WHEN há sessões de meses diferentes THEN SHALL agrupar por mês/ano
2. WHEN renderiza um grupo THEN SHALL exibir header "MÊS AAAA" + "N sessões" à direita
3. WHEN há apenas um mês THEN SHALL exibir normalmente sem comportamento especial

### P1: Cards redesenhados com conteúdo inline ⭐ MVP

**User Story**: Como psicólogo, quero ver as notas da sessão diretamente no card, sem precisar abrir um dialog.

**Acceptance Criteria**:
1. WHEN sessão é "Concluída" THEN card SHALL exibir: círculo azul, data/hora, duração, tema como tag, "NOTAS DA SESSÃO" + content
2. WHEN sessão é "Cancelada" THEN card SHALL exibir: círculo vermelho, badge de status, "MOTIVO" + content ou "--"
3. WHEN sessão é "Pendente"/"Falta" THEN card SHALL exibir: círculo cinza/amarelo, label de status
4. WHEN content é null THEN campo de notas SHALL exibir mensagem vazia
5. WHEN hover no card THEN SHALL exibir ações: editar, copiar, ⋮

---

## Dados disponíveis vs. placeholders

| Campo | Fonte | Disponível |
|---|---|---|
| Data, hora | `sessionDate` / `date` | ✅ |
| Duração | `duration` | ✅ |
| Tema/abordagem | `theme` | ✅ (usado como tag) |
| Status | `status` | ✅ |
| Notas | `content` | ✅ |
| Modalidade (Online) | — | ❌ → omitir |
| Humor/emoji score | — | ❌ → omitir |
| Motivo cancelamento | `content` (reaproveitado) | ✅ parcial |

---

## Requirement Traceability

| ID | Story | Status |
|---|---|---|
| TL-01 | P1: Chips de filtro por status com contagem | Pending |
| TL-02 | P1: Campo de busca por texto | Pending |
| TL-03 | P1: Agrupamento por mês com header | Pending |
| TL-04 | P1: Card de sessão concluída (círculo azul + notas) | Pending |
| TL-05 | P1: Card de sessão cancelada (círculo vermelho + motivo) | Pending |
| TL-06 | P1: Ações no card (editar, copiar, ⋮) | Pending |

## Success Criteria

- [ ] Chips filtram corretamente
- [ ] Busca filtra por texto
- [ ] Agrupamento por mês correto
- [ ] Cards com layout do design de referência
- [ ] `pnpm build` limpo
