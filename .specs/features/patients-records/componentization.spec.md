# Spec: Componentização — patients-records

## Estrutura de Arquivos

```
src/pages/app/patients/patients-records/
├── patients-records.tsx                        # Página lean — query + handleOpenRecord
├── hooks/
│   └── use-patient-records-filters.ts          # search, debouncedSearch (400ms), gender, sessionOrder
└── components/
    ├── patient-card.tsx                        # Card individual de paciente
    ├── records-empty-state.tsx                 # Estado vazio (FilterX + mensagem)
    ├── records-skeleton.tsx                    # 6 skeletons de carregamento
    ├── patient-navigation-controls.tsx         # Sem alterações
    └── patients-records-table-filters.tsx      # Sem alterações
```

---

## Responsabilidades

### `use-patient-records-filters.ts`
- Estado: `search`, `debouncedSearch` (400ms), `gender`, `sessionOrder`
- Expõe `clearFilters()` e setters individuais
- Sem dependências de API — puro estado de UI

### `patient-card.tsx`
- Props: `{ patient: PatientHTTP; onOpen: (id: string) => void }`
- Renderiza avatar, nome, última sessão (formatDistanceToNow), chevron
- Hover state com `group` do Tailwind

### `records-skeleton.tsx`
- Exporta `RecordsSkeleton` — 6 × `<Skeleton h-[72px]>`
- Sem props

### `records-empty-state.tsx`
- Exporta `RecordsEmptyState` — ícone FilterX + texto
- Sem props

### `patients-records.tsx`
- Usa `usePatientRecordsFilters()` — sem estado de filtro inline
- Passa setters do hook diretamente para `PatientsRecordsTableFilters`
- `handleOpenRecord` ainda aqui (sessionStorage queue é responsabilidade da página)
- API call simplificada: passa valores direto para `getPatients` (sem conversão manual de "all")

---

## Validators (`src/validators/`)

Pasta já existe em `src/validators/`. Nenhum schema Zod novo necessário para patients-records — não há formulários com validação nesta página. Ao criar schemas futuros, seguir convenção de arquivo por domínio.

---

## API Fix

`getPatients` já converte `gender === 'all'` e `sessionVolume === 'all'` para `undefined` internamente.
A página passava os valores com conversão manual redundante. Após refactor, passa diretamente:

```typescript
getPatients({
    pageIndex: 0,
    perPage: 100,
    filter: debouncedSearch || undefined,
    gender: gender as GetPatientsFilters['gender'],
    sessionVolume: sessionOrder,
})
```
