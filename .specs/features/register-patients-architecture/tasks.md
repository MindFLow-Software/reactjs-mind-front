# Register Patients Architecture Refactor — Tasks

**Design**: `.specs/features/register-patients-architecture/design.md`
**Status**: Draft

---

## Execution Plan

### Phase 1 — Foundation (Parallel)

Mudanças independentes de tipos, schema, API layer e arquivos auxiliares.

```
T1 [P] ──────────────────────────────┐
T3 [P] ──────────────────────────────┤
T4 [P] ──────────────────────────────┤──→ Phase 2
T5 [P] ──────────────────────────────┤
T6 [P] ──────────────────────────────┘
```

### Phase 2 — API Layer & Orchestrator (Sequential)

T2 aguarda T1 (precisa de email no tipo). T7 aguarda T1+T2+T3+T4 (tipos, API layer e schema prontos).

```
T1 → T2 ──┐
T3 ────────┼──→ T7
T4 ────────┘
```

### Phase 3 — Steps (Parallel) + Cleanup (Sequential)

Steps são arquivos independentes — rodam em paralelo após T7. T11 aguarda T9+T10 (remove imports que só somem depois dos selects substituídos). T12 aguarda T7 (orquestrador não importa mais o hook).

```
         ┌──→ T8  [P] ──────────────────┐
         ├──→ T9  [P] ──┐               │
T7 ──────┤──→ T10 [P] ──┼──→ T11       ├──→ T12 [P]
         └──→ T12 [P] ──┘               │
                                        └── (ver Phase 4)
```

### Phase 4 — CSS Standardization: patient-input (Sequential)

T13 cria a classe CSS. T14 depende de T13 (precisa da classe existir) e de T8+T9+T10 (steps já usam `inputCls` via import). T15 depende de T14 (só deleta quando não há mais consumers).

```
T13 → T14 → T15 → (ver Phase 5)
```

### Phase 5 — CSS por Componente (Sequential + Parallel)

T16 expande `form-components.css` com classes shared + modal + section-title. T17–T27 dependem de T16 (usam classes shared) mas são independentes entre si — rodam em paralelo.

```
T16 ──┬──→ T17 [P]
      ├──→ T18 [P]
      ├──→ T19 [P]
      ├──→ T20 [P]
      ├──→ T21 [P]
      ├──→ T22 [P]
      ├──→ T23 [P]
      ├──→ T24 [P]
      ├──→ T25 [P]
      ├──→ T26 [P]
      └──→ T27 [P]
      → pnpm build final
```

---

## Task Breakdown

### T1: Adicionar `email` ao `CreatePatientBody` [P]

**What**: Adicionar `email?: string` à interface `CreatePatientBody`
**Where**: `src/types/patient.ts`
**Depends on**: Nenhuma
**Reuses**: Padrão de campos opcionais existentes no arquivo
**Requirement**: RPA-09

**Done when**:

- [ ] `CreatePatientBody` tem `email?: string`
- [ ] Nenhum outro campo alterado
- [ ] Gate: `pnpm build` passa sem erros de tipo

**Tests**: none
**Gate**: build
**Commit**: `fix(types): add email to CreatePatientBody`

---

### T2: Atualizar `create-patient.ts` — mask cleanup

**What**: Adicionar strip de dígitos para `phoneNumber` e `cep` na camada de API; garantir que `email` passa pelo payload
**Where**: `src/api/patients/create-patient.ts`
**Depends on**: T1
**Reuses**: Padrão de `cpf.replace(/\D/g, '')` já presente no arquivo
**Requirement**: RPA-05, RPA-09

**Done when**:

- [ ] `phoneNumber` tem `.replace(/\D/g, '') || undefined`
- [ ] `cep` tem `.replace(/\D/g, '') || undefined`
- [ ] `email` está presente no `formattedData` (não filtrado)
- [ ] `dateOfBirth` mantém `.toISOString()` (já correto)
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `fix(api): strip phoneNumber and cep masks in create-patient`

---

### T3: Atualizar `update-patient.ts` — unificar serialização de data [P]

**What**: Trocar `format(d, 'yyyy-MM-dd')` por `.toISOString()`; adicionar strip de `phoneNumber` e `cep`; remover import de `format` do `date-fns`
**Where**: `src/api/patients/update-patient.ts`
**Depends on**: Nenhuma
**Reuses**: Padrão de `.toISOString()` do `create-patient.ts`
**Requirement**: RPA-05

