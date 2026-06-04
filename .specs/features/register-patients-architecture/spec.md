# Register Patients — Architecture Refactor

## Contexto

O refactor estrutural anterior ([register-patients-refactor](../register-patients-refactor/spec.md)) organizou a pasta em `steps/`, criou `src/validators/` e eliminou duplicatas. O código agora compila limpo, mas herdou uma série de problemas de arquitetura interna que cresceram de forma incremental:

- Props de formulário (`register`, `control`, `errors`) são passados como parâmetros explícitos para cada step, em vez de usar `FormProvider` + `useFormContext`.
- Os campos clínicos (`modality`, `frequency`, `price`, `source`, `notes`) vivem como `useState` solto fora do React Hook Form — invisíveis ao Zod, sem validação, sem controle de estado.
- A data de nascimento tem **duas representações simultâneas**: `birthInput: string` (DD/MM/AAAA) como `useState` no orquestrador, e `dateOfBirth: Date | null` no formulário — mesmos dados em dois formatos diferentes.
- Create e update usam uma única `mutationFn` com ternário em runtime (`isEditMode ? updatePatients : createPatients`).
- `create-patient.ts` serializa `dateOfBirth` como `.toISOString()` (ISO 8601); `update-patient.ts` serializa como `format(d, 'yyyy-MM-dd')` (data local) — o mesmo campo com dois formatos diferentes.
- `form-styles.ts` exporta `selectCls: CSSProperties` aplicado via `style={selectCls}` — inline style em vez de Tailwind. Elementos `<select>` nativos quando `shadcn/ui <Select>` existe.
- `PatientFormDraft.gender` tipado como `string` em vez de `Gender`.
- `handleSubmitClick` chama `trigger()` seguido de `handleSubmit(onSubmit)()` — validação dupla.
- `"use client"` directives em `attachments-list.tsx` e `upload-zone.tsx` — diretiva Next.js num projeto Vite.
- Cada campo repete o padrão `<label>` + `<p className="text-red-600">` manualmente, em vez de usar `<FormField>` + `<FormMessage>` do shadcn.
- `CreatePatientBody` não inclui `email`, apesar do campo existir no schema e ser enviado no submit.
- **Draft persistence** (localStorage) está presente no orquestrador — deve ser **removido inteiramente**.

---

## Objetivos

- [ ] Adotar `FormProvider` + `useFormContext` — eliminar prop drilling de `register`, `control`, `errors`
- [ ] Mover campos clínicos para `patientSchema` — sem `useState` solto fora do RHF
- [ ] Eliminar `birthInput` como estado paralelo — a representação DD/MM/AAAA fica local no step
- [ ] Separar mutations de create e update — sem ternário em `mutationFn`
- [ ] Unificar serialização de `dateOfBirth` — um único formato entre create e update
- [ ] Remover draft persistence do localStorage inteiramente
- [ ] Substituir `<select>` nativos por `<Select>` shadcn — eliminar `selectCls: CSSProperties`
- [ ] Usar `<FormField>` + `<FormMessage>` em todos os campos — sem padrão de label/erro manual
- [ ] Corrigir `CreatePatientBody.email` ausente
- [ ] Corrigir `PatientFormDraft.gender: string` → `Gender`
- [ ] Remover `"use client"` do código Vite
- [ ] Cada `.tsx` em register-patients ter um arquivo CSS co-localizado com `@layer components`
- [ ] Classes repetidas em 2+ arquivos extraídas para `form-components.css` (compartilhado)
- [ ] TypeScript sem erros após todas as mudanças

---

## Fora do Escopo

| Item | Motivo |
|------|--------|
| Refatorar `markdown-editor.tsx` | Componente standalone sem problemas de arquitetura |
| Refatorar `patient-avatar-upload.tsx` | Sem acoplamento ao formulário principal |
| Alterar API do backend | Escopo de frontend |
| Adicionar campos clínicos ao payload da API | Os campos existem no schema mas são excluídos no submit até o backend suportar |
| Mudar fluxo de 4 steps | Comportamento inalterado |

---

## Histórias de Usuário

