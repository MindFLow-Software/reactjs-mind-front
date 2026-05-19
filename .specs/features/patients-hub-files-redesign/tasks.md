# Tasks — Arquivos Tab Redesign

**Spec**: `.specs/features/patients-hub-files-redesign/spec.md`  
**Status Legend**: `Pending` | `In Progress` | `Done` | `Blocked`

---

## Execution Plan

```
Phase 1 — Foundation (todos paralelos, sem deps entre si)

  T1 [P]   src/validators/attachments.ts
  T2 [P]   src/utils/format-file-size.ts
  T3 [P]   file-type-filter.tsx
  T4 [P]   simple-preview-modal.tsx (retype)

Phase 2 — Componentes principais (paralelos, após Phase 1)

  T1 ──→ T6   file-upload-zone.tsx
  T2 ──→ T5   file-card.tsx

Phase 3 — Orquestrador (sequencial, após Phase 2)

  T3, T4, T5, T6 ──→ T7   patient-files-tab.tsx

Phase 4 — Verificação

  T7 ──→ T8   pnpm build
```

---

## Phase 1 — Foundation

### T1 — Criar `src/validators/attachments.ts` [P]

**Status**: Done  
**Touches**: `src/validators/attachments.ts` (novo)  
**Depends on**: Nenhum  
**Requirement**: FILES-03, FILES-04, FILES-10

Criar o módulo de validação de upload de arquivos.

- Exportar constantes:
  ```ts
  export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'] as const
  export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
  export const ACCEPTED_MIME_LABEL = 'PDFs, imagens ou áudios'
  ```
- Exportar schema:
  ```ts
  export const uploadFileSchema = z.custom<File>()
    .refine(f => ACCEPTED_MIME_TYPES.includes(f.type as typeof ACCEPTED_MIME_TYPES[number]),
      { message: 'Tipo de arquivo não suportado. Envie PDF ou imagem.' })
    .refine(f => f.size <= MAX_FILE_SIZE_BYTES,
      { message: 'Arquivo excede 5 MB.' })
  ```
- Exportar tipo:
  ```ts
  export type UploadFileInput = z.infer<typeof uploadFileSchema>
  ```

**Done when**:
- [ ] Arquivo exporta `uploadFileSchema`, `ACCEPTED_MIME_TYPES`, `MAX_FILE_SIZE_BYTES`, `ACCEPTED_MIME_LABEL`
- [ ] `safeParse` com File MIME inválido retorna `success: false` com mensagem clara
- [ ] `safeParse` com File > 5 MB retorna `success: false` com "Arquivo excede 5 MB."
- [ ] Sem erros de tipo no arquivo

**Commit**: `feat(validators): add uploadFileSchema for attachment uploads`

---

### T2 — Criar `src/utils/format-file-size.ts` [P]

**Status**: Done  
**Touches**: `src/utils/format-file-size.ts` (novo)  
**Depends on**: Nenhum  
**Requirement**: FILES-08

Criar função utilitária para formatar tamanho de arquivo em bytes para exibição legível.

- Exportar função:
  ```ts
  export function formatFileSize(bytes: number | null | undefined): string
  ```
- Regras:
  - `null` / `undefined` / `0` → `"—"`
  - `< 1024` → `"N bytes"`
  - `< 1024 * 1024` → `"N KB"` (arredondar para 0 casas decimais)
  - `>= 1024 * 1024` → `"N.N MB"` (1 casa decimal)
- Exemplos: `248000` → `"242 KB"` (248000/1024 = 242.18), `1258291` → `"1.2 MB"`

**Done when**:
- [ ] Função exportada e tipada
- [ ] `formatFileSize(0)` → `"—"`
- [ ] `formatFileSize(248000)` → exibe em KB
- [ ] `formatFileSize(1258291)` → exibe em MB com 1 decimal
- [ ] `formatFileSize(null)` → `"—"`

**Commit**: `feat(utils): add formatFileSize helper`

---