**Done when**:

- [ ] `dateOfBirth` serializado com `.toISOString()` (não `format`)
- [ ] `import { format } from 'date-fns'` removido
- [ ] `phoneNumber` tem `.replace(/\D/g, '') || undefined`
- [ ] `cep` tem `.replace(/\D/g, '') || undefined`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `fix(api): unify dateOfBirth serialization and strip masks in update-patient`

---

### T4: Estender `patientSchema` com campos clínicos, preprocess e transform [P]

**What**: Adicionar 5 campos clínicos com defaults; atualizar `dateOfBirth` com `z.preprocess`; atualizar `cpf` com `z.transform` para strip da máscara
**Where**: `src/validators/patients.ts`
**Depends on**: Nenhuma
**Reuses**: `isValidCPF` de `@/utils/validate-cpf`; sintaxe Zod v4 já usada no arquivo
**Requirement**: RPA-02, RPA-03, RPA-09

**Done when**:

- [ ] `modality: z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO']).default('ONLINE')` presente
- [ ] `frequency: z.string().default('Semanal')` presente
- [ ] `price: z.string().optional().default('')` presente
- [ ] `source: z.string().optional().default('')` presente
- [ ] `notes: z.string().optional().default('')` presente
- [ ] `dateOfBirth` usa `z.preprocess((val) => val instanceof Date || val === null ? val : null, z.date()...)`
- [ ] `cpf` usa `.transform((v) => v?.replace(/\D/g, '') ?? '')` antes do `.refine`
- [ ] `PatientFormData` exportado infere todos os novos campos
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `feat(schema): add clinical fields, preprocess dateOfBirth, transform cpf`

---

### T5: Remover `"use client"` e corrigir inline styles em `attachments-list.tsx` [P]

**What**: Remover diretiva `"use client"` do topo; substituir `style={{ width: 36, height: 44 }}` por `className="w-9 h-11"`
**Where**: `src/pages/app/patients/patients-list/register-patients/steps/attachments-list.tsx`
**Depends on**: Nenhuma
**Requirement**: RPA-09

**Done when**:

- [ ] Linha `"use client"` removida
- [ ] `style={{ width: 36, height: 44 }}` substituído por `className="w-9 h-11"`
- [ ] O triângulo `style={{ borderWidth: ... }}` permanece inline (CSS trick sem equivalente Tailwind)
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `fix(attachments-list): remove use client directive and replace inline dimensions`

---

### T6: Remover `"use client"` de `upload-zone.tsx` [P]

**What**: Remover a diretiva `"use client"` do topo do arquivo
**Where**: `src/pages/app/patients/patients-list/register-patients/steps/upload-zone.tsx`
**Depends on**: Nenhuma
**Requirement**: RPA-09

**Done when**:

- [ ] Linha `"use client"` removida
- [ ] Nenhuma outra alteração
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `fix(upload-zone): remove use client directive`

---

### T7: Refatorar orquestrador `register-patients.tsx`

**What**: Remover draft, dividir mutations, envolver form em `<Form>` (FormProvider), limpar estados e props de steps, corrigir inline style e handleSubmitClick
**Where**: `src/pages/app/patients/patients-list/register-patients/register-patients.tsx`
**Depends on**: T1, T2, T3, T4
**Reuses**: `Form` de `@/components/ui/form`; `createPatients`, `updatePatients` das APIs
**Requirement**: RPA-01, RPA-02, RPA-03, RPA-04, RPA-06, RPA-09

**Remoções**:
- `import { usePatientDraft }` e todo uso de `readDraft`, `writeDraft`, `clearDraft`, `draft`
- `useState` de `birthInput`
- 5 `useState` de campos clínicos (`modality`, `frequency`, `price`, `source`, `notes`)
- `handleBirthChange` e `handlePriceChange`
- `useEffect` de auto-save (600ms debounce)
- `trigger()` em `handleSubmitClick`
- Referências a `draft?.field` nos `defaultValues`

**Adições**:
- `import { Form } from '@/components/ui/form'`
- Dois `useMutation` separados: `createFn` / `updateFn`
- `isBusy = isCreating || isUpdating || isUploading`
- `<Form {...methods}>` envolvendo o body do wizard

