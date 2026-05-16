# Tasks — Register Patients Refactor

Rastreabilidade: [spec.md](spec.md) · [design.md](design.md)

---

## Parte 1 — `src/validators/patients.ts` ⭐ P1

**Escopo:** Criar camada de validators por domínio; mover patientSchema para fora da árvore de páginas.

- [x] Criar `src/validators/patients.ts` exportando `patientSchema` e `PatientFormData`
- [x] Atualizar `register-patients.tsx` para importar de `@/validators/patients`
- [x] Atualizar `steps/step-basic-data.tsx` para importar de `@/validators/patients`
- [x] Deletar `register-patients/schema.ts` (removido)
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** RPR-06, RPR-07

**Commit:**
```
feat(validators): centralize patient schema in src/validators/patients
```

---

## Parte 2 — Estrutura `steps/` ⭐ P1

**Escopo:** Mover todos os componentes da raiz de `register-patients/` para `steps/` (plano, sem subpastas).

- [x] Criar pasta `register-patients/steps/`
- [x] Mover e corrigir imports em `step-basic-data.tsx` (`./schema` → `@/validators/patients`, `./constants` → `../constants`, `./form-styles` → `../form-styles`)
- [x] Mover e corrigir imports em `step-contact-address.tsx`
- [x] Mover e corrigir imports em `step-clinical.tsx`
- [x] Mover sem alteração: `section-title.tsx`, `pill-radio.tsx`, `markdown-editor.tsx`, `patient-avatar-upload.tsx`, `delete-attachments-button.tsx`
- [x] Atualizar imports em `register-patients.tsx` para apontar para `./steps/*`
- [x] Raiz de `register-patients/` contém apenas: `register-patients.tsx`, `constants.ts`, `form-styles.ts`, `steps/`
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** RPR-01, RPR-02

**Commit:**
```
refactor(register-patients): move all components to steps/ subfolder
```

---

## Parte 3 — `attachments-list.tsx` UI/UX ⭐ P1

**Escopo:** Portar a UI do step-documents + doc-card para o attachments-list existente, mantendo sua lógica interna (useQuery + useMutation self-contained).

- [x] Cabeçalho com ícone `FileText` + label uppercase + badge de contagem
- [x] Empty state com borda tracejada e texto "Nenhum documento enviado ainda."
- [x] Loading state com `Loader2` centralizado
- [x] Grid `grid-cols-2 gap-2` para a lista de documentos
- [x] DocCard inline: badge de tipo com gradiente (PDF/IMG/DOC), nome truncado, tamanho (formatBytes), data de upload
- [x] Botões por card: Eye (visualizar), Download, DeleteActionButton
- [x] Hover state por card: `hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm`
- [x] Prop signature mantida: `{ patientId: string }`
- [ ] Teste manual (modo edição): abrir step 4 — lista exibe em grid 2 colunas com novo visual

**Req cobertos:** RPR-03, RPR-08

**Commit:**
```
feat(register-patients): update attachments-list with new UI/UX
```

---

## Parte 4 — `upload-zone.tsx` drag-drop UI ⭐ P1

**Escopo:** Adicionar drag-and-drop e visual atualizado ao upload-zone, mantendo validação existente (6 arquivos, 3MB, sem duplicatas).

- [x] `isDrag` state com feedback visual (borda e fundo azul no drag)
- [x] `<label>` com handlers `onDragEnter`, `onDragOver`, `onDragLeave`, `onDrop`
- [x] Ícone `CloudUpload` no centro da dropzone
- [x] Texto instrucional com limites visíveis
- [x] Lista de arquivos selecionados com `FileText` + nome truncado + tamanho (formatBytes) + botão `X` por item
- [x] Validação mantida: max 6 arquivos, 3MB/arquivo, sem duplicatas por nome+tamanho
- [x] Prop signature mantida: `{ selectedFiles: File[], onFilesChange: (files: File[]) => void }`
- [x] Componente memoizado com `memo` e callbacks estáveis (`useCallback`)
- [ ] Teste manual: arrastar arquivo → borda azul aparece; soltar → arquivo aparece na lista com tamanho legível
- [ ] Teste manual: tentar adicionar >6 arquivos → toast de erro

**Req cobertos:** RPR-04

**Commit:**
```
feat(register-patients): add drag-drop and new UI to upload-zone
```

---

## Parte 5 — Simplificação container step 4 ⭐ P1

**Escopo:** Remover estado de attachments do container; step 4 usa `AttachmentsList` + `UploadZone` diretamente.