### RPA-01 — FormProvider + useFormContext ⭐ P1

**História:** Como desenvolvedor, quero que os steps consumam o contexto do formulário diretamente, sem receber `register`, `control` e `errors` como props.

**Critérios de Aceite:**

1. `register-patients.tsx` DEVE usar `<Form {...methods}>` (FormProvider via shadcn) para envolver o conteúdo do wizard
2. `StepBasicData`, `StepContactAddress`, `StepClinical` NÃO DEVEM receber `register`, `control` ou `errors` como props
3. Cada step DEVE obter o contexto via `useFormContext<PatientFormData>()`
4. QUANDO o formulário é submetido com campos inválidos ENTÃO as mensagens de erro DEVEM aparecer nos campos corretos

---

### RPA-02 — Campos clínicos no schema ⭐ P1

**História:** Como desenvolvedor, quero que `modality`, `frequency`, `price`, `source` e `notes` sejam campos do formulário controlados pelo RHF, não `useState` isolado.

**Critérios de Aceite:**

1. `patientSchema` em `src/validators/patients.ts` DEVE incluir os 5 campos como opcionais com defaults (ver seção Contratos de Dados)
2. `StepClinical` DEVE usar `useFormContext<PatientFormData>()` para todos os seus campos — sem props value/onChange vindos do orquestrador
3. `register-patients.tsx` DEVE remover os 5 `useState` de campos clínicos
4. Os 5 campos DEVEM ser excluídos do payload enviado ao backend (desestruturação antes do submit)

---

### RPA-03 — Eliminação de `birthInput` como estado paralelo ⭐ P1

**História:** Como desenvolvedor, quero que a representação em texto da data de nascimento seja local ao step, e não um estado duplicado no orquestrador.

**Critérios de Aceite:**

1. `register-patients.tsx` NÃO DEVE ter `useState` para `birthInput`
2. A máscara DD/MM/AAAA DEVE ser gerenciada localmente em `StepBasicData` via `useState` local
3. `StepBasicData` DEVE continuar exibindo a idade calculada ao lado do campo
4. `form.dateOfBirth` DEVE continuar sendo `Date | null` — quando o texto atingir 10 caracteres, o handler DEVE chamar `dateParse` + `field.onChange(parsedDate)`
5. O schema DEVE aceitar `Date | null` via `z.preprocess` para garantir que valores passados diretamente (modo edição) sejam tratados corretamente (ver seção Contratos de Dados)

---

### RPA-04 — Mutations separadas ⭐ P1

**História:** Como desenvolvedor, quero mutations explícitas para create e update, sem ternário em `mutationFn`.

**Critérios de Aceite:**

1. `register-patients.tsx` DEVE ter dois `useMutation` separados: um para `createPatients`, outro para `updatePatients`
2. `onSubmit` DEVE chamar a mutation correta com base em `isEditMode`
3. `isBusy` DEVE agregar os estados `isPending` de ambas as mutations e de `isUploading`

---

### RPA-05 — Serialização de data unificada ⭐ P1

**História:** Como desenvolvedor, quero que `dateOfBirth` seja serializado com o mesmo formato em create e update.

**Critérios de Aceite:**

1. `create-patient.ts` e `update-patient.ts` DEVEM serializar `dateOfBirth: Date` usando o mesmo método (`.toISOString()`)
2. `update-patient.ts` DEVE remover a dependência de `format` do `date-fns` para `dateOfBirth`
3. Ambas as funções DEVEM aceitar `dateOfBirth?: Date | null`

---

### RPA-06 — Remoção do draft de localStorage ⭐ P1

**História:** Como desenvolvedor, quero que o formulário não persista dados no localStorage.

**Critérios de Aceite:**

1. `register-patients.tsx` NÃO DEVE importar nem usar `usePatientDraft`
2. O `useEffect` de auto-save DEVE ser removido
3. `defaultValues` DEVEM vir apenas dos dados do `patient` (edit) ou de strings vazias/defaults (create)
4. `src/hooks/use-patient-draft.ts` DEVE ser deletado (verificar que não há outros consumidores antes)
5. QUANDO o usuário fecha o modal e reabre ENTÃO o formulário DEVE iniciar vazio (create) ou com dados do paciente (edit)

