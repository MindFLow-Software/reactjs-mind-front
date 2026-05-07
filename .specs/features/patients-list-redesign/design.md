# F13 — Design: Patients List Redesign

## Árvore de Componentes (estado final)

```
PatientsListPage
├── [lazy] RegisterPatients (Dialog)
├── PatientsPageShell                    ← espaçamento padronizado
│   └── PatientsDataBlock (isLoading)    ← skeleton de título
│       ├── PatientsTableFilters         ← chips + contador + clear
│       │   ├── SearchInput (spinner, botão X)
│       │   ├── StatusSelect
│       │   ├── ActiveFilterChips        ← AnimatePresence
│       │   ├── ResultsCounter
│       │   └── ClearFiltersButton
│       ├── PatientsTable                ← 6 colunas
│       │   └── PatientsTableRow (memo)  ← DropdownMenu de ações
│       │       ├── UserAvatar (size, ring)
│       │       ├── StatusBadge
│       │       ├── LastSessionCell (Tooltip + formatDistanceToNow)
│       │       └── ActionsDropdown
│       │           ├── [lazy] PatientsDetails (Dialog)
│       │           ├── [lazy] RegisterPatients (Dialog)
│       │           └── [lazy] DeletePatientDialog (AlertDialog)
│       └── Pagination
└── [lazy] GenerateInviteModal
    └── [lazy] EvolutionViewer
```

---

## Arquivos Modificados

| Arquivo | Mudança principal |
|---------|------------------|
| `src/pages/app/patients/patients-list/patients-list.tsx` | React Query: staleTime 30s, gcTime 5min, select fn; React.lazy para 5 modais |
| `src/pages/app/patients/patients-list/components/patients-table.tsx` | Header 6 colunas; skeleton 6 colunas |
| `src/pages/app/patients/patients-list/components/patients-table-row.tsx` | 6 colunas; DropdownMenu; LastSessionCell; React.memo; useCallback |
| `src/pages/app/patients/patients-list/components/patients-table-filters.tsx` | Search com X + spinner; chips AnimatePresence; ResultsCounter; ClearFiltersButton |
| `src/pages/app/patients/patients-list/register-patients/register-patients.tsx` | 4 seções com Separator; validação onChange; loading no botão |
| `src/pages/app/patients/patients-list/register-patients/patient-avatar-upload.tsx` | Preview circular via URL.createObjectURL; DnD visual feedback |
| `src/components/user-avatar.tsx` | Prop `size: "sm"\|"md"\|"lg"`; prop `showStatusRing?` |
| `src/components/item.tsx` | Prop `orientation: "vertical"\|"horizontal"`; tokens text-sm/font-medium |
| `src/pages/app/patients/components/patients-page-shell.tsx` | Espaçamento `gap-6` padronizado |
| `src/pages/app/patients/components/patients-data-block.tsx` | Prop `isLoading?`; Skeleton no título |

## Arquivo Novo

| Arquivo | Propósito |
|---------|-----------|
| `src/pages/app/patients/patients-list/components/active-filter-chips.tsx` | Chips de filtros ativos com AnimatePresence |

---

## Design Visual

### Paleta — usando tokens do design system (sem hex inline)

| Elemento | Token |
|----------|-------|
| Badge Ativo | `bg-emerald-500/15 text-emerald-600 dark:text-emerald-400` |
| Badge Inativo | `bg-muted text-muted-foreground` |
| Chip de filtro | `bg-primary/10 text-primary border border-primary/20 rounded-full` |
| Row hover | `hover:bg-muted/50 transition-colors` |
| Última sessão null | `text-muted-foreground text-sm` |
| Botão limpar filtros | `variant="ghost" size="sm"` com ícone `FilterX` |
| Spinner no input | `animate-spin` com `Loader2` do lucide |
| DnD hover zone | `border-2 border-dashed border-primary/60 bg-primary/5` |

### Colunas da tabela (larguras sugeridas)

| Coluna | Largura | Alinhamento |
|--------|---------|-------------|
| Avatar + Nome | `min-w-[200px]` | left |
| Status | `w-[110px]` | center |
| Telefone | `w-[140px]` | left |
| E-mail | `min-w-[180px] max-w-[240px]` | left |
| Última Sessão | `w-[150px]` | left |
| Ações | `w-[60px]` | center |

### UserAvatar — tamanhos

| Prop size | Classe | Uso |
|-----------|--------|-----|
| `sm` | `h-6 w-6 text-[10px]` | Tabelas densas, chips |
| `md` | `h-8 w-8 text-xs` | Default — rows da tabela |
| `lg` | `h-10 w-10 text-sm` | Headers, cards de perfil |

