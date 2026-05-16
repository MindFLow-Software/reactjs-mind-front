# Refatoração do Register Patients — Especificação

## Problema

A pasta `register-patients/` cresceu para 17 arquivos num layout plano — steps, componentes primitivos, estilos, constantes e schema convivem no mesmo nível sem hierarquia visual. Além disso, os schemas Zod estão espalhados por pastas de features em vez de centralizados por domínio, dificultando reuso e consistência. A refatoração entrega duas melhorias estruturais: agrupamento em subpasta dentro de `register-patients/`, e uma camada `src/validators/` que centraliza todos os schemas de formulário da aplicação.

Há também arquivos legados confiáveis (`attachments-list.tsx`, `delete-attachments-button.tsx`, `upload-zone.tsx`) que foram substituídos visualmente por arquivos novos mas com melhor UI/UX. A estratégia é inversa: portar a UI/UX nova para os arquivos antigos, que possuem lógica mais robusta, e descartar os duplicatas novos.

## Objetivos

- [ ] Reduzir carga cognitiva ao navegar em `register-patients/` movendo todos os arquivos para uma pasta `steps/` plana
- [ ] Atualizar `attachments-list.tsx` com a UI/UX do `step-documents.tsx` + `doc-card.tsx`, mantendo a lógica interna (query/mutation próprios)
- [ ] Atualizar `upload-zone.tsx` com a UI/UX do `upload-dropzone.tsx`, mantendo a lógica de validação existente
- [ ] Simplificar `register-patients.tsx`: step 4 usa `AttachmentsList` + `UploadZone` diretamente, removendo estado de attachments do container
- [ ] Estabelecer `src/validators/` como fonte de verdade para todos os schemas Zod, organizados por domínio
- [ ] Zero regressões — todos os imports resolvem, TypeScript compila sem erros

## Fora do Escopo

| Item | Motivo |
|---|---|
| Alterar comportamento ou props dos componentes | Refatoração estrutural pura — sem mudanças de lógica |
| Mover schema do `src/env.ts` | Validação de ambiente é infraestrutura, não domínio de formulário |
| Mover o `z.coerce` inline de `use-patient-filters.ts` | Expressão inline isolada, não é schema exportado |
| Refatorar estrutura das páginas de auth | Escopo separado |
| Refatorar UI das sugestões | Escopo separado |

---

## Estrutura de Pastas Após Refatoração

```
register-patients/
├── register-patients.tsx     ← modificado: remove query/state de attachments, step 4 usa AttachmentsList + UploadZone
├── constants.ts              ← sem alteração
├── form-styles.ts            ← sem alteração
└── steps/                   ← NOVA pasta (plana — componentes e steps juntos)
    ├── step-basic-data.tsx       mover + corrigir imports
    ├── step-contact-address.tsx  mover + corrigir imports
    ├── step-clinical.tsx         mover + corrigir imports
    ├── section-title.tsx         mover apenas
    ├── pill-radio.tsx            mover apenas
    ├── markdown-editor.tsx       mover apenas
    ├── patient-avatar-upload.tsx mover apenas
    ├── attachments-list.tsx      MOVER + ATUALIZAR UI/UX (ver abaixo)
    ├── delete-attachments-button.tsx  mover, sem alterações
    └── upload-zone.tsx           MOVER + ATUALIZAR UI/UX (ver abaixo)
```

**Arquivos deletados após migração:**
- `step-documents.tsx` — substituído por `attachments-list.tsx` atualizado + `upload-zone.tsx`
- `doc-card.tsx` — UI portada para dentro de `attachments-list.tsx`
- `upload-dropzone.tsx` — UI portada para `upload-zone.tsx`
- `schema.ts` — movido para `src/validators/patients.ts`

---

## Histórias de Usuário

### P1: Subpasta `steps/` plana dentro de `register-patients/` ⭐ MVP

**História**: Como desenvolvedor, quero todos os arquivos de `register-patients/` organizados dentro de `steps/` (plano, sem subpastas aninhadas) para localizar qualquer arquivo por propósito num único nível.

**Por que P1**: É a requisição principal — a pasta está em desenvolvimento ativo e o layout plano na raiz cria fricção de navegação.

**Critérios de Aceite**:

1. QUANDO o desenvolvedor abre `register-patients/` ENTÃO o sistema DEVE mostrar apenas: `steps/`, `register-patients.tsx`, `constants.ts`, `form-styles.ts`
2. QUANDO `steps/` é aberta ENTÃO o sistema DEVE conter os 10 arquivos: `step-basic-data.tsx`, `step-contact-address.tsx`, `step-clinical.tsx`, `section-title.tsx`, `pill-radio.tsx`, `markdown-editor.tsx`, `patient-avatar-upload.tsx`, `attachments-list.tsx`, `delete-attachments-button.tsx`, `upload-zone.tsx`
3. QUANDO `register-patients.tsx` importa componentes ENTÃO o sistema DEVE resolver caminhos via `./steps/*`
4. QUANDO arquivos dentro de `steps/` importam entre si ENTÃO o sistema DEVE usar caminhos relativos `./`
5. QUANDO o TypeScript build executa ENTÃO o sistema DEVE produzir zero erros de tipo