### T3 — Criar `file-type-filter.tsx` [P]

**Status**: Done  
**Touches**: `src/pages/app/patients/patients-hub/components/file-type-filter.tsx` (novo)  
**Depends on**: Nenhum  
**Requirement**: FILES-05, FILES-06, FILES-12

Componente de chips de filtro por tipo de arquivo + botão visual "Mais recentes".

- Exportar tipo compartilhado:
  ```ts
  export type FileTypeFilter = 'all' | 'pdf' | 'image' | 'audio'
  ```
- Exportar helper:
  ```ts
  export function getFileType(mime: string): Exclude<FileTypeFilter, 'all'>
  // mime.includes('pdf') → 'pdf' | mime.includes('image') → 'image' | mime.includes('audio') → 'audio' | fallback → 'pdf'
  ```
- Props do componente:
  ```ts
  interface FileTypeFilterProps {
    filter: FileTypeFilter
    counts: Record<FileTypeFilter, number>
    onFilterChange: (f: FileTypeFilter) => void
  }
  ```
- Chips: `[Todos N] [PDFs N] [Imagens N] [Áudios N]` — mesmo padrão visual dos chips de sessões (border-border/bg-transparent inativo, border-blue-600/bg-blue-600/text-white ativo)
- Badge de contagem interno ao chip: `bg-white/25 text-white` ativo / `bg-muted text-muted-foreground` inativo
- Botão "Mais recentes" (visual, sem lógica):
  ```tsx
  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs text-muted-foreground font-medium cursor-default opacity-80">
    <ArrowUpDown className="h-3.5 w-3.5" />
    Mais recentes
  </Button>
  ```
- Layout geral: `flex flex-wrap items-center justify-between gap-2`

**Done when**:
- [ ] Chips renderizam com contagens corretas
- [ ] Chip ativo aplica estilos corretos
- [ ] `onFilterChange` chamado ao clicar
- [ ] Botão "Mais recentes" presente (visual)
- [ ] `FileTypeFilter` e `getFileType` exportados
- [ ] Sem erros de tipo

**Commit**: `feat(patients-hub): add FileTypeFilter component and type`

---

### T4 — Retipar `simple-preview-modal.tsx` [P]

**Status**: Done  
**Touches**: `src/pages/app/patients/patients-hub/components/simple-preview-modal.tsx` (modify)  
**Depends on**: Nenhum  
**Requirement**: FILES-09

Substituir o tipo local `PreviewFile` pelo tipo canônico `AttachmentPatientItem`.

- Remover o tipo local `PreviewFile`
- Importar `AttachmentPatientItem` de `@/types/attachment`
- Alterar a prop: `file: AttachmentPatientItem | null`
- Simplificar `normalizeFileName`: `const fileName = file.filename`
- Simplificar `normalizeFileMime`: `const fileMime = file.type.toLowerCase()`
- Manter toda lógica de preview (isImage, isPDF, iframe/img render) sem alterações

⚠️ `AttachmentPatientItem.type` é o MIME type. `AttachmentPatientItem.url` é a chave R2 — **não** é a URL pública. A URL pública continua sendo construída via `buildAttachmentUrl(id)` — manter essa lógica.

**Done when**:
- [ ] Tipo `PreviewFile` removido do arquivo
- [ ] `import type { AttachmentPatientItem }` presente
- [ ] Prop `file` tipada como `AttachmentPatientItem | null`
- [ ] `normalizeFileName` e `normalizeFileMime` simplificadas
- [ ] Nenhum `any` ou cast inseguro introduzido
- [ ] Sem erros de tipo

**Commit**: `refactor(patients-hub): replace local PreviewFile type with AttachmentPatientItem`

---

## Phase 2 — Componentes Principais

### T5 — Criar `file-card.tsx` [P]

**Status**: Done  
**Touches**: `src/pages/app/patients/patients-hub/components/file-card.tsx` (novo)  
**Depends on**: T2 (`formatFileSize`)  
**Requirement**: FILES-07, FILES-08