**Atualizações**:
- `defaultValues`: somente `patient?.field ?? ""` + defaults clínicos explícitos
- `useState<StepId>(1)` sem `draft.step`
- `onSubmit`: desestruturar `{ modality, frequency, price, source, notes, ...patientPayload } = data`; remover cleanup manual de máscaras
- `handleSubmitClick`: apenas `handleSubmit(onSubmit)()`
- Props dos steps: `<StepBasicData onAvatarSelect patient />`, `<StepContactAddress onCepBlur isCepLoading />`, `<StepClinical />`
- `style={{ maxHeight: "92vh" }}` → `className="max-h-[92vh]"`

**Done when**:

- [ ] Nenhum `usePatientDraft` no arquivo
- [ ] Nenhum `useState` de campo de formulário exceto `avatarFile`, `selectedFiles`, `isUploading`, `isCepLoading`, `step`
- [ ] Dois `useMutation` separados presentes
- [ ] `<Form {...methods}>` envolvendo o conteúdo
- [ ] `handleSubmitClick` não chama `trigger()`
- [ ] `style={{ maxHeight: "92vh" }}` ausente
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(register-patients): remove draft, split mutations, add FormProvider`

---

### T8: Refatorar `StepBasicData` — useFormContext + FormField [P]

**What**: Migrar para `useFormContext`, mover `birthInput` para estado local, converter todos os campos para padrão `<FormField>` + `<FormMessage>`
**Where**: `src/pages/app/patients/patients-list/register-patients/steps/step-basic-data.tsx`
**Depends on**: T4, T7
**Reuses**: `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` de `@/components/ui/form`; `useFormContext` do `react-hook-form`; `inputCls` de `../form-styles`; `format` do `date-fns`
**Requirement**: RPA-01, RPA-03, RPA-08

**Remoções da interface**:
- `register`, `control`, `errors`, `birthInput`, `onBirthChange`, `cpfDigits`

**Adições**:
- `const { control, getValues } = useFormContext<PatientFormData>()`
- `const [birthInput, setBirthInput] = useState(() => { const d = getValues("dateOfBirth"); return d instanceof Date ? format(d, "dd/MM/yyyy") : "" })`
- `const cpfValue = useWatch({ control, name: "cpf" })` + `cpfDigits` derivado localmente
- `handleBirthChange` movido do orquestrador para cá

**Padrão de campo** (aplicar em `firstName`, `lastName`, `cpf`, `dateOfBirth`, `gender`):
```tsx
<FormField control={control} name="firstName" render={({ field }) => (
  <FormItem>
    <FormLabel>Nome <span className="text-red-600">*</span></FormLabel>
    <FormControl><Input {...field} .../></FormControl>
    <FormMessage />
  </FormItem>
)} />
```

**Done when**:

- [ ] Interface tem apenas `onAvatarSelect` e `patient?`
- [ ] Nenhum `register`, `control`, `errors` recebidos como props
- [ ] `birthInput` é `useState` local
- [ ] `cpfDigits` derivado via `useWatch`
- [ ] Nenhum `<p className="text-red-600">` manual
- [ ] Todos os campos usam `<FormField>` + `<FormMessage>`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(step-basic-data): useFormContext, local birthInput, FormField pattern`

---

### T9: Refatorar `StepContactAddress` — useFormContext + shadcn Select para UF [P]

**What**: Migrar para `useFormContext`, remover props de form, substituir `<select>` nativo do UF por `<Select>` shadcn, converter campos para `<FormField>`
**Where**: `src/pages/app/patients/patients-list/register-patients/steps/step-contact-address.tsx`
**Depends on**: T4, T7
**Reuses**: `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` de `@/components/ui/form`; `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` de `@/components/ui/select`; `UF_LIST` de `@/utils/mappers`; `inputCls` de `../form-styles`
**Requirement**: RPA-01, RPA-07, RPA-08

**Remoções da interface**:
- `register`, `control`, `errors`

**Mantém**:
- `onCepBlur: () => void`
- `isCepLoading: boolean`

**Done when**:

- [ ] Interface tem apenas `onCepBlur` e `isCepLoading`
- [ ] `import { selectCls, selectClassName }` removido
- [ ] `<select>` nativo ausente — substituído por `<Select>` shadcn
- [ ] Todos os campos usam `<FormField>` + `<FormMessage>`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(step-contact-address): useFormContext, shadcn Select for UF, FormField pattern`

---

### T10: Refatorar `StepClinical` — useFormContext + shadcn Select para frequência [P]

**What**: Remover todas as props value/onChange, migrar para `useFormContext`, mover `handlePriceChange` para cá, substituir `<select>` de frequência por `<Select>` shadcn, converter campos para `<FormField>`
**Where**: `src/pages/app/patients/patients-list/register-patients/steps/step-clinical.tsx`
**Depends on**: T4, T7
**Reuses**: `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` de `@/components/ui/form`; `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem` de `@/components/ui/select`; `inputCls` de `../form-styles`; `MarkdownEditor` já existente
**Requirement**: RPA-01, RPA-02, RPA-07, RPA-08

**Remoções da interface**:
- `modality`, `onModalityChange`, `frequency`, `onFrequencyChange`, `price`, `onPriceChange`, `source`, `onSourceChange`, `notes`, `onNotesChange`

**Adições**:
- `const { control } = useFormContext<PatientFormData>()`
- `handlePriceChange` local: lê `field.value`, formata, chama `field.onChange`

**Done when**:

- [ ] Interface vazia (sem props)
- [ ] `import { selectCls, selectClassName }` removido
- [ ] `<select>` nativo ausente — frequência usa `<Select>` shadcn
- [ ] Todos os campos usam `<FormField>` + `<FormMessage>`
- [ ] `MarkdownEditor` conectado via `FormField` com `field.value` e `field.onChange`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(step-clinical): useFormContext, shadcn Select for frequency, FormField pattern`

---

### T11: Limpar `form-styles.ts` — remover selectCls e selectClassName

**What**: Remover as exportações `selectCls: CSSProperties` e `selectClassName`; manter apenas `inputCls`
**Where**: `src/pages/app/patients/patients-list/register-patients/form-styles.ts`
**Depends on**: T9, T10
**Requirement**: RPA-07

**Done when**:

- [ ] `selectCls` ausente
- [ ] `selectClassName` ausente
- [ ] `import type { CSSProperties }` removido (não mais necessário)
- [ ] `inputCls` permanece intacto
- [ ] Gate: `pnpm build` passa sem erros de import

**Tests**: none
**Gate**: build
**Commit**: `refactor(form-styles): remove selectCls and selectClassName`

---

### T12: Deletar `use-patient-draft.ts` [P]

**What**: Verificar ausência de outros consumidores e deletar o arquivo
**Where**: `src/hooks/use-patient-draft.ts`
**Depends on**: T7
**Requirement**: RPA-06

**Done when**:

- [ ] Nenhum import de `use-patient-draft` encontrado via grep no projeto
- [ ] Arquivo deletado
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(hooks): delete use-patient-draft (draft persistence removed)`

---

### T13: Criar `form-components.css` com `.patient-input` via `@apply`

**What**: Criar arquivo CSS co-localizado com a feature; adicionar `import` no orchestrador
**Where**: `src/pages/app/patients/patients-list/register-patients/form-components.css` (novo); `register-patients.tsx`
**Depends on**: Nenhuma
**Reuses**: Classes Tailwind já usadas em `inputCls` em `form-styles.ts`
**Requirement**: RPA-10

**Done when**:

- [ ] `form-components.css` existe com `@layer components { .patient-input { @apply ... } }`
- [ ] `register-patients.tsx` tem `import "./form-components.css"` no topo
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `feat(styles): add patient-input CSS class via @apply`

---

### T14: Substituir `inputCls` por `"patient-input"` nos steps [P]

**What**: Remover import de `inputCls` e substituir todas as ocorrências pela string `"patient-input"` nos 3 steps
**Where**: `step-basic-data.tsx`, `step-contact-address.tsx`, `step-clinical.tsx`
**Depends on**: T13
**Reuses**: `cn()` já em uso em todos os steps
**Requirement**: RPA-10

**Done when**:

- [ ] `import { inputCls } from "../form-styles"` removido dos 3 arquivos
- [ ] Todas as ocorrências de `inputCls` substituídas por `"patient-input"`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(steps): replace inputCls JS constant with patient-input CSS class`

---

### T15: Deletar `form-styles.ts`

