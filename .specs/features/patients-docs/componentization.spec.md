# Spec: Componentização — patients-docs

## Estrutura de Arquivos

```
src/pages/app/patients/patients-docs/
├── patients-docs.tsx                        # Página lean — query, delete, estado de UI
├── hooks/
│   ├── use-attachments-filters.ts           # Estado de filtros + debounce (220ms)
│   └── use-upload.ts                        # Lógica de upload + estado dos arquivos
├── utils/
│   └── file-helpers.ts                      # Utilitários de tipo de arquivo (sem deps)
└── components/
    ├── metrics-cards.tsx                    # 4 cards de métricas (totalCount, storage…)
    ├── preview-drawer.tsx                   # Sheet lateral de preview (PDF/IMG/fallback)
    ├── bulk-delete-action.tsx               # Barra flutuante de bulk delete
    ├── date-picker-with-range.tsx           # Seletor de intervalo de datas
    ├── upload-modal/
    │   ├── index.tsx                        # Dialog shell + patient selector + footer
    │   ├── drop-zone.tsx                    # Área de drag-drop + input[type=file]
    │   ├── file-list.tsx                    # Lista de arquivos com progresso
    │   └── file-thumb.tsx                  # Miniatura por MIME type
    └── attachments-table/
        ├── index.tsx                        # Tabela principal + checkbox + skeleton
        ├── attachments-table-row.tsx        # Linha individual da tabela
        └── attachments-table-filters.tsx   # Chips de tipo + busca + dropdowns
```

> Os arquivos rasos (`upload-modal.tsx`, `attachments-table.tsx`, etc.) foram mantidos como re-exports para preservar compatibilidade.

---

## Responsabilidades

### `use-attachments-filters.ts`
- Estado: `pageIndex`, `search`, `debouncedSearch` (220ms), `patientId`, `date`, `contentType`
- Setters de `patientId`, `date`, `contentType` já resetam `pageIndex` para 0
- Expõe `clearFilters()` e `hasActiveFilters: boolean`

### `use-upload.ts`
- Estado: `files: FileItem[]`, `isDragging`, `dragCounter` (ref)
- Handlers de drag: `handleDragEnter`, `handleDragLeave`, `handleDrop`
- `startUpload(patientId)` — paralelo (chunks de 3), rastreia resultados localmente (evita stale closure), invalida `["all-attachments"]` e `["patients-with-attachments"]` ao terminar
- Retorna `{ doneCount, hasErrors }` para o modal exibir toast e fechar

### `file-helpers.ts`
- `getFileKind(contentType)` → `"pdf" | "image" | "doc" | "xls" | "other"`
- `getFileMimeGroup(type)` → `"PDF" | "IMG" | "DOC" | "XLS" | "FILE"`
- `getFileLabel(contentType)` → string legível ("PDF", "JPEG", "Word"…)
- `FILE_KIND_STYLES` — gradient + label + labelColor por `FileKind`
- `MIME_GRADIENT` — gradient string por grupo MIME
- `TYPE_BADGE` — bg + text + label para badges da tabela

### `upload-modal/index.tsx`
- Props: `{ open: boolean; onClose: () => void }`
- `onSuccess` removido — invalidação de queries é responsabilidade do `use-upload`
- `patientId` (state local) controla o seletor de paciente
- Query de pacientes com `enabled: open`

### `patients-docs.tsx`
- Usa `useAttachmentsFilters()` — sem estado de filtro inline
- Usa `MetricsCards` com `meta` da query
- Passa setters do hook diretamente para `AttachmentsTableFilters`
- `deleteFn` com `useMutation` ainda aqui (delete é responsabilidade da página)

---

## Validators (`src/validators/attachments.ts`)

```typescript
export const uploadFormSchema = z.object({
    patientId: z.string().min(1, "Selecione um paciente"),
    files:     z.array(uploadFileSchema).min(1, "Selecione pelo menos um arquivo"),
})
export type UploadFormData = z.infer<typeof uploadFormSchema>
```

---

## Utilitário de formatação

`src/utils/format-file-size.ts` — `formatFileSize(bytes)` — substitui `formatBytes` inline em todos os componentes.

---

## Bug corrigido

`patientId === "all"` era enviado à API como string; agora convertido para `undefined` antes de passar para `getAllAttachments`.