### DropdownMenu de Ações — estrutura

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" aria-label={`Ações do paciente ${patient.name}`}>
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem onSelect={() => setDetailsOpen(true)}>
      <Search className="mr-2 h-4 w-4" /> Ver detalhes
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => setEditOpen(true)}>
      <Pencil className="mr-2 h-4 w-4" /> Editar
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
      onSelect={() => setDeleteOpen(true)}
      className="text-destructive focus:text-destructive"
    >
      <UserX className="mr-2 h-4 w-4" />
      {patient.isActive ? "Inativar" : "Reativar"}
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Seções do Modal de Cadastro

```
DialogContent
├── ScrollArea (max-h-[80vh])
│   ├── Seção "Identificação"
│   │   ├── Label da seção (text-xs font-semibold uppercase text-muted-foreground)
│   │   ├── Separator
│   │   ├── Field: Primeiro nome
│   │   ├── Field: Sobrenome
│   │   ├── Field: CPF (react-imask)
│   │   └── Field: Gênero (Select)
│   ├── Seção "Contato"
│   │   ├── Separator
│   │   └── Field: Telefone (react-imask)
│   ├── Seção "Dados Pessoais"
│   │   ├── Separator
│   │   └── Field: Data de nascimento (Calendar Popover)
│   └── Seção "Mídia"
│       ├── Separator
│       ├── PatientAvatarUpload (preview circular imediato)
│       └── AttachmentsList + UploadZone
└── DialogFooter
    └── Button (isSubmitting ? "Salvando..." : "Salvar")
```

---

## Padrão de Lazy Loading

```tsx
// patients-list.tsx
const RegisterPatients = lazy(() =>
  import("./register-patients/register-patients").then(m => ({ default: m.RegisterPatients }))
)

const PatientsDetails = lazy(() =>
  import("./components/patients-details").then(m => ({ default: m.PatientsDetails }))
)

// No JSX — fallback do Suspense por modal
<Suspense fallback={<DialogSkeleton />}>
  {registerOpen && <RegisterPatients ... />}
</Suspense>
```

---

## Padrão de React.memo + useCallback

```tsx
// patients-table-row.tsx
const PatientsTableRow = memo(function PatientsTableRow({ patient }: Props) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleOpenDetails = useCallback(() => setDetailsOpen(true), [])
  const handleOpenEdit   = useCallback(() => setEditOpen(true), [])
  const handleOpenDelete = useCallback(() => setDeleteOpen(true), [])

  // ...
})
```

---

## Padrão de Chips com AnimatePresence

```tsx
// active-filter-chips.tsx
<AnimatePresence>
  {statusFilter && statusFilter !== "all" && (
    <motion.span
      key="status-chip"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
    >
      Status: {statusLabel}
      <button onClick={clearStatus} aria-label="Remover filtro de status">
        <X className="h-3 w-3" />
      </button>
    </motion.span>
  )}
</AnimatePresence>
```

---

## Padrão de Virtualização Condicional

```tsx
// patients-table.tsx — ativar apenas quando meta.total > 50
const useVirtualRows = meta.total > 50

const rowVirtualizer = useVirtualizer({
  count: patients.length,
  getScrollElement: () => tableContainerRef.current,
  estimateSize: () => 56, // altura estimada de cada row (px)
  overscan: 5,
})

// Renderizar apenas rowVirtualizer.getVirtualItems() quando ativo
// Fallback: renderizar patients diretamente (< 50 itens)
```

---

## React Query — configuração final

```tsx
// patients-list.tsx
const { data, isFetching } = useQuery({
  queryKey: ["patients", pageIndex, filter, status],
  queryFn: () => getPatients({ pageIndex, filter, status }),
  staleTime: 30_000,       // 30s (era 10s)
  gcTime: 300_000,         // 5min
  placeholderData: keepPreviousData,
  refetchOnWindowFocus: true,
  select: (data) => ({     // transforma só quando data muda
    patients: data.patients,
    meta: data.meta,
  }),
})
```

---

## Responsive Behavior

| Viewport | Comportamento |
|----------|---------------|
| `< 768px` | Tabela com scroll horizontal; colunas E-mail e Última Sessão podem ser omitidas via `hidden md:table-cell` |
| `768px – 1280px` | Todas as 6 colunas, layout comprimido mas funcional |
| `> 1280px` | Layout completo com espaçamento confortável |