**What**: Verificar ausência de consumers e deletar o arquivo
**Where**: `src/pages/app/patients/patients-list/register-patients/form-styles.ts`
**Depends on**: T14
**Requirement**: RPA-10

**Done when**:

- [ ] Nenhum import de `form-styles` encontrado via grep no projeto
- [ ] Arquivo deletado
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(form-styles): delete file — replaced by patient-input CSS class`

---

### T16: Expandir `form-components.css` com classes shared + modal + section-title

**What**: Adicionar ao arquivo existente: classes de grid, hints, ícone prefix, section-title e todas as classes do modal (`.rp-modal-*`, `.rp-btn-*`)
**Where**: `src/pages/app/patients/patients-list/register-patients/form-components.css`
**Depends on**: T13 (arquivo já existe)
**Requirement**: RPA-10

**Done when**:

- [ ] `.patient-form-grid-2`, `.patient-form-grid-3` presentes
- [ ] `.patient-field-hint`, `.patient-icon-prefix`, `.patient-value-hint` presentes
- [ ] `.rp-section-title`, `__icon`, `__label` presentes
- [ ] `.rp-modal-*` e `.rp-btn-*` presentes
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `feat(styles): expand form-components.css with shared and modal classes`

---

### T17: Atualizar `register-patients.tsx` — aplicar classes do modal [P]

**What**: Substituir strings Tailwind longas no modal pelas classes CSS do `form-components.css`
**Where**: `src/pages/app/patients/patients-list/register-patients/register-patients.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `DialogContent` usa `"rp-modal"`
- [ ] Header, stepper, progress, body, footer usam classes `rp-modal-*`
- [ ] Botões usam `"rp-btn-secondary"` / `"rp-btn-primary"`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(register-patients): apply rp-modal and rp-btn CSS classes`

---

### T18: `section-title.css` + atualizar `section-title.tsx` [P]

**What**: Criar CSS co-localizado; atualizar TSX para usar `.rp-section-title*` do `form-components.css`
**Where**: `steps/section-title.css`, `steps/section-title.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/section-title.css` existe com `@reference` e `@layer components {}`
- [ ] `section-title.tsx` importa `"./section-title.css"` e usa `.rp-section-title*`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(section-title): add CSS file, apply rp-section-title classes`

---

### T19: `pill-radio.css` + atualizar `pill-radio.tsx` [P]

**What**: Criar CSS com classes `.rp-pill-radio*`; atualizar TSX
**Where**: `steps/pill-radio.css`, `steps/pill-radio.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/pill-radio.css` existe com `.rp-pill-radio`, `.rp-pill-radio__label`, `--checked`, `--unchecked`
- [ ] `pill-radio.tsx` importa `"./pill-radio.css"` e usa as classes via `cn()`
- [ ] `checkedCls` do prop continua inline (override por opção)
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(pill-radio): add CSS file, apply rp-pill-radio classes`

---

### T20: `patient-avatar-upload.css` + atualizar `.tsx` [P]

**What**: Criar CSS com classes `.rp-avatar-*`; atualizar TSX
**Where**: `steps/patient-avatar-upload.css`, `steps/patient-avatar-upload.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/patient-avatar-upload.css` existe com classes `.rp-avatar-*`
- [ ] `patient-avatar-upload.tsx` importa o CSS e usa as classes
- [ ] `style={{ background: "linear-gradient(...)" }}` e `style={{ background: "rgba(...)" }}` permanecem (sem equivalente Tailwind)
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(patient-avatar-upload): add CSS file, apply rp-avatar classes`

---

### T21: `markdown-editor.css` + atualizar `.tsx` [P]

**What**: Criar CSS com classes `.rp-md-editor*`; converter `style={{minHeight}}` para `@apply`; atualizar TSX
**Where**: `steps/markdown-editor.css`, `steps/markdown-editor.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/markdown-editor.css` existe com todas as classes `.rp-md-editor*`
- [ ] `.rp-md-editor__textarea` inclui `@apply min-h-[160px]`
- [ ] `.rp-md-editor__preview` inclui `@apply min-h-[160px] max-h-[340px]`
- [ ] `markdown-editor.tsx` remove ambos os `style={{ minHeight }}` e usa as classes
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(markdown-editor): add CSS file, apply rp-md-editor classes`

---

### T22: `attachments-list.css` + atualizar `.tsx` [P]

**What**: Criar CSS com classes `.rp-att-*`; atualizar TSX para usar shared section-title + att classes
**Where**: `steps/attachments-list.css`, `steps/attachments-list.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/attachments-list.css` existe com classes `.rp-att-*`
- [ ] `attachments-list.tsx` importa o CSS e usa `.rp-att-*` e `.rp-section-title*`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(attachments-list): add CSS file, apply rp-att classes`

