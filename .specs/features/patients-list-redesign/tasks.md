# F13 — Tasks: Patients List Redesign

**Status geral:** Em andamento  
**Milestone:** M4 — Patients Management  
**Data de início:** 2026-05-06  
**Última atualização:** 2026-05-06

---

## Grafo de Dependências

```
T1 (UserAvatar) ──────────────────────────────────────────────┐
T2 (Item + Shell + DataBlock) ─────────────────────────────── ├──→ T5 (Filtros) ──→ T9 (Empty states)
T3 (TableRow: DropdownMenu + memo) ──→ T4 (Table: header+skel) ┘         ↑
T6 (Modal de Cadastro) ─────────────────────────────── independente   T7 (React Query + Lazy)
T8 (Virtualização) ──────────────────────── depende de T3 e T4
T10 (Validate) ──────────────────────────── depende de todos
```

**Pode rodar em paralelo:** T1, T2, T3, T6  
**Sequencial obrigatório:** T4 após T3; T5 após T2; T7 após T3; T8 após T4; T9 após T5; T10 por último

---

## T1 — Refatorar `UserAvatar`

**Arquivo:** `src/components/user-avatar.tsx`  
**Reqs:** R09.1, R09.2  
**Status:** `[x]`

- [x] Adicionar prop `size: "sm" | "md" | "lg"` com variantes via `cva()`:
  - `sm` → `h-6 w-6 text-[10px]`
  - `md` → `h-8 w-8 text-xs` (default)
  - `lg` → `h-10 w-10 text-sm`
- [x] Adicionar prop opcional `showStatusRing?: boolean` e `isActive?: boolean`:
  - `isActive=true` → `ring-2 ring-emerald-500 ring-offset-1`
  - `isActive=false` → `ring-2 ring-muted-foreground/40 ring-offset-1`
- [x] Manter comportamento de fallback com iniciais (sem regressão)
- [x] Verificar todos os usos de `UserAvatar` na app — passar `size` adequado onde necessário

**Verificação:** Avatar renderiza em 3 tamanhos corretos; ring de status aparece em modo claro e escuro.

---

## T2 — Refatorar `Item`, `PatientsPageShell` e `PatientsDataBlock`

**Arquivos:**
- `src/components/ui/item.tsx`
- `src/pages/app/patients/components/patients-page-shell.tsx`
- `src/pages/app/patients/components/patients-data-block.tsx`

**Reqs:** R09.3, R09.4  
**Status:** `[x]`

**Item:**
- [x] Adicionar `ItemField` com prop `orientation: "vertical" | "horizontal"` (default: `vertical`)
- [x] Horizontal: `flex flex-row items-center gap-2`; Vertical: `flex flex-col gap-0.5`
- [x] Label usa `text-xs text-muted-foreground`; Valor usa `text-sm font-medium`

**PatientsPageShell:**
- [x] Padronizar padding da surface para `p-4 md:p-6` (consistente com cards do dashboard)
- [x] Substituir inline style por `border-l-4 border-primary`

**PatientsDataBlock:**
- [x] Adicionar prop `isLoading?: boolean`
- [x] Quando `isLoading=true`, exibir `<Skeleton className="h-5 w-32" />` no lugar do título

**Verificação:** `ItemField` renderiza ambas as orientações; `PatientsDataBlock` exibe skeleton quando `isLoading=true`.

---

## T3 — Refatorar `PatientsTableRow` — 6 colunas + DropdownMenu + memo

**Arquivo:** `src/pages/app/patients/patients-list/components/patients-table-row.tsx`  
**Reqs:** R01.1, R01.2, R01.3, R02.1, R02.2, R02.3, R03.1, R03.2, R03.3, R04.1, R04.2  
**Status:** `[x]`

- [x] Envolver o componente em `React.memo`
- [x] Converter handlers de modal para `useCallback` (`handleOpenDetails`, `handleOpenEdit`, `handleOpenDelete`, `handleNavigate`)
- [x] Remover colunas: CPF, Gênero, Idade (total: 9 → 6 colunas)
- [x] Nova célula Avatar+Nome: `UserAvatar` com `size="md"` + nome completo em `font-semibold text-sm`
- [x] Badge de status: Ativo = `bg-emerald-500/15 text-emerald-600`; Inativo = `bg-muted text-muted-foreground`
- [x] Nova célula "Última Sessão":
  - Valor: `formatDistanceToNow` com `addSuffix: true, locale: ptBR`
  - Null: `<span className="text-xs text-muted-foreground">Sem sessões</span>`
  - Envolver em `<Tooltip>` com data exata (`dd/MM/yyyy 'às' HH:mm`)
- [x] Substituir 4 botões soltos por `DropdownMenu` com trigger `MoreHorizontal`
  - `aria-label="Ações do paciente {firstName} {lastName}"`
  - Item "Ver detalhes" → `handleOpenDetails`
  - Item "Prontuário completo" → `handleNavigate`
  - Item "Editar" → `handleOpenEdit`
  - `DropdownMenuSeparator`
  - Item "Inativar/Reativar" → `handleOpenDelete` com `text-destructive focus:text-destructive`