Card individual de arquivo com badge de tipo, metadados e ações hover.

- Props:
  ```ts
  interface FileCardProps {
    file: AttachmentPatientItem
    onPreview: (file: AttachmentPatientItem) => void
  }
  ```
- Função interna para tipo visual:
  ```ts
  function getTypeBadge(mime: string): { label: string; className: string }
  // 'pdf'   → { label: 'PDF', className: 'bg-red-600 text-white' }
  // 'image' → { label: 'IMG', className: 'bg-teal-600 text-white' }
  // outros  → { label: 'DOC', className: 'bg-gray-500 text-white' }
  ```
- Layout do card: `group relative flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 transition-shadow hover:shadow-sm`
- Badge de tipo: quadrado `h-11 w-11 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold` com classe da `getTypeBadge`
- Info:
  - `filename` truncado com `title` para tooltip
  - `formatFileSize(file.size)` + ` · ` + `format(new Date(file.uploadedAt), "dd MMM yyyy", { locale: ptBR })`
- Hover actions (`opacity-0 group-hover:opacity-100 transition-opacity absolute right-3`):
  - Botão olho → chama `onPreview(file)`
  - Botão download → chama `handleFileDownload(file.id, file.filename)`

**Done when**:
- [ ] Badge PDF vermelho, IMG teal aplicados por MIME
- [ ] Nome truncado com tooltip
- [ ] Tamanho formatado via `formatFileSize`
- [ ] Data formatada em pt-BR
- [ ] Hover actions funcionam (onPreview + download)
- [ ] Sem `any`, sem cores hardcoded fora dos badges tipados
- [ ] Sem erros de tipo

**Commit**: `feat(patients-hub): add FileCard component`

---

### T6 — Criar `file-upload-zone.tsx`

**Status**: Done  
**Touches**: `src/pages/app/patients/patients-hub/components/file-upload-zone.tsx` (novo)  
**Depends on**: T1 (`uploadFileSchema`, `ACCEPTED_MIME_TYPES`, `MAX_FILE_SIZE_BYTES`)  
**Requirement**: FILES-01, FILES-02, FILES-03, FILES-04

Zona de upload com drag-and-drop, picker nativo e validação Zod.

- Props:
  ```ts
  interface FileUploadZoneProps {
    patientId: string
    onSuccess: () => void
  }
  ```
- Estado interno: `isDragging: boolean`, `isUploading: boolean`
- Ref: `inputRef = useRef<HTMLInputElement>(null)`
- Mutation via `useMutation`:
  ```ts
  const { mutateAsync: upload, isPending } = useMutation({
    mutationFn: (file: File) => uploadAttachment(file, patientId),
    onSuccess: () => { toast.success('Arquivo enviado!'); onSuccess() },
    onError: () => toast.error('Erro ao enviar arquivo.'),
  })
  ```
- Handler de arquivo (shared entre drag e input):
  ```ts
  async function handleFile(file: File) {
    const result = uploadFileSchema.safeParse(file)
    if (!result.success) {
      toast.error(result.error.errors[0].message)
      return
    }
    await upload(file)
  }
  ```
- Drag events:
  - `onDragOver`: `e.preventDefault(); setIsDragging(true)`
  - `onDragLeave`: `setIsDragging(false)`
  - `onDrop`: `e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0])`
  - Se `e.dataTransfer.files.length > 1` → toast informativo "Envie um arquivo por vez."
- Input: `type="file"` hidden, `accept={ACCEPTED_MIME_TYPES.join(',')}`, `onChange={e => handleFile(e.target.files![0])}`
- Visual da zona:
  ```
  [border-dashed border-2] [bg-blue-50/30 dark:bg-blue-950/10] quando isDragging
  [border-border/50]       estado normal
  Ícone Upload + texto + subtitle + Botão "Selecionar arquivos"
  ```
