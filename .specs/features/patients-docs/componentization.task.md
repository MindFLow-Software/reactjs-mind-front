# Tasks: Componentização — patients-docs

## Status: CONCLUÍDO

Todas as tasks abaixo foram implementadas na branch `feat/patients-docs-redesign`.

---

## Checklist

### Utils
- [x] Criar `utils/file-helpers.ts` com `getFileKind`, `getFileMimeGroup`, `getFileLabel`, `FILE_KIND_STYLES`, `MIME_GRADIENT`, `TYPE_BADGE`

### Hooks
- [x] Criar `hooks/use-attachments-filters.ts` — encapsula estado de filtros + debounce
- [x] Criar `hooks/use-upload.ts` — encapsula lógica de upload + drag state + invalidação de cache

### Upload modal
- [x] Criar `components/upload-modal/file-thumb.tsx`
- [x] Criar `components/upload-modal/drop-zone.tsx`
- [x] Criar `components/upload-modal/file-list.tsx`
- [x] Criar `components/upload-modal/index.tsx`
- [x] Transformar `components/upload-modal.tsx` em re-export

### Attachments table
- [x] Criar `components/attachments-table/index.tsx`
- [x] Criar `components/attachments-table/attachments-table-row.tsx` — importa de `file-helpers`
- [x] Criar `components/attachments-table/attachments-table-filters.tsx` — corrige paths relativos
- [x] Transformar `components/attachments-table.tsx` em re-export
- [x] Transformar `components/attachments-table-row.tsx` em re-export
- [x] Transformar `components/attachments-table-filters.tsx` em re-export

### Outros componentes
- [x] Criar `components/metrics-cards.tsx` — extraído de `patients-docs.tsx`
- [x] Atualizar `components/preview-drawer.tsx` — importa de `file-helpers` + `format-file-size`

### Página principal
- [x] Reescrever `patients-docs.tsx` — usa `useAttachmentsFilters`, `MetricsCards`, sem `formatBytes` inline

### Validators
- [x] Adicionar `uploadFormSchema` e `UploadFormData` em `src/validators/attachments.ts`

### Bugfix
- [x] Corrigir envio de `patientId === "all"` para API — agora convertido para `undefined`

---

## Verificação

```bash
pnpm dev        # inicia sem erros de console
pnpm tsc --noEmit  # compila sem erros de tipo
```

Fluxos a testar manualmente:
1. Filtro por paciente, tipo, data, busca — cada um individualmente e combinados
2. Upload: drag-drop + click, seleção de paciente, progresso, sucesso, erro
3. Preview drawer: PDF, imagem, fallback
4. Delete single (da tabela, do drawer)
5. Bulk delete (selecionar vários, confirmar)
6. Paginação
