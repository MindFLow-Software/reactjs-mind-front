# Register Patients — Architecture Refactor: Design

## Visão Geral

Este documento descreve o design técnico do refactor RPA-01 → RPA-09. O objetivo é resolver os problemas arquiteturais identificados no `spec.md` sem alterar o comportamento visível ao usuário nem o fluxo de 4 steps.

---

## Arquitetura Alvo

### Antes (atual)

```
RegisterPatients (orchestrador)
  │  useForm → { register, control, errors }  ← prop-drilled para cada step
  │  useState(birthInput)                      ← duplicata do form.dateOfBirth
  │  useState(modality, frequency, price, ...)  ← fora do RHF
  │  useMutation (create | update via ternário)
  │  usePatientDraft → localStorage
  │
  ├─ StepBasicData(register, control, errors, birthInput, onBirthChange)
  ├─ StepContactAddress(register, control, errors, onCepBlur, isCepLoading)
  ├─ StepClinical(modality, onModalityChange, frequency, ...)
  └─ AttachmentsList / UploadZone
```

### Depois (alvo)

```
RegisterPatients (orchestrador)
  │  useForm → methods            ← FormProvider via <Form {...methods}>
  │  useMutation(createPatients)  ← separado
  │  useMutation(updatePatients)  ← separado
  │  useState(avatarFile, selectedFiles, isUploading, isCepLoading)
  │
  ├─ StepBasicData(onAvatarSelect, patient?)
  │    └─ useFormContext()  ← lê/escreve firstName, lastName, cpf, dateOfBirth, gender
  │    └─ useState(birthInput)  ← local ao step
  │
  ├─ StepContactAddress(onCepBlur, isCepLoading)
  │    └─ useFormContext()  ← lê/escreve phoneNumber, email, cep, logradouro, bairro, cidade, uf
  │
  ├─ StepClinical()
  │    └─ useFormContext()  ← lê/escreve modality, frequency, price, source, notes
  │
  └─ AttachmentsList / UploadZone
```

---

## Design do Schema (`src/validators/patients.ts`)

### Campos adicionados (RPA-02)

```ts
modality:  z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO']).default('ONLINE'),
frequency: z.string().default('Semanal'),
price:     z.string().optional().default(''),
source:    z.string().optional().default(''),
notes:     z.string().optional().default(''),
```

Esses campos existem no form state e são excluídos do payload antes do submit (o backend ainda não os suporta).

### `dateOfBirth` com preprocess (RPA-03)

Problema atual: em modo edição, o valor já chega como `Date` via `defaultValues`. A definição `z.date()` aceita `Date` mas não passa pelo runtime check quando o valor vem de `z.preprocess`.

Solução:

```ts
dateOfBirth: z.preprocess(
  (val) => (val instanceof Date || val === null ? val : null),
  z.date().nullable().optional()
    .refine((d) => !d || d <= new Date(), { message: 'Data de nascimento inválida' })
),
```

O `preprocess` passa `Date` e `null` direto; qualquer outro valor (ex: `undefined`) vira `null`.

### `cpf` com transform (RPA-09 — contratos de dados)

A máscara é removida no schema para que `onSubmit(data)` já receba os dígitos limpos. `isValidCPF` opera corretamente sobre dígitos limpos (ele mesmo strip internamente, mas é redundante — sem problema).

```ts
cpf: z.string().optional().or(z.literal(''))
  .transform((v) => v?.replace(/\D/g, '') ?? '')
  .refine((v) => !v || isValidCPF(v), { message: 'CPF inválido' }),
```

Runtime: `field.value` no `Controller` continua sendo o valor mascarado (RHF armazena o raw value; o transform só aplica no output de `handleSubmit`). Não há conflito de UX.

---

## Design de Estado

### O que fica no orchestrador

| Estado | Tipo | Motivo |
|--------|------|--------|
| `step` | `StepId` | Controla qual step está visível — renderização |
| `avatarFile` | `File \| null` | Upload de avatar — não é campo de formulário |
| `selectedFiles` | `File[]` | Upload de anexos — não é campo de formulário |
| `isUploading` | `boolean` | Agregado em `isBusy` |
| `isCepLoading` | `boolean` | Passado como prop para `StepContactAddress` |

### O que migra para os steps

