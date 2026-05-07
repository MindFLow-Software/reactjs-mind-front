# F13 — Patients List: Redesign Completo

| Campo      | Valor                                      |
|------------|--------------------------------------------|
| **ID**     | F13                                        |
| **Milestone** | M4 — Patients Management               |
| **Status** | Specified                                  |
| **Scope**  | Large (multi-componente, performance, UX)  |
| **Autor**  | PauloStraforini                            |
| **Data**   | 2026-05-06                                 |

---

## Contexto

A tela `/patients-list` funciona corretamente, mas foi construída de forma incremental e acumulou inconsistências visuais e de UX em relação ao padrão atual do app (estabelecido no redesign do dashboard e auth). Os problemas concretos são:

**Tabela:**
- 9 colunas causam densidade excessiva e scroll horizontal em telas menores
- 3 botões de ação soltos por linha (ver, editar, inativar) sem agrupamento visual
- A coluna "Última sessão" exibe apenas `null` ou data bruta — sem formatação relativa

**Filtros:**
- Search sem botão de limpar — o usuário precisa apagar manualmente
- Nenhum indicador visual de que há filtros ativos
- Sem contador de resultados ("Mostrando X de Y")
- Sem spinner durante o fetch (UX parece travada em máquinas lentas)

**Modal de Cadastro:**
- Campos em sequência plana sem agrupamento ou separadores
- Validação só dispara no submit — sem feedback em tempo real
- Botão "Salvar" sem estado de loading
- Preview do avatar só aparece depois do upload — sem preview imediato

**Componentes Reutilizáveis:**
- `UserAvatar`: sem variantes de tamanho padronizadas, sem ring de status
- `Item`: sem variante horizontal/vertical, tipografia inconsistente com o design system
- `PatientsPageShell` e `PatientsDataBlock`: espaçamentos fora do padrão do dashboard

**Performance:**
- Todos os modais carregam junto com a página (bundle único)
- Nenhum `React.memo` nas linhas da tabela — qualquer mudança re-renderiza todas
- `staleTime` de 10s inadequado — dados de pacientes raramente mudam em tempo real

---

## Fora do Escopo

- Outras telas do módulo de pacientes (`/patients-hub`, `/patients-records`, `/patients-docs`)
- Mudanças no backend / API (sem novos endpoints)
- Multi-step wizard no modal de cadastro
- Filtros avançados (por especialidade, faixa etária, período de cadastro)
- Funcionalidade de importação de pacientes em lote

---

## Requisitos

### REQ-01 — Tabela com 6 colunas compactas

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R01.1 | A tabela exibe exatamente 6 colunas: Avatar+Nome, Status, Telefone, E-mail, Última Sessão, Ações | Todas as 6 colunas visíveis sem scroll horizontal em viewport ≥ 1280px |
| R01.2 | CPF, Gênero e Idade são removidos da tabela principal e permanecem no modal de detalhes | Dados acessíveis ao abrir o modal de detalhes do paciente |
| R01.3 | A linha tem `hover:bg-muted/50` consistente com o padrão do dashboard | Hover visível em modo claro e escuro |

---

### REQ-02 — DropdownMenu de Ações por Linha

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R02.1 | Cada linha tem um único botão `MoreHorizontal` que abre um `DropdownMenu` | Dropdown abre ao clicar, fecha ao clicar fora ou pressionar Escape |
| R02.2 | O menu contém: "Ver detalhes" (ícone Search), "Editar" (ícone Pencil), separador, "Inativar"/"Reativar" (cor `text-destructive` para inativar) | Todas as opções funcionais, ação destrutiva visualmente diferenciada |
| R02.3 | "Ver detalhes" abre o modal `PatientsDetails`; "Editar" abre `RegisterPatients`; "Inativar/Reativar" abre `DeletePatientDialog` | Cada opção dispara a ação correta |

---

### REQ-03 — Coluna "Última Sessão" com Data Relativa

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R03.1 | A coluna exibe data relativa via `formatDistanceToNow` do date-fns (ex: "há 3 dias") | Formato legível em pt-BR |
| R03.2 | Hovering sobre a célula exibe `Tooltip` com a data e hora exata formatada | Tooltip visível, data correta |
| R03.3 | Quando `lastSessionAt` é `null`, exibe "Sem sessões" em `text-muted-foreground` | Texto correto quando não há sessão |

---

### REQ-04 — Badges de Status Aprimorados

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R04.1 | Badge "Ativo" usa fundo verde (`bg-emerald-500/15 text-emerald-600`) | Cor visível em modo claro e escuro |
| R04.2 | Badge "Inativo" usa fundo muted (`bg-muted text-muted-foreground`) | Contraste adequado em ambos os temas |

---

### REQ-05 — Filtros com UX Completa

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R05.1 | O search input exibe botão X (ícone `X`) integrado à direita quando há texto digitado | Clicar no X limpa o campo e reseta o filtro na URL |
| R05.2 | Durante `isFetching`, um spinner aparece dentro do search input no lugar do ícone de busca | Spinner visível durante loading, some quando termina |
| R05.3 | Exibe contador "Mostrando X de Y pacientes" abaixo dos filtros ou no footer da tabela | Contador correto e atualiza com os filtros |
| R05.4 | Botão "Limpar filtros" aparece somente quando há filtro de texto ou status ativo | Botão oculto no estado padrão; visível e funcional quando há filtros |