- [x] `hover:bg-muted/50 transition-[background-color,border-color]` na `<TableRow>` (já existia, mantido)

**Verificação:** Linha renderiza 6 colunas; dropdown abre/fecha; todas as ações disparam corretamente.

---

## T4 — Refatorar `PatientsTable` — Header 6 colunas + skeleton atualizado

**Arquivo:** `src/pages/app/patients/patients-list/components/patients-table.tsx`  
**Reqs:** R01.1  
**Depende de:** T3  
**Status:** `[ ]`

- [ ] Atualizar `<TableHead>` para 6 colunas: Avatar+Nome / Status / Telefone / E-mail / Última Sessão / Ações
- [ ] Aplicar larguras de coluna via `className` (conforme design.md)
- [ ] Colunas E-mail e Última Sessão com `hidden md:table-cell` para responsividade mobile
- [ ] Atualizar skeleton de loading: 6 células por linha (remover células de CPF, Gênero, Idade)

**Verificação:** Header com 6 colunas; skeleton com 6 colunas; sem scroll horizontal em viewport 1280px.

---

## T5 — Refatorar `PatientsTableFilters` + criar `ActiveFilterChips`

**Arquivos:**
- `src/pages/app/patients/patients-list/components/patients-table-filters.tsx`
- `src/pages/app/patients/patients-list/components/active-filter-chips.tsx` (novo)

**Reqs:** R05.1, R05.2, R05.3, R05.4, R06.1, R06.2  
**Depende de:** T2 (padronização de tokens)  
**Status:** `[ ]`

**Search input:**
- [ ] Mostrar ícone `Search` no lado esquerdo quando não há texto
- [ ] Mostrar `Loader2` com `animate-spin` quando `isFetching=true`
- [ ] Mostrar botão com ícone `X` no lado direito quando `filter !== ""`; clicar limpa o filtro e o searchParams

**Contador de resultados:**
- [ ] Exibir `"Mostrando {perPage × pageIndex + 1}–{min(total, perPage × (pageIndex+1))} de {total} pacientes"` ou simplificado: `"X de Y pacientes"`
- [ ] Posição: acima da tabela, alinhado à direita ou abaixo dos chips

**Limpar filtros:**
- [ ] Botão com ícone `FilterX` aparece somente se `filter !== "" || status !== "all"`
- [ ] Clicar reseta `filter` e `status` para defaults na URL

**ActiveFilterChips (novo componente):**
- [ ] Recebe `filter`, `status`, callbacks `onClearFilter`, `onClearStatus`
- [ ] Usa `AnimatePresence` com `motion.span` para cada chip ativo
- [ ] Chip de texto: `"Busca: {filter} ×"`
- [ ] Chip de status: `"Status: Ativo ×"` ou `"Status: Inativo ×"`

**Verificação:** Chips aparecem/desaparecem com animação; spinner aparece durante fetch; X no input funciona; contador correto.

---

## T6 — Refatorar Modal de Cadastro

**Arquivos:**
- `src/pages/app/patients/patients-list/register-patients/register-patients.tsx`
- `src/pages/app/patients/patients-list/register-patients/patient-avatar-upload.tsx`

**Reqs:** R07.1, R07.2, R07.3, R08.1, R08.2  
**Status:** `[ ]`

**register-patients.tsx:**
- [ ] Envolver conteúdo do Dialog em `<ScrollArea className="max-h-[80vh]">`
- [ ] Adicionar 4 seções com `<Separator />` e `<p className="text-xs font-semibold uppercase text-muted-foreground">`:
  - "Identificação" → primeiro nome, sobrenome, CPF, gênero
  - "Contato" → telefone
  - "Dados Pessoais" → data de nascimento
  - "Mídia" → avatar, anexos
- [ ] Trocar `mode: "onSubmit"` para `mode: "onChange"` no `useForm`
- [ ] Botão de submit: quando `isSubmitting`, exibir `<Loader2 className="mr-2 h-4 w-4 animate-spin" />` + "Salvando..."; `disabled={isSubmitting}`

**patient-avatar-upload.tsx:**
- [ ] Ao selecionar arquivo via `<input>` ou DnD: gerar `URL.createObjectURL(file)` e exibir no `<Avatar>` circular imediatamente
- [ ] Zona de DnD: ao arrastar arquivo sobre ela, aplicar `border-primary/60 bg-primary/5` (via `dragOver` state)
- [ ] Ao soltar o arquivo, limpar o estado de dragOver

**Verificação:** Formulário em seções visíveis; erro de campo aparece ao digitar; botão mostra loading; preview do avatar aparece imediatamente.

---

## T7 — Performance: React Query + Lazy Loading