| Estado atual | Destino | Motivo |
|-------------|---------|--------|
| `birthInput: string` | `StepBasicData` (local) | Representação de display — irrelevante fora do step |
| `modality`, `frequency`, `price`, `source`, `notes` | `patientSchema` + RHF | Campos de formulário — devem ser controlados pelo RHF |
| `handleBirthChange` | `StepBasicData` | Manipulador local do campo |
| `handlePriceChange` | `StepClinical` | Manipulador local do campo |

---

## Design das Mutations (RPA-04)

### Antes

```ts
const { mutateAsync: savePatientFn, isPending } = useMutation({
  mutationFn: (data) => isEditMode ? updatePatients(data) : createPatients(data),
})
```

### Depois

```ts
const { mutateAsync: createFn, isPending: isCreating } = useMutation({
  mutationFn: createPatients,
})
const { mutateAsync: updateFn, isPending: isUpdating } = useMutation({
  mutationFn: updatePatients,
})

const isBusy = isCreating || isUpdating || isUploading
```

`onSubmit` despacha para a mutation correta via `isEditMode`:

```ts
const res = isEditMode
  ? await updateFn({ ...patientPayload, id: patient!.id })
  : await createFn(patientPayload)
```

---

## Design da Camada de API (RPA-05)

Responsabilidade única de cada camada:

| Campo | Onde a máscara é removida | Formato enviado |
|-------|--------------------------|-----------------|
| `cpf` | Schema (`z.transform`) | dígitos limpos |
| `phoneNumber` | API layer | dígitos limpos |
| `cep` | API layer | dígitos limpos |
| `dateOfBirth` | API layer (`.toISOString()`) | ISO 8601 |

### `create-patient.ts` (target)

```ts
const formattedData: CreatePatientBody = {
  ...data,
  phoneNumber: data.phoneNumber?.replace(/\D/g, '') || undefined,
  cep:         data.cep?.replace(/\D/g, '')         || undefined,
  dateOfBirth: data.dateOfBirth instanceof Date
    ? data.dateOfBirth.toISOString()
    : data.dateOfBirth || undefined,
}
```

### `update-patient.ts` (target)

Idêntico ao create — remove `format(d, 'yyyy-MM-dd')` e usa `.toISOString()`.

---

## Interfaces dos Componentes (target)

### `RegisterPatients`

Sem mudanças na interface pública:

```ts
interface RegisterPatientsProps {
  patient?:   PatientHTTP
  onSuccess?: () => void
}
```

### `StepBasicData`

```ts
interface StepBasicDataProps {
  onAvatarSelect: (f: File | null) => void
  patient?:       PatientHTTP
}
```

Removidos: `register`, `control`, `errors`, `cpfDigits`, `birthInput`, `onBirthChange`.

### `StepContactAddress`

```ts
interface StepContactAddressProps {
  onCepBlur:    () => void
  isCepLoading: boolean
}
```

Removidos: `register`, `control`, `errors`.

### `StepClinical`

```ts
// Sem props — consome tudo via useFormContext
```

Removidos: `modality`, `onModalityChange`, `frequency`, `onFrequencyChange`, `price`, `onPriceChange`, `source`, `onSourceChange`, `notes`, `onNotesChange`.

---

## Padrão de Campos de Formulário (RPA-08)

### Antes (manual)

```tsx
<div>
  <label className="...">Nome <span className="text-red-600">*</span></label>
  <Input {...register("firstName")} />
  {errors.firstName && (
    <p className="text-red-600">{errors.firstName.message}</p>
  )}
</div>
```

### Depois (shadcn FormField)