---

### REQ-06 — Chips de Filtros Ativos

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R06.1 | Cada filtro ativo gera um chip visual (ex: `Status: Ativo ×`) com animação de entrada via Framer Motion | Chips aparecem/desaparecem com animação `AnimatePresence` |
| R06.2 | Clicar no × do chip remove aquele filtro específico | Filtro removido, URL atualizada, lista refetchada |

---

### REQ-07 — Modal de Cadastro em Seções

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R07.1 | O modal agrupa campos em 4 seções com `Separator` e título: Identificação, Contato, Dados Pessoais, Mídia | Seções visíveis e bem separadas visualmente |
| R07.2 | Validação dispara em `onChange` (não apenas no submit) | Erros aparecem enquanto o usuário digita após o primeiro blur |
| R07.3 | O botão de salvar exibe "Salvando..." com spinner durante o submit | Estado de loading visível, botão desabilitado durante submit |

---

### REQ-08 — Upload de Avatar Aprimorado

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R08.1 | Ao selecionar ou soltar um arquivo, o preview circular é exibido imediatamente via `URL.createObjectURL` | Preview aparece antes do upload ao servidor |
| R08.2 | A zona de drag-and-drop exibe feedback visual distinto ao hover com arquivo (borda tracejada + cor de accent) | Feedback claro ao arrastar arquivo sobre a zona |

---

### REQ-09 — Componentes Reutilizáveis Padronizados

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R09.1 | `UserAvatar` aceita prop `size: "sm" \| "md" \| "lg"` com dimensões `24px / 32px / 40px` | Tamanhos corretos em todos os contextos de uso |
| R09.2 | `UserAvatar` aceita prop `showStatusRing?: boolean` que exibe anel verde (ativo) ou muted (inativo) | Ring visível quando habilitado |
| R09.3 | `Item` aceita prop `orientation: "vertical" \| "horizontal"` e usa tokens `text-sm` e `font-medium` | Ambas orientações renderizadas corretamente |
| R09.4 | `PatientsDataBlock` aceita prop `isLoading?: boolean` que exibe `Skeleton` no lugar do título | Skeleton visível durante loading |

---

### REQ-10 — Lazy Loading de Modais

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R10.1 | `RegisterPatients`, `PatientsDetails`, `DeletePatientDialog`, `EvolutionViewer` e `GenerateInviteModal` são carregados com `React.lazy` + `Suspense` | Bundle inicial da página reduzido; modais carregam ao primeiro uso |
| R10.2 | O Suspense fallback exibe um `Skeleton` do modal enquanto carrega | Sem flash de tela em branco |

---

### REQ-11 — Virtualização Condicional da Lista

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R11.1 | Quando `meta.total > 50`, a tabela usa `@tanstack/react-virtual` para renderizar apenas as linhas visíveis | Scroll suave sem jank com 100+ pacientes |
| R11.2 | A virtualização é transparente — paginação e filtros continuam funcionando normalmente | Nenhuma regressão funcional |

---

### REQ-12 — React Query Otimizado

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R12.1 | `staleTime` aumentado de 10s para 30s na query de pacientes | Query não refetch desnecessariamente a cada navegação |
| R12.2 | `gcTime` definido em 5 minutos (300s) | Cache mantido em memória por 5 min após desmonte |
| R12.3 | `select` function transforma dados no React Query para evitar re-render quando apenas meta muda | Re-renders desnecessários eliminados |

---

### REQ-13 — Empty States Contextuais

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R13.1 | Quando não há pacientes cadastrados: ícone de usuário + "Nenhum paciente cadastrado" + botão "Cadastrar primeiro paciente" | Botão abre modal de cadastro |
| R13.2 | Quando há pacientes mas o filtro não retorna resultados: ícone de busca + "Nenhum paciente encontrado para este filtro" + botão "Limpar filtros" | Botão limpa todos os filtros |

---

### REQ-14 — Acessibilidade

| ID | Requisito | Critério de aceitação |
|----|-----------|----------------------|
| R14.1 | O botão de ações (`MoreHorizontal`) tem `aria-label="Ações do paciente [nome]"` | Screen reader anuncia o contexto correto |
| R14.2 | Ícones sem texto visível nos chips e filtros têm `<span className="sr-only">` | Contexto acessível via teclado/screen reader |

---

## Dependências

- `@tanstack/react-virtual` (instalar — não está no package.json)
- `date-fns` v4 — já instalado (`formatDistanceToNow`)
- `framer-motion` — já instalado (`AnimatePresence`)
- Endpoints existentes — sem novos endpoints necessários

## Riscos

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| `React.virtual` + paginação causam conflito de altura | Média | Testar com `overscan` alto; fallback para lista normal se necessário |
| `React.memo` em rows com closures stale causando bugs | Baixa | Usar `useCallback` para todos os handlers passados como props |
| Virtualização quebra scroll do `TableBody` | Média | Usar estratégia de wrapper com altura fixa apenas quando ativo |