- [x] Remover `useQuery` de attachments de `register-patients.tsx`
- [x] Remover `removeFn` mutation do container
- [x] Remover `loadingDocs` state
- [x] Step 4 modo edição renderiza `<AttachmentsList patientId={patient!.id} />` + `<UploadZone />`
- [x] Step 4 modo criação renderiza apenas `<UploadZone />`
- [x] `selectedFiles` state mantido (staging antes do submit)
- [ ] Teste manual (modo criação): step 4 exibe apenas dropzone, sem lista de documentos
- [ ] Teste manual (modo edição): step 4 exibe lista de documentos + dropzone
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** RPR-05

**Commit:**
```
refactor(register-patients): simplify step 4 — remove attachment state from container
```

---

## Parte 6 — `src/validators/auth.ts` P2

**Escopo:** Centralizar todos os schemas Zod de autenticação em um único arquivo por domínio.

- [x] Criar `src/validators/auth.ts` exportando: `signInSchema`, `signUpFormSchema`, `patientSignUpSchema`, `completeRegistrationSchema` e seus tipos
- [x] Atualizar `sign-in-form.tsx` para importar de `@/validators/auth`
- [x] Atualizar `sign-up-form.tsx` para importar de `@/validators/auth`
- [x] Atualizar `patient-sign-up-form.tsx` para importar de `@/validators/auth`
- [x] Atualizar `complete-registration.tsx` para importar de `@/validators/auth`
- [x] Atualizar `google-oauth-complete.tsx` para importar de `@/validators/auth`
- [x] `completeRegistrationSchema` é definição única compartilhada entre as 2 páginas
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** RPR-09, RPR-10

**Commit:**
```
feat(validators): centralize auth schemas in src/validators/auth
```

---

## Parte 7 — `src/validators/suggestions.ts` P2

**Escopo:** Centralizar schemas de sugestões fora da árvore de páginas.

- [x] Criar `src/validators/suggestions.ts` exportando: `editSuggestionSchema`, `createSuggestionSchema` e seus tipos
- [x] Atualizar `edit-suggestion-form.tsx` para importar de `@/validators/suggestions`
- [x] Atualizar `create-suggestion.tsx` para importar de `@/validators/suggestions`
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** RPR-11, RPR-12

**Commit:**
```
feat(validators): centralize suggestion schemas in src/validators/suggestions
```

---

## Gate — Verificação Final

**Critério de saída:** todos os itens abaixo passam antes de abrir PR.

- [ ] `npx tsc --noEmit` → 0 erros
- [ ] `grep -r "z\.object" src/pages` → 0 resultados (nenhum schema inline restante)
- [ ] Step 4 modo criação: abre modal "Novo paciente" → step 4 exibe apenas UploadZone
- [ ] Step 4 modo edição: abre modal de edição → step 4 exibe AttachmentsList (grid 2 cols) + UploadZone
- [ ] Drag-drop: arrastar arquivo → borda azul; soltar → aparece na lista com tamanho legível
- [ ] Steps 1, 2, 3: navegação e validação sem regressões
- [ ] `register-patients/` raiz: exatamente 3 arquivos + pasta `steps/`
- [ ] `steps/`: exatamente 10 arquivos, sem subpastas

**Req cobertos:** RPR-13

---

## Rastreabilidade

| Req | Descrição | Parte | Status |
|-----|-----------|-------|--------|
| RPR-01 | `steps/` criada com 10 arquivos | 2 | ✅ impl |
| RPR-02 | Raiz com 3 arquivos + `steps/` | 2 | ✅ impl |
| RPR-03 | `attachments-list.tsx` nova UI/UX | 3 | ✅ impl |
| RPR-04 | `upload-zone.tsx` drag-drop UI | 4 | ✅ impl |
| RPR-05 | Step 4 container simplificado | 5 | ✅ impl |
| RPR-06 | `src/validators/patients.ts` criado | 1 | ✅ impl |
| RPR-07 | Consumers importam de `@/validators/patients` | 1 | ✅ impl |
| RPR-08 | Duplicatas deletados | 3 | ✅ impl |
| RPR-09 | `src/validators/auth.ts` criado | 6 | ✅ impl |
| RPR-10 | 5 arquivos auth atualizados | 6 | ✅ impl |
| RPR-11 | `src/validators/suggestions.ts` criado | 7 | ✅ impl |
| RPR-12 | 2 arquivos sugestão atualizados | 7 | ✅ impl |
| RPR-13 | `tsc --noEmit` zero erros | Gate | ⏳ pendente |