```tsx
<FormField
  control={control}
  name="firstName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Nome <span className="text-red-600">*</span></FormLabel>
      <FormControl>
        <Input {...field} placeholder="Ex: Ana Luísa" autoComplete="off" className={inputCls} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

`<FormMessage>` exibe automaticamente `errors[name].message` — sem renderização condicional manual.

---

## Select Nativo → shadcn Select (RPA-07)

### UF em `StepContactAddress`

```tsx
<FormField
  control={control}
  name="uf"
  render={({ field }) => (
    <FormItem>
      <FormLabel>UF</FormLabel>
      <Select value={field.value ?? ""} onValueChange={field.onChange} disabled={isCepLoading}>
        <FormControl>
          <SelectTrigger className={cn(inputCls, isCepLoading && "opacity-50")}>
            <SelectValue placeholder="—" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {UF_LIST.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Frequência em `StepClinical`

Mesmo padrão com opções `["Semanal", "Quinzenal", "Mensal", "Sob demanda"]`.

---

## `birthInput` Local em `StepBasicData` (RPA-03)

O estado `birthInput` (string DD/MM/AAAA) migra do orchestrador para dentro do step:

```ts
const { control, getValues } = useFormContext<PatientFormData>()

// Inicializa uma vez: em edit mode, converte o Date do form para string de display
const [birthInput, setBirthInput] = useState(() => {
  const d = getValues("dateOfBirth")
  return d instanceof Date ? format(d, "dd/MM/yyyy") : ""
})

function handleBirthChange(e: ChangeEvent<HTMLInputElement>, fieldOnChange: (v: Date | null) => void) {
  let v = e.target.value.replace(/\D/g, "").slice(0, 8)
  if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2)
  if (v.length > 5) v = v.slice(0, 5) + "/" + v.slice(5)
  setBirthInput(v)
  if (v.length === 10) {
    const d = dateParse(v, "dd/MM/yyyy", new Date())
    fieldOnChange(dateIsValid(d) ? d : null)
  } else {
    fieldOnChange(null)
  }
}
```

O `cpfDigits` também passa a ser computado localmente via `useWatch`:

```ts
const cpfValue = useWatch({ control, name: "cpf" })
const cpfDigits = (cpfValue ?? "").replace(/\D/g, "")
```

---

## Submit: Separação de Campos Clínicos (RPA-02)

```ts
async function onSubmit(data: PatientFormData) {
  // Exclui campos clínicos do payload — backend ainda não os suporta
  const { modality, frequency, price, source, notes, ...patientPayload } = data

  // phoneNumber, cep → limpeza na API layer
  // dateOfBirth → serialização na API layer
  // cpf → já limpo pelo z.transform do schema

  const res = isEditMode
    ? await updateFn({ ...patientPayload, id: patient!.id })
    : await createFn(patientPayload)

  // ... upload de avatar e anexos
}
```

---

## `handleSubmitClick` (RPA-09)

### Antes

```ts
async function handleSubmitClick() {
  const valid = await trigger()   // valida tudo
  if (valid) handleSubmit(onSubmit)()  // valida de novo internamente
}
```

### Depois

```ts
function handleSubmitClick() {
  handleSubmit(onSubmit)()  // handleSubmit já valida e exibe erros
}
```

---

## Remoção do Draft (RPA-06)

Arquivos afetados:
- `register-patients.tsx` — remove `usePatientDraft`, a variável `draft`, o `useEffect` de auto-save e todas as referências a `draft?.field`
- `defaultValues` passa a ler apenas de `patient` (edit) ou string vazia / defaults (create)
- `src/hooks/use-patient-draft.ts` — **deletar** (sem outros consumidores)

Comportamento após remoção: fechar e reabrir o modal de cadastro inicia o formulário vazio.

---

## Tipos (RPA-09)

### `CreatePatientBody` em `src/types/patient.ts`

```ts
export interface CreatePatientBody {
  firstName:        string
  lastName:         string
  email?:           string   // ← adicionar
  phoneNumber?:     string
  profileImageUrl?: string
  dateOfBirth?:     string
  cpf?:             string
  gender?:          Gender
  cep?:             string
  logradouro?:      string
  bairro?:          string
  cidade?:          string
  uf?:              string
}
```

---

## CSS Component Classes (RPA-10)

### Problema

Estilos ficam inline como strings Tailwind longas em `className={}` ou em constante JS (`inputCls`). Dificulta leitura e impede reuso semântico. Cada componente deve ser responsável pelo seu próprio CSS.

### Estrutura de arquivos

```
register-patients/
  form-components.css          ← compartilhado, importado em register-patients.tsx
  steps/
    section-title.css
    pill-radio.css
    patient-avatar-upload.css
    markdown-editor.css
    attachments-list.css
    upload-zone.css
    delete-attachments-button.css
    step-basic-data.css
    step-contact-address.css
    step-clinical.css
```

### `form-components.css` — classes compartilhadas entre 2+ arquivos

| Classe | Usado em |
|--------|----------|
| `.patient-input` | step-basic-data, step-contact-address, step-clinical |
| `.patient-form-grid-2` | step-basic-data, step-contact-address |
| `.patient-form-grid-3` | step-contact-address |
| `.patient-field-hint` | step-basic-data (CPF hint), step-contact-address (CEP hint) |
| `.patient-icon-prefix` | step-contact-address (phone, mail) |
| `.patient-value-hint` | step-basic-data (idade) |
| `.rp-section-title`, `__icon`, `__label` | section-title, attachments-list |
| `.rp-modal-*`, `.rp-btn-*` | register-patients |

### CSS por componente — classes exclusivas

| Arquivo CSS | Classes definidas |
|-------------|-------------------|
| `section-title.css` | usa form-components.css — sem classes exclusivas |
| `pill-radio.css` | `.rp-pill-radio`, `.rp-pill-radio__label`, `--checked`, `--unchecked` |
| `patient-avatar-upload.css` | `.rp-avatar-wrap`, `.rp-avatar-circle`, `.rp-avatar-overlay`, `.rp-avatar-initials`, `.rp-avatar-info`, `.rp-avatar-label`, `.rp-avatar-desc`, `.rp-avatar-btn-upload`, `.rp-avatar-btn-remove` |
| `markdown-editor.css` | `.rp-md-editor`, `__toolbar`, `__tab` (+`--active`, `--inactive`), `__actions`, `__divider`, `__fmt-btn`, `__textarea` (inclui `min-h-[160px]`), `__preview` (`min-h-[160px] max-h-[340px]`), `__footer`, `__help`, `__help-code`, `__char-count` |
| `attachments-list.css` | `.rp-att-empty`, `.rp-att-grid`, `.rp-att-card`, `.rp-att-badge`, `.rp-att-name`, `.rp-att-meta`, `.rp-att-action` |
| `upload-zone.css` | `.rp-upload-zone` (+`--drag`, `--idle`), `__icon-box`, `__title`, `__desc`, `.rp-upload-file-list`, `.rp-upload-file-item`, `.rp-upload-file-name`, `.rp-upload-file-size`, `.rp-upload-file-remove` |
| `delete-attachments-button.css` | `.rp-delete-btn`, `.rp-delete-dialog`, `__icon`, `__footer`, `__cancel`, `__confirm` |
| `step-basic-data.css` | `.rp-cpf-check` |
| `step-contact-address.css` | (sem classes exclusivas — todos os estilos mapeiam para form-components.css) |
| `step-clinical.css` | `.rp-clinical-grid` (`gap-y-4`), `.rp-price-prefix` |

### Regras de importação

- `form-components.css` → `import "./form-components.css"` em `register-patients.tsx` (carrega globalmente para todos os filhos)
- Cada CSS de step → `import "./nome.css"` no próprio `.tsx`
- Todos os arquivos CSS precisam de `@reference "...global.css"` (Tailwind v4) para acessar tokens

### Inline styles que permanecem

| Arquivo | Style | Motivo |
|---------|-------|--------|
| `patient-avatar-upload.tsx` | `style={{ background: "linear-gradient(...)" }}` | Sem equivalente Tailwind para gradiente com hex |
| `patient-avatar-upload.tsx` | `style={{ background: "rgba(...)" }}` | Idem |
| `register-patients.tsx` | `style={{ width: "..." }}` na progress fill | Valor dinâmico calculado em runtime |

---

## Rastreabilidade

| História | Arquivo(s) alterado(s) |
|----------|----------------------|
| RPA-01 — FormProvider | `register-patients.tsx`, todos os steps |
| RPA-02 — Campos clínicos no schema | `patients.ts` (validator), `step-clinical.tsx`, `register-patients.tsx` |
| RPA-03 — Eliminar `birthInput` paralelo | `register-patients.tsx`, `step-basic-data.tsx` |
| RPA-04 — Mutations separadas | `register-patients.tsx` |
| RPA-05 — Serialização de data unificada | `create-patient.ts`, `update-patient.ts` |
| RPA-06 — Remoção de draft | `register-patients.tsx`, `use-patient-draft.ts` (delete) |
| RPA-07 — Selects shadcn | `step-contact-address.tsx`, `step-clinical.tsx`, `form-styles.ts` |
| RPA-08 — FormField + FormMessage | `step-basic-data.tsx`, `step-contact-address.tsx`, `step-clinical.tsx` |
| RPA-09 — Tipos e limpeza | `patient.ts` (types), `attachments-list.tsx`, `upload-zone.tsx`, `register-patients.tsx` |
| RPA-10 — CSS @apply por componente | `form-components.css` (expandido), 10 novos CSS em `steps/`, todos os `.tsx` da feature |
