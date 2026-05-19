# Anamnese Redesign — Tasks

**Spec**: `.specs/features/patients-hub-anamnesis-redesign/spec.md`
**Status**: Approved

---

## Execution Plan

```
T1 [P]  T2 [P]  T3 [P]   ← componentes isolados, sem dependência entre si
        ↓
        T4                ← orquestra tudo no form
        ↓
      pnpm build
```

---

## Task Breakdown

### T1: Redesign `anamnesis-navigation.tsx` → sidebar vertical [P]

**What**: Substituir o barra horizontal de botões por um painel sidebar vertical com lista de seções, word count por bloco, highlight da seção ativa e barra de progresso.
**Where**: `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-navigation.tsx`
**Depends on**: None
**Requirement**: ANA-01, ANA-02, ANA-03

**Nova interface de props**:
```ts
interface AnamnesisNavigationProps {
  sections: { id: string; label: string; wordCount: number }[]
  activeBlockId: string | null
  onJump: (id: string) => void
}
```

**Layout**:
```
┌──────────────────────────┐
│ ≡ SEÇÕES                 │
├──────────────────────────┤
│ ▌ Queixa principal   24  │  ← ativa: borda esquerda verde
│   História da doença 47  │
│   História pessoal   33  │
│   História familiar   0  │
│   ...                    │
├──────────────────────────┤
│ Preenchido    ████░░  3/7│
└──────────────────────────┘
```

**Done when**:
- [ ] Lista vertical de seções com `label` e `wordCount`
- [ ] Seção ativa tem `border-l-2 border-primary` e texto foreground
- [ ] Clique faz scroll/focus no bloco correto
- [ ] Footer mostra "Preenchido N/total" com `<Progress>` de shadcn
- [ ] WordCount 0 exibe `0` (não vazio)

**Tests**: none — **Gate**: —

---

### T2: Redesign `anamnesis-editor-block.tsx` → numbered heading + word count [P]

**What**: Redesign do bloco individual: número à esquerda do título, título como `Input` sem borda visível (estilo heading), textarea com `resize-none` e sem handle CSS, word count + status por bloco.
**Where**: `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-editor-block.tsx`
**Depends on**: None
**Requirement**: ANA-04, ANA-05, ANA-06

**Nova interface de props** (adicionar):
```ts
saveStatus: 'synced' | 'pending' | 'draft'
```

**Layout do bloco**:
```
┌─────────────────────────────────────────────┐
│  [1]  Queixa principal                  [🗑] │
│ ┌───────────────────────────────────────┐   │
│ │ textarea (auto-grow, sem resize)      │   │
│ └───────────────────────────────────────┘   │
│  ✓ Salvo automaticamente · 24 palavras      │
└─────────────────────────────────────────────┘
```

**Notas**:
- Input do título: `border-none bg-transparent shadow-none text-base font-semibold focus-visible:ring-0 focus-visible:border-none`
- Textarea: `resize-none` (já existe) + CSS `resize: none !important` via className para garantir
- Word count: `content.trim().split(/\s+/).filter(Boolean).length`
- Status por bloco: `saveStatus` prop → "Salvo automaticamente" / "Sincronizando..." / "Rascunho local"

**Done when**:
- [ ] Número do bloco visível à esquerda do título
- [ ] Título parece heading (sem borda de input visível)
- [ ] Textarea não tem resize handle (visual nem funcional)
- [ ] Word count correto exibido abaixo
- [ ] Status "✓ Salvo automaticamente" visível quando synced

**Tests**: none — **Gate**: —

---

### T3: Update `anamnesis-toolbar.tsx` → Citação, Comentário + save status slot [P]

**What**: Adicionar botões Citação e Comentário; adicionar prop `saveStatus` para exibir "● Salvo · há instantes" à direita da toolbar.
**Where**: `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-toolbar.tsx`
**Depends on**: None
**Requirement**: ANA-07, ANA-08

**Nova interface**:
```ts
interface AnamnesisToolbarProps {
  onFormat: (marker: string) => void
  onList: (prefix: string, numbered?: boolean) => void
  saveStatus: 'synced' | 'pending' | 'draft'
}
```

**Layout**:
```
[B] [I] [U] [Lista] [Num.] [Citação] [Coment.]      ● Salvo · há instantes
```

**Done when**:
- [ ] Botões Citação (marker `> `) e Comentário (marker `// `) presentes
- [ ] Save status à direita: verde para synced, amarelo para pending/draft
- [ ] Props interface atualizada

**Tests**: none — **Gate**: —

---

### T4: Update `anamnesis-form.tsx` → layout sidebar + main, wiring de novas props

**What**: Reorganizar o layout para `flex` horizontal (sidebar + área de editor). Calcular word counts por bloco. Passar `saveStatus` para toolbar e para cada bloco. Remover `AnamnesisHeader` (PDF/copy movem para dentro da toolbar ou removidos do topo).
**Where**: `src/pages/app/patients/patients-hub/components/anamnesis/anamnesis-form.tsx`
**Depends on**: T1, T2, T3
**Requirement**: ANA-01..ANA-08

**Layout do form**:
```
┌─────────────────────────────────────────────────────────────┐
│  [Toolbar completa com save status à direita]               │
├───────────────┬─────────────────────────────────────────────┤
│  Sidebar      │  Editor: blocos numerados                   │
│  (seções)     │  [1] Queixa principal              [🗑]     │
│               │  textarea auto-grow                         │
│               │  ✓ Salvo · 24 palavras                     │
│               │                                             │
│               │  [2] História da doença            [🗑]     │
│               │  ...                                        │
│  Preenchido   │                                             │
│  3/7  ████░░  │  [+ Novo bloco]                            │
└───────────────┴─────────────────────────────────────────────┘
```

**Cálculos**:
```ts
const wordCounts = useMemo(() =>
  normalizedBlocks.map(b => b.content.trim().split(/\s+/).filter(Boolean).length),
  [normalizedBlocks]
)
const saveStatus = isPending ? 'pending' : hasLocalDraft ? 'draft' : 'synced'
```

**Done when**:
- [ ] Layout flex row: sidebar à esquerda, editor à direita
- [ ] `AnamnesisNavigation` recebe `sections` com `wordCount` por bloco
- [ ] `AnamnesisToolbar` recebe `saveStatus`
- [ ] Cada `AnamnesisEditorBlock` recebe `saveStatus`
- [ ] `AnamnesisHeader` (PDF/copy) mantido ou integrado na toolbar — não pode sumir
- [ ] `pnpm build` passa limpo

**Tests**: none
**Gate**: build — `pnpm build`

**Commit**: `feat(anamnesis): redesign editor with sidebar navigation, numbered blocks, and save status`

---

## Granularity Check

| Task | Scope | Status |
|---|---|---|
| T1: Redesign navigation | 1 componente | ✅ |
| T2: Redesign editor block | 1 componente | ✅ |
| T3: Update toolbar | 1 componente | ✅ |
| T4: Update form | 1 componente + wiring | ✅ |

## Diagram Cross-Check

| Task | Depends On | Diagram | Status |
|---|---|---|---|
| T1 | None | Fase 1 paralelo | ✅ |
| T2 | None | Fase 1 paralelo | ✅ |
| T3 | None | Fase 1 paralelo | ✅ |
| T4 | T1+T2+T3 | Fase 2 | ✅ |
