# patients-hub UI Redesign — Specification

## Problem Statement

A página de detalhes do paciente tem um cabeçalho minimalista (só avatar + nome + ID) e uma aba "Dados Cadastrais" com campos empilhados sem estrutura visual clara. O design de referência propõe um cabeçalho rico com stats horizontais e uma aba de dados dividida em cards temáticos lado a lado ("mais horizontal").

## Goals

- [ ] Cabeçalho do paciente exibe stats (sessões, última sessão, presença, próxima) e meta-linha (idade, gênero, ID) em layout horizontal
- [ ] Aba "Dados Cadastrais" exibe dois cards side-by-side: **Identificação** e **Atendimento**
- [ ] Layout permanece responsivo (stack em mobile)
- [ ] `pnpm build` passa sem erros

## Out of Scope

| Feature | Reason |
|---|---|
| Campos de Atendimento (modalidade, frequência, valor, indicação, terapeuta, início) | Não existem na API atual — card renderiza com `--` como placeholder |
| Endereço | Não existe na API atual — seção renderiza vazia com CTA "Adicionar agora" |
| Funcionalidade "Nova Sessão" | Só UI do botão, sem lógica nova |
| Funcionalidade "Editar" nos cards | Botões presentes mas sem handler |
| Stats de Presença e Próxima Sessão | Não existem na API — exibir "—" e "Sem agendamento" |

---

## User Stories

### P1: Redesign do cabeçalho do paciente ⭐ MVP

**User Story**: Como psicólogo, quero ver num relance o resumo do paciente (stats + identidade) no topo da página, para não precisar navegar entre abas para informações básicas.

**Acceptance Criteria**:

1. WHEN a página carrega THEN o cabeçalho SHALL exibir: avatar, nome completo, badge de status, meta-linha (idade · gênero · ID com copy), e 4 stat chips horizontais
2. WHEN `meta.totalCount` está disponível THEN o stat "Sessões" SHALL exibir o número correto
3. WHEN há sessões THEN "Última Sessão" SHALL exibir a data da sessão mais recente em formato relativo
4. WHEN não há próxima sessão (dado indisponível) THEN SHALL exibir "Sem agendamento"
5. WHEN a tela é < md THEN os stats SHALL empilhar em grid 2×2

**Independent Test**: Abrir qualquer paciente com sessões e verificar que o cabeçalho exibe nome, badge, meta-linha e os 4 stat chips.

---

### P1: Dados Cadastrais em dois cards side-by-side ⭐ MVP

**User Story**: Como psicólogo, quero ver os dados de identificação e de atendimento lado a lado em cards distintos, com labels em uppercase pequeno e valores em destaque, para leitura mais rápida ("mais horizontal").

**Acceptance Criteria**:

1. WHEN a aba "Dados Cadastrais" está ativa THEN SHALL renderizar dois cards lado a lado: "Identificação" (esquerda) e "Atendimento" (direita)
2. WHEN a tela é < lg THEN os dois cards SHALL empilhar verticalmente
3. WHEN um campo não tem valor THEN SHALL exibir um CTA em azul "Adicionar X" no estilo do design
4. WHEN os campos de Atendimento não existem na API THEN SHALL exibir `--` ou CTA placeholder

**Independent Test**: Abrir aba "Dados Cadastrais" de qualquer paciente e ver dois cards lado a lado com campos rotulados.

---

## Dados disponíveis vs. placeholders

| Campo | Fonte | Disponível |
|---|---|---|
| Nome, Gênero, Idade, Nasc., CPF, Telefone, E-mail | `PatientDetailsData` | ✅ |
| Sessões (total) | `meta.totalCount` | ✅ |
| Última sessão | `sessions[sessions.length-1].sessionDate` | ✅ (se houver sessões) |
| Presença % | — | ❌ → "--" |
| Próxima sessão | — | ❌ → "Sem agendamento" |
| Modalidade, Frequência, Valor, Indicação, Terapeuta, Início | — | ❌ → "--" |

---

## Requirement Traceability

| ID | Story | Status |
|---|---|---|
| HUB-UI-01 | P1: Meta-linha (idade · gênero · ID) no cabeçalho | Pending |
| HUB-UI-02 | P1: 4 stat chips horizontais no cabeçalho | Pending |
| HUB-UI-03 | P1: Actions (Exportar, Nova Sessão, ⋮) integradas ao cabeçalho | Pending |
| HUB-UI-04 | P1: Card "Identificação" com campos existentes | Pending |
| HUB-UI-05 | P1: Card "Atendimento" com placeholders para dados futuros | Pending |

## Success Criteria

- [ ] Cabeçalho exibe stats horizontais e meta-linha com dado real do paciente
- [ ] Aba "Dados Cadastrais" exibe dois cards lado a lado
- [ ] Nenhum erro de tipo: `pnpm build` passa limpo