---

### RPA-07 — Substituir `<select>` nativos por `<Select>` shadcn ⭐ P1

**História:** Como desenvolvedor, quero que todos os selects usem o componente shadcn, eliminando o `selectCls: CSSProperties`.

**Critérios de Aceite:**

1. `form-styles.ts` DEVE remover as exportações `selectCls` (CSSProperties) e `selectClassName`
2. O select de UF em `StepContactAddress` DEVE usar `<Select>` do shadcn
3. O select de frequência em `StepClinical` DEVE usar `<Select>` do shadcn
4. Nenhum `style={selectCls}` DEVE permanecer no código

---

### RPA-08 — Padrão `<FormField>` + `<FormMessage>` ⭐ P1

**História:** Como desenvolvedor, quero que todos os campos usem o padrão shadcn de formulário, eliminando labels e mensagens de erro manuais.

**Critérios de Aceite:**

1. Todos os campos validados DEVEM usar `<FormField>` + `<FormItem>` + `<FormLabel>` + `<FormControl>` + `<FormMessage>`
2. Não DEVE existir `<p className="text-red-600">` para exibir erros manualmente
3. Não DEVE existir `<label>` sem ser dentro de `<FormItem>` + `<FormLabel>`

---

### RPA-09 — Correções de tipo e limpeza P2

**História:** Como desenvolvedor, quero que os tipos do domínio sejam precisos e sem diretivas de frameworks incorretos.

**Critérios de Aceite:**

1. `CreatePatientBody` em `src/types/patient.ts` DEVE incluir `email?: string`
2. `"use client"` DEVE ser removido de `attachments-list.tsx` e `upload-zone.tsx`
3. `handleSubmitClick` DEVE chamar apenas `handleSubmit(onSubmit)()` — sem `trigger()` prévio
4. Inline styles de dimensões fixas (`style={{ width: 36, height: 44 }}`) em `attachments-list.tsx` DEVEM ser substituídos por classes Tailwind
5. `style={{ maxHeight: "92vh" }}` no `DialogContent` DEVE virar `className="max-h-[92vh]"`

---

### RPA-10 — CSS `@apply` por componente: um arquivo CSS por `.tsx` P2

**História:** Como desenvolvedor, quero que cada componente da feature register-patients tenha seu próprio arquivo CSS co-localizado com classes definidas via `@apply`, e que classes compartilhadas entre 2+ componentes vivam em `form-components.css`.

**Critérios de Aceite:**

1. CADA um dos 11 `.tsx` em `register-patients/` DEVE ter um arquivo CSS co-localizado (mesmo nome, extensão `.css`) com ao menos um `@layer components { ... }`
2. `form-components.css` DEVE conter as classes compartilhadas: `.patient-input`, `.patient-form-grid-2`, `.patient-form-grid-3`, `.patient-field-hint`, `.patient-icon-prefix`, `.patient-value-hint`, `.rp-section-title*`, `.rp-modal-*`, `.rp-btn-*`
3. Cada arquivo CSS de componente DEVE ter `@reference "...global.css"` para acessar tokens Tailwind
4. `form-styles.ts` DEVE ser inexistente — substituído por `form-components.css`
5. Inline styles sem equivalente Tailwind (gradientes, rgba) permanecem como `style={}`
6. Gate: `pnpm build` passa sem erros

---

## Contratos de Dados

### Responsabilidade por transformações de máscara

Cada campo mascarado tem uma camada de responsabilidade definida. Não há limpeza duplicada.

| Campo | Onde a máscara é removida | Justificativa |
|-------|--------------------------|---------------|
| `cpf` | `z.transform` no schema | Faz parte da validação — `isValidCPF` exige dígitos limpos; o valor armazenado no form state já é limpo |
| `phoneNumber` | API layer (`create-patient.ts` / `update-patient.ts`) | O form exibe formatado para o usuário; a limpeza é detalhe de serialização HTTP |
| `cep` | API layer | Mesma razão do telefone — display formatado, envio limpo |
| `dateOfBirth` | API layer (`.toISOString()`) | Conversão `Date → string` é responsabilidade de serialização |