---

### T23: `upload-zone.css` + atualizar `.tsx` [P]

**What**: Criar CSS com classes `.rp-upload-*`; atualizar TSX
**Where**: `steps/upload-zone.css`, `steps/upload-zone.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/upload-zone.css` existe com `.rp-upload-zone` (+`--drag`, `--idle`) e `.rp-upload-file-*`
- [ ] `upload-zone.tsx` importa o CSS e usa as classes via `cn()`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(upload-zone): add CSS file, apply rp-upload classes`

---

### T24: `delete-attachments-button.css` + atualizar `.tsx` [P]

**What**: Criar CSS com classes `.rp-delete-*`; atualizar TSX
**Where**: `steps/delete-attachments-button.css`, `steps/delete-attachments-button.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/delete-attachments-button.css` existe com classes `.rp-delete-*`
- [ ] `delete-attachments-button.tsx` importa o CSS e usa as classes
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(delete-attachments-button): add CSS file, apply rp-delete classes`

---

### T25: `step-basic-data.css` + atualizar `.tsx` [P]

**What**: Criar CSS com `.rp-cpf-check`; atualizar TSX para usar classes shared do `form-components.css`
**Where**: `steps/step-basic-data.css`, `steps/step-basic-data.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/step-basic-data.css` existe com `.rp-cpf-check`
- [ ] `step-basic-data.tsx` importa o CSS, usa `patient-form-grid-2`, `patient-field-hint`, `patient-value-hint`, `rp-cpf-check`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(step-basic-data): add CSS file, apply patient-form and rp-cpf-check classes`

---

### T26: `step-contact-address.css` + atualizar `.tsx` [P]

**What**: Criar CSS co-localizado (sem classes exclusivas); atualizar TSX para usar classes shared
**Where**: `steps/step-contact-address.css`, `steps/step-contact-address.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/step-contact-address.css` existe com `@reference` e `@layer components {}`
- [ ] `step-contact-address.tsx` importa o CSS, usa `patient-form-grid-2/3`, `patient-icon-prefix`, `patient-field-hint`
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(step-contact-address): add CSS file, apply patient-form and patient-icon-prefix classes`

---

### T27: `step-clinical.css` + atualizar `.tsx` [P]

**What**: Criar CSS com `.rp-clinical-grid` e `.rp-price-prefix`; atualizar TSX
**Where**: `steps/step-clinical.css`, `steps/step-clinical.tsx`
**Depends on**: T16
**Requirement**: RPA-10

**Done when**:

- [ ] `steps/step-clinical.css` existe com `.rp-clinical-grid` (gap-y-4) e `.rp-price-prefix`
- [ ] `step-clinical.tsx` importa o CSS e usa as classes
- [ ] Gate: `pnpm build` passa

**Tests**: none
**Gate**: build
**Commit**: `refactor(step-clinical): add CSS file, apply rp-clinical-grid and rp-price-prefix classes`

---

## Granularity Check