**Arquivo:** `src/pages/app/patients/patients-list/patients-list.tsx`  
**Reqs:** R10.1, R10.2, R12.1, R12.2, R12.3  
**Depende de:** T3 (modais precisam existir com exports corretos)  
**Status:** `[ ]`

**React Query:**
- [ ] `staleTime`: `10_000` → `30_000`
- [ ] Adicionar `gcTime: 300_000`
- [ ] Adicionar `select: (data) => ({ patients: data.patients, meta: data.meta })`
- [ ] Passar `isFetching` para `PatientsTableFilters`

**Lazy loading:**
- [ ] `const RegisterPatients = lazy(() => import(...))`
- [ ] `const PatientsDetails = lazy(() => import(...))`
- [ ] `const DeletePatientDialog = lazy(() => import(...))`
- [ ] `const EvolutionViewer = lazy(() => import(...))`
- [ ] `const GenerateInviteModal = lazy(() => import(...))`
- [ ] Envolver cada modal em `<Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>`

**Verificação:** Network tab mostra chunks separados para os modais; sem erros de TypeScript; modais carregam ao primeiro uso.

---

## T8 — Virtualização Condicional

**Arquivo:** `src/pages/app/patients/patients-list/components/patients-table.tsx`  
**Reqs:** R11.1, R11.2  
**Depende de:** T4  
**Status:** `[ ]`

- [ ] Instalar `@tanstack/react-virtual` — confirmar com o usuário antes
- [ ] Adicionar `ref={tableContainerRef}` no wrapper da tabela com `overflow-auto`
- [ ] Criar `useVirtualizer` com `estimateSize: () => 56` e `overscan: 5`
- [ ] Condição `meta.total > 50`: renderizar `rowVirtualizer.getVirtualItems()` com `position: absolute, top` em cada row
- [ ] Condição `meta.total <= 50`: renderizar `patients.map(...)` normalmente (sem overhead de virtual)
- [ ] Testar paginação + filtros com virtualização ativa

**Verificação:** Scroll suave com 100 itens; paginação funciona; filtros funcionam; sem regressão com < 50 itens.

---

## T9 — Empty States Contextuais + Acessibilidade

**Arquivo:** `src/pages/app/patients/patients-list/components/patients-table.tsx`  
**Reqs:** R13.1, R13.2, R14.1, R14.2  
**Depende de:** T5  
**Status:** `[ ]`

**Empty states:**
- [ ] Quando `patients.length === 0 && !filter && status === "all"`:
  - Ícone `UserPlus` grande + "Nenhum paciente cadastrado ainda" + `<Button>Cadastrar primeiro paciente</Button>`
- [ ] Quando `patients.length === 0 && (filter || status !== "all")`:
  - Ícone `SearchX` + "Nenhum paciente encontrado para este filtro" + `<Button variant="outline">Limpar filtros</Button>`

**Acessibilidade:**
- [ ] Botão de ações (DropdownMenu trigger): confirmar `aria-label` aplicado em T3
- [ ] Ícones sem texto em chips e filtros: `<span className="sr-only">Remover filtro</span>` em botões X
- [ ] Verificar navegação por teclado: Tab → Enter nos itens do DropdownMenu

**Verificação:** Empty state correto para cada cenário; foco de teclado funciona no dropdown.

---

## T10 — Validação Final

**Reqs:** todos  
**Depende de:** T1–T9  
**Status:** `[ ]`

### Checklist de testes manuais

- [ ] Tabela exibe 6 colunas sem scroll horizontal em 1280px
- [ ] Tabela faz scroll horizontal em 768px sem quebrar layout
- [ ] DropdownMenu de ações abre e fecha corretamente (click, Escape, click fora)
- [ ] "Ver detalhes", "Editar", "Inativar/Reativar" disparam ações corretas
- [ ] Badge "Ativo" verde e "Inativo" muted em modo claro e escuro
- [ ] Coluna "Última Sessão" exibe data relativa; tooltip com data exata; "Sem sessões" quando null
- [ ] Search: spinner durante fetch; botão X limpa campo e URL; debounce 400ms funcionando
- [ ] Chips de filtro aparecem ao ativar filtro de status; animação de entrada/saída suave
- [ ] Contador "X de Y pacientes" correto ao paginar e filtrar
- [ ] Botão "Limpar filtros" aparece/desaparece corretamente
- [ ] Modal de cadastro: 4 seções visíveis com Separator e títulos
- [ ] Validação em tempo real funciona após primeiro blur
- [ ] Botão "Salvando..." com spinner durante submit; desabilitado
- [ ] Preview circular do avatar aparece imediatamente ao selecionar arquivo
- [ ] DnD na zona de upload: feedback visual ao arrastar sobre
- [ ] UserAvatar em 3 tamanhos sem regressão em outros contextos de uso
- [ ] Empty state correto: sem pacientes vs. sem resultados de filtro
- [ ] `pnpm build` sem erros de TypeScript
- [ ] Console sem erros em runtime