### `patientSchema` atualizado

```ts
// dateOfBirth: aceita Date | null via preprocess (compatível com modo edição
// onde o valor já chega como Date, e com o campo vazio que chega como null)
dateOfBirth: z.preprocess(
  (val) => (val instanceof Date || val === null ? val : null),
  z.date().nullable().optional()
    .refine((d) => !d || d <= new Date(), { message: 'Data de nascimento inválida' })
),

// cpf: transform remove a máscara antes da validação e do armazenamento no form state
cpf: z.string().optional().or(z.literal(''))
  .transform((v) => v?.replace(/\D/g, '') ?? '')
  .refine((v) => !v || isValidCPF(v), { message: 'CPF inválido' }),

// Campos clínicos — form state, não enviados ao backend ainda
modality:  z.enum(['ONLINE', 'PRESENCIAL', 'HIBRIDO']).default('ONLINE'),
frequency: z.string().default('Semanal'),
price:     z.string().optional().default(''),
source:    z.string().optional().default(''),
notes:     z.string().optional().default(''),
```

### Submit payload (sem campos clínicos)

```ts
const { modality, frequency, price, source, notes, ...patientPayload } = data
// patientPayload vai para createPatients() ou updatePatients()
// phoneNumber e cep chegam aqui ainda formatados — a limpeza ocorre na API layer
```

### API layer: limpeza de máscaras e serialização de data

```ts
// create-patient.ts e update-patient.ts aplicam a mesma lógica:
{
  ...patientPayload,
  phoneNumber:  patientPayload.phoneNumber?.replace(/\D/g, '') || undefined,
  cep:          patientPayload.cep?.replace(/\D/g, '')         || undefined,
  dateOfBirth:  patientPayload.dateOfBirth instanceof Date
                  ? patientPayload.dateOfBirth.toISOString()
                  : undefined,
}
```

---

## Rastreabilidade de Requisitos

| ID | História | Prioridade | Status |
|----|----------|-----------|--------|
| RPA-01 | FormProvider + useFormContext | P1 | Pendente |
| RPA-02 | Campos clínicos no schema | P1 | Pendente |
| RPA-03 | Eliminar `birthInput` paralelo | P1 | Pendente |
| RPA-04 | Mutations separadas | P1 | Pendente |
| RPA-05 | Serialização de data unificada | P1 | Pendente |
| RPA-06 | Remoção de draft localStorage | P1 | Pendente |
| RPA-07 | Selects shadcn | P1 | Pendente |
| RPA-08 | FormField + FormMessage | P1 | Pendente |
| RPA-09 | Correções de tipo e limpeza | P2 | Pendente |
| RPA-10 | CSS `@apply` classes para tokens de formulário | P2 | Pendente |

---

## Critérios de Sucesso

- [ ] `npx tsc --noEmit` → zero erros
- [ ] Nenhum `useState` solto de campo de formulário em `register-patients.tsx` (exceto `avatarFile`, `selectedFiles`, `isUploading`)
- [ ] Nenhuma prop de formulário (`register`, `control`, `errors`) nos step components
- [ ] Nenhum `style={selectCls}` ou `selectCls: CSSProperties` no código
- [ ] Nenhum `"use client"` no código
- [ ] Create flow: preencher step 1 → avançar até step 4 → submit → paciente criado, toast, modal fecha
- [ ] Edit flow: abrir modal de edição → alterar nome → salvar → dados atualizados
- [ ] CEP auto-fill funciona no step 2
- [ ] Campos clínicos no step 3 respondem sem console warnings de uncontrolled inputs
- [ ] `form-styles.ts` inexistente — `grep -r "form-styles"` no `src/` retorna zero resultados
- [ ] `form-components.css` existe com `.patient-input`, classes de grid, modal e section-title
- [ ] 11 arquivos `.css` co-localizados (um por `.tsx`) em `register-patients/`