- Texto: "Arraste arquivos ou clique para anexar"
- Subtitle: `PDFs, imagens ou áudios · até 5 MB cada · vinculados a este paciente`
- Durante upload: spinner + desabilita interação (`pointer-events-none opacity-60`)
- Botão "Selecionar arquivos": `variant="outline"` → `inputRef.current?.click()`

**Done when**:
- [ ] Drag-and-drop detecta arquivo e chama `handleFile`
- [ ] Botão "Selecionar arquivos" abre file picker
- [ ] Arquivo com MIME inválido exibe toast e não sobe
- [ ] Arquivo > 5 MB exibe toast e não sobe
- [ ] Upload válido chama `uploadAttachment` e depois `onSuccess`
- [ ] Múltiplos arquivos no drop: processa só o primeiro, exibe toast
- [ ] Estado de loading desabilita interação
- [ ] `isDragging` muda visual da zona
- [ ] Sem `any`, sem erros de tipo

**Commit**: `feat(patients-hub): add FileUploadZone with drag-and-drop and Zod validation`

---

## Phase 3 — Orquestrador

### T7 — Reescrever `patient-files-tab.tsx`

**Status**: Done  
**Touches**: `src/pages/app/patients/patients-hub/components/patient-files-tab.tsx` (rewrite)  
**Depends on**: T3, T4, T5, T6  
**Requirement**: FILES-05, FILES-06, FILES-07, FILES-08, FILES-09, FILES-11

Orquestrador que compõe todos os sub-componentes, gerencia estado de filtro e sort.

- Remover: todo `any`, imports de `FileText`, `Image as ImageIcon`, `Eye`, `ArrowDownToLine`, `FileSearch` (migrados para sub-componentes)
- Importar: `FileTypeFilter`, `getFileType`, `type { FileTypeFilter as FileTypeFilterEnum }` de `./file-type-filter`, `FileCard` de `./file-card`, `FileUploadZone` de `./file-upload-zone`, `SimplePreviewModal` de `./simple-preview-modal`
- Estado: `typeFilter: FileTypeFilterEnum = 'all'`, `previewFile: AttachmentPatientItem | null = null`
- Query: `useQuery(["patient-attachments", patientId], () => getPatientAttachments(patientId))`
- Ordenação: `[...attachments].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())`
- Counts:
  ```ts
  const counts = useMemo(() => ({
    all: sorted.length,
    pdf:   sorted.filter(f => getFileType(f.type) === 'pdf').length,
    image: sorted.filter(f => getFileType(f.type) === 'image').length,
    audio: sorted.filter(f => getFileType(f.type) === 'audio').length,
  }), [sorted])
  ```
- Filtro:
  ```ts
  const filtered = typeFilter === 'all' ? sorted : sorted.filter(f => getFileType(f.type) === typeFilter)
  ```
- Invalidação após upload:
  ```ts
  const queryClient = useQueryClient()
  const handleUploadSuccess = () => queryClient.invalidateQueries({ queryKey: ['patient-attachments', patientId] })
  ```
- Layout (ordem de renderização):
  1. `<FileUploadZone patientId={patientId} onSuccess={handleUploadSuccess} />`
  2. `<FileTypeFilter filter={typeFilter} counts={counts} onFilterChange={setTypeFilter} />`
  3. Loading state com `<Loader2>` (quando `isLoading`)
  4. Empty state quando `filtered.length === 0` (texto adapta ao filtro ativo)
  5. `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">` com `<FileCard>`
  6. `<SimplePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />`
- Empty state message:
  ```ts
  typeFilter === 'all' ? 'Nenhum arquivo encontrado.' : `Nenhum ${LABEL[typeFilter]} encontrado.`
  ```

**Done when**:
- [ ] Nenhum `any` ou `as any` no arquivo
- [ ] Upload reflete na lista imediatamente após `invalidateQueries`
- [ ] Filtro Todos/PDFs/Imagens/Áudios funciona
- [ ] Counts corretos nos chips
- [ ] Grid 3 colunas com `FileCard`
- [ ] Preview modal abre ao clicar no card
- [ ] Empty state adapta mensagem ao filtro ativo
- [ ] Ordenação DESC por `uploadedAt`
- [ ] Sem imports de componentes não utilizados
- [ ] Sem erros de tipo

