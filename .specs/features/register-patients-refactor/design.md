# Register Patients Refactor — Design

## Problema

A pasta `register-patients/` acumulou 17 arquivos num layout plano sem hierarquia visual. Steps, componentes primitivos, estilos, constantes e schema conviviam no mesmo nível, criando fricção de navegação durante desenvolvimento ativo. Paralelamente, schemas Zod estavam espalhados por pastas de features sem camada centralizada, impedindo reuso e consistência entre domínios.

---

## Solução

Duas melhorias estruturais independentes, entregues juntas:

1. **Subpasta `steps/`** — todos os componentes de `register-patients/` movidos para uma subpasta plana, mantendo a raiz com apenas 3 arquivos + a pasta.
2. **Camada `src/validators/`** — todos os schemas Zod da aplicação centralizados por domínio (`patients`, `auth`, `suggestions`).

---

## Estrutura Antes / Depois

### Antes

```
register-patients/
├── register-patients.tsx
├── schema.ts
├── constants.ts
├── form-styles.ts
├── step-basic-data.tsx
├── step-contact-address.tsx
├── step-clinical.tsx
├── step-documents.tsx        ← duplicata (UI nova, lógica fraca)
├── section-title.tsx
├── pill-radio.tsx
├── markdown-editor.tsx
├── patient-avatar-upload.tsx
├── attachments-list.tsx      ← lógica robusta, UI desatualizada
├── delete-attachments-button.tsx
├── upload-zone.tsx           ← lógica robusta, UI desatualizada
├── doc-card.tsx              ← duplicata (UI nova)
└── upload-dropzone.tsx       ← duplicata (UI nova)
```

### Depois

```
register-patients/
├── register-patients.tsx     ← step 4 simplificado
├── constants.ts
├── form-styles.ts
└── steps/
    ├── step-basic-data.tsx
    ├── step-contact-address.tsx
    ├── step-clinical.tsx
    ├── section-title.tsx
    ├── pill-radio.tsx
    ├── markdown-editor.tsx
    ├── patient-avatar-upload.tsx
    ├── attachments-list.tsx  ← UI portada dos duplicatas, lógica mantida
    ├── delete-attachments-button.tsx
    └── upload-zone.tsx       ← UI portada, drag-drop adicionado

src/validators/
├── patients.ts
├── auth.ts
└── suggestions.ts
```

---

## Decisões de Design

### `steps/` plana, sem subpastas aninhadas

A pasta tem componentes de naturezas diferentes (steps de formulário, primitivos de UI, utilitários de upload). Agrupar por tipo criaria subpastas com 2–3 arquivos cada, forçando navegação vertical para tarefas simples. Uma camada plana com nomes descritivos permite localizar qualquer arquivo sem precisar inferir a qual subgrupo ele pertence.

### Portar UI nova para arquivos legados

Os arquivos legados (`attachments-list.tsx`, `upload-zone.tsx`) tinham lógica de query/mutation auto-gerenciada e validação de upload confiável. Os duplicatas novos (`step-documents.tsx`, `doc-card.tsx`, `upload-dropzone.tsx`) tinham UI superior mas recebiam dados via props — acoplamento que exigiria refatoração do container. A estratégia inversa (porta a UI nova para os legados) preserva a lógica robusta e descarta o acoplamento desnecessário.

### `AttachmentsList` self-contained

O componente gerencia internamente seu próprio `useQuery` e `useMutation`. Isso elimina prop drilling de estado remoto (`attachments`, `loadingDocs`, `onDelete`) que o container `register-patients.tsx` não deveria conhecer. O `patientId` é suficiente para o componente ser autônomo.

### `src/validators/` por domínio

Schemas Zod colocados junto aos componentes que os usam criam dependência implícita entre camadas e impedem reuso. A camada `validators/` separa a lógica de validação da lógica de renderização, seguindo o mesmo princípio que `src/api/` aplica para chamadas HTTP. Cada arquivo agrupa schemas pelo domínio do negócio, não pelo arquivo que o usa.

---

## Mapa de Arquivos