| Task | Escopo | Status |
|------|--------|--------|
| T1: Fix CreatePatientBody | 1 interface, 1 campo | ✅ Atômica |
| T2: create-patient API | 1 arquivo, 2 campos novos | ✅ Atômica |
| T3: update-patient API | 1 arquivo, serialização + strips | ✅ Atômica |
| T4: patientSchema | 1 arquivo, schema coeso | ✅ Atômica |
| T5: attachments-list cleanup | 1 arquivo, 2 linhas | ✅ Atômica |
| T6: upload-zone cleanup | 1 arquivo, 1 linha | ✅ Atômica |
| T7: register-patients orchestrador | 1 arquivo, alterações coesas | ✅ OK (cohesive) |
| T8: StepBasicData | 1 arquivo componente | ✅ Atômica |
| T9: StepContactAddress | 1 arquivo componente | ✅ Atômica |
| T10: StepClinical | 1 arquivo componente | ✅ Atômica |
| T11: form-styles cleanup | 1 arquivo, 2 exports removidos | ✅ Atômica |
| T12: delete use-patient-draft | 1 arquivo deletado | ✅ Atômica |
| T13: form-components.css | 1 arquivo novo + 1 import | ✅ Atômica |
| T14: substituir inputCls nos steps | 3 arquivos, busca/substitui | ✅ Atômica |
| T15: delete form-styles.ts | 1 arquivo deletado | ✅ Atômica |
| T16: expand form-components.css | 1 arquivo CSS, classes shared + modal | ✅ Coeso |
| T17: register-patients modal classes | 1 TSX | ✅ Atômica |
| T18: section-title CSS | 1 CSS + 1 TSX | ✅ Atômica |
| T19: pill-radio CSS | 1 CSS + 1 TSX | ✅ Atômica |
| T20: patient-avatar-upload CSS | 1 CSS + 1 TSX | ✅ Atômica |
| T21: markdown-editor CSS | 1 CSS + 1 TSX + converte style inline | ✅ Atômica |
| T22: attachments-list CSS | 1 CSS + 1 TSX | ✅ Atômica |
| T23: upload-zone CSS | 1 CSS + 1 TSX | ✅ Atômica |
| T24: delete-attachments-button CSS | 1 CSS + 1 TSX | ✅ Atômica |
| T25: step-basic-data CSS | 1 CSS + 1 TSX | ✅ Atômica |
| T26: step-contact-address CSS | 1 CSS + 1 TSX | ✅ Atômica |
| T27: step-clinical CSS | 1 CSS + 1 TSX | ✅ Atômica |

---

## Diagram-Definition Cross-Check

| Task | Depends On (task body) | Diagrama mostra | Status |
|------|------------------------|-----------------|--------|
| T1 | Nenhuma | Fase 1 paralela | ✅ |
| T2 | T1 | T1 → T2 | ✅ |
| T3 | Nenhuma | Fase 1 paralela | ✅ |
| T4 | Nenhuma | Fase 1 paralela | ✅ |
| T5 | Nenhuma | Fase 1 paralela | ✅ |
| T6 | Nenhuma | Fase 1 paralela | ✅ |
| T7 | T1, T2, T3, T4 | T2+T3+T4 → T7 | ✅ |
| T8 | T4, T7 | T7 → T8 [P] | ✅ |
| T9 | T4, T7 | T7 → T9 [P] | ✅ |
| T10 | T4, T7 | T7 → T10 [P] | ✅ |
| T11 | T9, T10 | T9+T10 → T11 | ✅ |
| T12 | T7 | T7 → T12 [P] | ✅ |
| T13 | Nenhuma | Phase 4 sequencial | ✅ |
| T14 | T13 | T13 → T14 | ✅ |
| T15 | T14 | T14 → T15 | ✅ |
| T16 | T13 | Phase 5 sequencial | ✅ |
| T17 | T16 | T16 → T17 [P] | ✅ |
| T18 | T16 | T16 → T18 [P] | ✅ |
| T19 | T16 | T16 → T19 [P] | ✅ |
| T20 | T16 | T16 → T20 [P] | ✅ |
| T21 | T16 | T16 → T21 [P] | ✅ |
| T22 | T16 | T16 → T22 [P] | ✅ |
| T23 | T16 | T16 → T23 [P] | ✅ |
| T24 | T16 | T16 → T24 [P] | ✅ |
| T25 | T16 | T16 → T25 [P] | ✅ |
| T26 | T16 | T16 → T26 [P] | ✅ |
| T27 | T16 | T16 → T27 [P] | ✅ |

---

## Test Co-location Validation

Projeto sem framework de teste configurado. Gate único: `pnpm build`.

| Task | Camada | Matrix exige | Task diz | Status |
|------|--------|-------------|----------|--------|
| T1 | types | none | none | ✅ |
| T2 | api | none | none | ✅ |
| T3 | api | none | none | ✅ |
| T4 | validator | none | none | ✅ |
| T5 | component | none | none | ✅ |
| T6 | component | none | none | ✅ |
| T7 | component | none | none | ✅ |
| T8 | component | none | none | ✅ |
| T9 | component | none | none | ✅ |
| T10 | component | none | none | ✅ |
| T11 | styles | none | none | ✅ |
| T12 | hooks | none | none | ✅ |