**Commit**: `feat(patients-hub): rewrite PatientFilesTab with upload, filters, and typed components`

---

## Phase 4 — Verificação

### T8 — Verificar build

**Status**: Done  
**Touches**: nenhum  
**Depends on**: T7

- Rodar `pnpm build` — zero erros TypeScript ou Vite
- Navegar manualmente para prontuário de paciente → aba Arquivos e confirmar:
  - Zona de upload renderiza com drag visual
  - Chips com contagens reais
  - Grid de cards com badges PDF/IMG corretos
  - Hover mostra botões de visualizar e baixar
  - Preview modal abre e fecha corretamente
  - Upload de arquivo válido → lista atualiza

**Done when**:
- [ ] `pnpm build` retorna exit code 0
- [ ] Nenhum warning de `any` implícito
- [ ] Inspeção manual confirma todos os pontos acima

**Commit**: nenhum (verificação)

---

## Validações Pre-Aprovação

### Check 1 — Granularidade

| Task | Escopo | Status |
|---|---|---|
| T1: attachments.ts | 1 arquivo — schema + constantes | ✅ Granular |
| T2: format-file-size.ts | 1 função pura | ✅ Granular |
| T3: file-type-filter.tsx | 1 componente + 1 helper + 1 tipo | ✅ Granular (coesos) |
| T4: simple-preview-modal retype | 1 arquivo — só tipos | ✅ Granular |
| T5: file-card.tsx | 1 componente | ✅ Granular |
| T6: file-upload-zone.tsx | 1 componente + 1 mutation inline | ✅ Granular (coesos) |
| T7: patient-files-tab.tsx | 1 arquivo orquestrador | ✅ Granular |
| T8: pnpm build | verificação | ✅ Granular |

### Check 2 — Diagram-Definition Cross-Check

| Task | Depends On (body) | Diagrama mostra | Status |
|---|---|---|---|
| T1 | Nenhum | Início Phase 1 | ✅ Match |
| T2 | Nenhum | Início Phase 1 | ✅ Match |
| T3 | Nenhum | Início Phase 1 | ✅ Match |
| T4 | Nenhum | Início Phase 1 | ✅ Match |
| T5 | T2 | T2 → T5 | ✅ Match |
| T6 | T1 | T1 → T6 | ✅ Match |
| T7 | T3, T4, T5, T6 | T3,T4,T5,T6 → T7 | ✅ Match |
| T8 | T7 | T7 → T8 | ✅ Match |

T5 e T6 são `[P]` mas não dependem um do outro → ✅ paralelos válidos.

### Check 3 — Test Co-location

Sem framework de testes configurado (ver `.specs/codebase/TESTING.md`). Gate único: `pnpm build`.

| Task | Camada | Matrix Requer | Task diz | Status |
|---|---|---|---|---|
| T1–T8 | todos | none (sem framework) | none / build | ✅ OK |

---

## Requirement Traceability

| Requirement | Task(s) | Status |
|---|---|---|
| FILES-01 Drag-and-drop | T6 | Pending |
| FILES-02 Picker nativo | T6 | Pending |
| FILES-03 Validação MIME | T1, T6 | Pending |
| FILES-04 Validação tamanho | T1, T6 | Pending |
| FILES-05 Chips com contagem | T3, T7 | Pending |
| FILES-06 Filtro local por tipo | T3, T7 | Pending |
| FILES-07 Badge de tipo (PDF/IMG) | T5 | Pending |
| FILES-08 Tamanho formatado | T2, T5 | Pending |
| FILES-09 Zero `any` | T4, T7 | Pending |
| FILES-10 src/validators/attachments.ts | T1 | Pending |
| FILES-11 Ordenação DESC | T7 | Pending |
| FILES-12 Botão Mais recentes visual | T3 | Pending |