### Movidos para `steps/` (sem alteração de conteúdo)

| Arquivo | Alteração |
|---------|-----------|
| `section-title.tsx` | nenhuma |
| `pill-radio.tsx` | nenhuma |
| `markdown-editor.tsx` | nenhuma |
| `patient-avatar-upload.tsx` | nenhuma |
| `delete-attachments-button.tsx` | nenhuma |
| `step-basic-data.tsx` | imports de `./schema` → `@/validators/patients`; `./constants` → `../constants`; `./form-styles` → `../form-styles` |
| `step-contact-address.tsx` | mesmo padrão de imports |
| `step-clinical.tsx` | mesmo padrão de imports |

### Movidos + UI atualizada

| Arquivo | O que mudou |
|---------|-------------|
| `attachments-list.tsx` | Header com ícone + badge de contagem; empty state com borda tracejada; grid `grid-cols-2`; DocCard inline (gradiente PDF/IMG/DOC, formatBytes, Eye + Download + Delete) |
| `upload-zone.tsx` | Drag-drop com `isDrag` state; `<label>` com handlers; formatBytes; prop signature mantida |

### Criados

| Arquivo | Conteúdo |
|---------|----------|
| `src/validators/patients.ts` | `patientSchema`, `PatientFormData` |
| `src/validators/auth.ts` | `signInSchema`, `signUpFormSchema`, `patientSignUpSchema`, `completeRegistrationSchema` + tipos |
| `src/validators/suggestions.ts` | `editSuggestionSchema`, `createSuggestionSchema` + tipos |

### Deletados

| Arquivo | Motivo |
|---------|--------|
| `step-documents.tsx` | substituído por `AttachmentsList` + `UploadZone` direto no container |
| `doc-card.tsx` | UI portada para dentro de `attachments-list.tsx` |
| `upload-dropzone.tsx` | UI portada para `upload-zone.tsx` |
| `schema.ts` | movido para `src/validators/patients.ts` |
| 10 originais da raiz | movidos para `steps/` |

---

## Camada de Validators

### `src/validators/patients.ts`

```ts
patientSchema         // z.object com firstName, lastName, cpf, email, dateOfBirth, gender
PatientFormData       // z.infer<typeof patientSchema>
```

Consumido por: `register-patients.tsx`, `steps/step-basic-data.tsx`, `steps/step-contact-address.tsx`

### `src/validators/auth.ts`

```ts
signInSchema               // email + password
signUpFormSchema            // cadastro de psicólogo (nome, CPF, data, gênero, senha forte)
patientSignUpSchema         // cadastro de paciente
completeRegistrationSchema  // CRP + expertise + gênero (compartilhado entre 2 páginas)

SignInSchema, SignUpFormData, PatientSignUpSchema, CompleteRegistrationSchema
```

Consumido por: `sign-in-form.tsx`, `sign-up-form.tsx`, `patient-sign-up-form.tsx`, `complete-registration.tsx`, `google-oauth-complete.tsx`

### `src/validators/suggestions.ts`

```ts
editSuggestionSchema    // title + category + description
createSuggestionSchema  // title + description + category (enum com 6 valores)

EditSuggestionSchema, CreateSuggestionSchema
```

Consumido por: `edit-suggestion-form.tsx`, `create-suggestion.tsx`

---

## Critérios de Sucesso

| Critério | Como verificar |
|----------|---------------|
| Estrutura de pastas correta | `register-patients/` raiz: 3 arquivos + `steps/`; `steps/`: 10 arquivos, sem subpastas |
| Nenhum schema inline | `grep -r "z\.object" src/pages` — zero resultados |
| TypeScript limpo | `tsc --noEmit` → zero erros |
| Step 4 modo criação | Abrir modal "Novo paciente" → step 4 exibe apenas `UploadZone` |
| Step 4 modo edição | Abrir modal de edição → step 4 exibe `AttachmentsList` (grid 2 cols) + `UploadZone` |
| Drag-drop funcional | Arrastar arquivo sobre o dropzone → borda azul; soltar → arquivo aparece na lista com tamanho legível |