**Teste Independente**: `tsc --noEmit` — zero erros. Abrir pasta no IDE — hierarquia de subpasta visível.

---

### P1: Atualizar `attachments-list.tsx` com nova UI/UX ⭐ MVP

**História**: Como desenvolvedor, quero que `attachments-list.tsx` tenha a aparência visual do `step-documents.tsx` + `doc-card.tsx` (novos), mas mantenha sua lógica própria de query e mutation.

**Por que P1**: O arquivo legado tem arquitetura confiável (self-contained, sem prop drilling de query), mas a UI ficou desatualizada. Portar a UI nova preserva o melhor dos dois mundos.

**Critérios de Aceite**:

1. QUANDO `attachments-list.tsx` é renderizado ENTÃO o sistema DEVE exibir cabeçalho "Documentos enviados" com badge de contagem
2. QUANDO há documentos ENTÃO o sistema DEVE renderizá-los em grid `grid-cols-2 gap-2` com card compacto: badge de tipo com gradiente (PDF/IMG/DOC), nome do arquivo, tamanho, data, botões de visualizar + baixar + deletar
3. QUANDO está carregando ENTÃO o sistema DEVE exibir spinner `Loader2` centralizado
4. QUANDO não há documentos ENTÃO o sistema DEVE exibir borda tracejada com texto "Nenhum documento enviado ainda."
5. QUANDO o usuário deleta um documento ENTÃO `DeleteActionButton` DEVE ser usado (já existente no arquivo)
6. A prop signature DEVE permanecer `{ patientId: string }` — sem alteração de interface

**Teste Independente**: Abrir step 4 em modo edição — lista de documentos exibe no novo estilo.

---

### P1: Atualizar `upload-zone.tsx` com nova UI/UX ⭐ MVP

**História**: Como desenvolvedor, quero que `upload-zone.tsx` tenha drag-and-drop e a aparência visual do `upload-dropzone.tsx` (novo), mas mantenha sua lógica de validação e os limites atuais.

**Por que P1**: A lógica de validação do arquivo antigo (limite de 6 arquivos, 3MB, detecção de duplicatas) é confiável. A UI nova traz drag-and-drop que melhora a experiência.

**Critérios de Aceite**:

1. QUANDO o usuário arrasta arquivos sobre a zona ENTÃO o sistema DEVE mostrar feedback visual (borda e fundo azul)
2. QUANDO o usuário solta arquivos ENTÃO o sistema DEVE processar via lógica de validação existente (máx. 6 arquivos, 3MB/arquivo, sem duplicatas)
3. QUANDO há arquivos selecionados ENTÃO o sistema DEVE exibi-los em lista com botão de remover por item
4. QUANDO não há arquivos ENTÃO o sistema DEVE exibir dropzone com ícone e texto instrucionais
5. O tamanho dos arquivos DEVE ser exibido em formato legível (B / KB / MB)
6. A prop signature DEVE permanecer `{ selectedFiles: File[], onFilesChange: (files: File[]) => void }`

**Teste Independente**: Abrir step 4 — arrastar arquivo para a zona — arquivo aparece na lista com tamanho legível.

---

### P1: Simplificar step 4 em `register-patients.tsx` ⭐ MVP

**História**: Como desenvolvedor, quero que o step 4 use `AttachmentsList` + `UploadZone` diretamente, eliminando o state de attachments do container.

**Por que P1**: `StepDocuments` recebia query data, loading state e mutation via props — acoplamento desnecessário. `AttachmentsList` já gerencia isso internamente.

**Critérios de Aceite**:

1. QUANDO o step 4 é renderizado em modo edição ENTÃO o sistema DEVE renderizar `<AttachmentsList patientId={patient!.id} />` seguido de `<UploadZone />`
2. QUANDO o step 4 é renderizado em modo criação ENTÃO o sistema DEVE renderizar apenas `<UploadZone />`
3. `register-patients.tsx` DEVE remover: `useQuery` de attachments, `removeFn` mutation, `loadingDocs` state
4. `selectedFiles` state DEVE ser mantido (staging de arquivos antes do submit)
5. QUANDO o TypeScript build executa ENTÃO o sistema DEVE produzir zero erros

**Teste Independente**: Abrir modal de novo paciente e de edição — step 4 funciona corretamente em ambos os modos.

---

### P1: `src/validators/patients.ts` ⭐ MVP

**História**: Como desenvolvedor, quero `patientSchema` em `src/validators/patients.ts` para que o validator viva fora da árvore de páginas e possa ser reutilizado.

**Por que P1**: O schema de pacientes é o ponto de dor imediato que originou este refactor.

**Critérios de Aceite**:

1. QUANDO `src/validators/patients.ts` é criado ENTÃO o sistema DEVE exportar `patientSchema` e `PatientFormData` com assinaturas idênticas ao `schema.ts` atual
2. QUANDO `register-patients.tsx` e `step-basic-data.tsx` são atualizados ENTÃO o sistema DEVE importar de `@/validators/patients`
3. QUANDO o `schema.ts` original é removido ENTÃO o sistema DEVE produzir zero erros de import
4. QUANDO o TypeScript build executa ENTÃO o sistema DEVE produzir zero erros

**Teste Independente**: Deletar `schema.ts` — `tsc --noEmit` passa.

---

### P2: `src/validators/auth.ts`

**História**: Como desenvolvedor, quero todos os schemas Zod de autenticação centralizados em `src/validators/auth.ts`.

**Por que P2**: O domínio de pacientes é a necessidade imediata, mas auth tem 5 arquivos com schemas inline — extraí-los entrega o benefício completo da camada de validators.

**Critérios de Aceite**:

1. QUANDO `src/validators/auth.ts` é criado ENTÃO o sistema DEVE exportar: `signInSchema`, `signUpFormSchema`, `patientSignUpSchema`, `completeRegistrationSchema`, `googleOAuthCompleteSchema` e seus tipos inferidos
2. QUANDO os 5 arquivos consumidores são atualizados ENTÃO o sistema DEVE importar schemas de `@/validators/auth`
3. QUANDO o TypeScript build executa ENTÃO o sistema DEVE produzir zero erros

**Teste Independente**: Remover definições inline dos arquivos auth — `tsc --noEmit` passa.

---

### P2: `src/validators/suggestions.ts`

**História**: Como desenvolvedor, quero os schemas de sugestões centralizados em `src/validators/suggestions.ts`.

**Por que P2**: Mesma lógica do auth — fecha o loop de todos os schemas inline na codebase.

**Critérios de Aceite**:

1. QUANDO `src/validators/suggestions.ts` é criado ENTÃO o sistema DEVE exportar: `editSuggestionSchema`, `createSuggestionSchema` e seus tipos inferidos
2. QUANDO `edit-suggestion-form.tsx` e `create-suggestion.tsx` são atualizados ENTÃO o sistema DEVE importar de `@/validators/suggestions`
3. QUANDO o TypeScript build executa ENTÃO o sistema DEVE produzir zero erros

**Teste Independente**: Remover schemas inline dos arquivos de sugestão — `tsc --noEmit` passa.

---

## Casos de Borda

- QUANDO um schema é usado em apenas um arquivo ENTÃO o sistema DEVE ainda assim movê-lo para `validators/` — consistência acima de conveniência local
- QUANDO um validator referencia utilitário (ex: `isValidCPF`) ENTÃO o sistema DEVE manter o utilitário em `src/utils/` e importá-lo no arquivo validator
- `complete-registration.tsx` e `google-oauth-complete.tsx` usam schema idêntico (`completeSchema`) — o `src/validators/auth.ts` DEVE exportar uma única definição compartilhada

---

## Rastreabilidade de Requisitos

| ID | História | Fase | Status |
|---|---|---|---|
| RPR-01 | P1: pasta `steps/` criada com 10 arquivos | Tasks | Pendente |
| RPR-02 | P1: `register-patients.tsx` raiz com apenas 3 arquivos + `steps/` | Tasks | Pendente |
| RPR-03 | P1: `attachments-list.tsx` atualizado com nova UI/UX | Tasks | Pendente |
| RPR-04 | P1: `upload-zone.tsx` atualizado com drag-drop e nova UI | Tasks | Pendente |
| RPR-05 | P1: step 4 em `register-patients.tsx` simplificado | Tasks | Pendente |
| RPR-06 | P1: `src/validators/patients.ts` criado, `schema.ts` deletado | Tasks | Pendente |
| RPR-07 | P1: consumers de `patientSchema` importam de `@/validators/patients` | Tasks | Pendente |
| RPR-08 | P1: `step-documents.tsx`, `doc-card.tsx`, `upload-dropzone.tsx` deletados | Tasks | Pendente |
| RPR-09 | P2: `src/validators/auth.ts` criado com 5 schemas | Tasks | Pendente |
| RPR-10 | P2: 5 arquivos auth atualizados para importar de `@/validators/auth` | Tasks | Pendente |
| RPR-11 | P2: `src/validators/suggestions.ts` criado com 2 schemas | Tasks | Pendente |
| RPR-12 | P2: 2 arquivos de sugestão atualizados para importar de `@/validators/suggestions` | Tasks | Pendente |
| RPR-13 | All: `tsc --noEmit` passa com zero erros | Gate | Pendente |

**Cobertura:** 13 requisitos, 0 mapeados para tasks ainda, 13 não mapeados ⚠️

---

## Critérios de Sucesso

- [ ] `register-patients/` raiz contém exatamente 3 arquivos + pasta `steps/`
- [ ] `steps/` contém exatamente 10 arquivos (plano, sem subpastas)
- [ ] `src/validators/` contém `patients.ts`, `auth.ts`, `suggestions.ts` — nenhum schema inline restante em componentes de página
- [ ] `tsc --noEmit` retorna 0
- [ ] Step 4 funciona em modo criação e edição sem regressões
