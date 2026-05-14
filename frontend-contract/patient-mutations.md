# Patient Mutations — Guia de Implementação para o Frontend

> **Para o Claude do frontend**: Este documento cobre todos os endpoints de mutação (PUT/POST/DELETE/PATCH) relacionados a pacientes. Use `types.ts` deste mesmo diretório para os tipos compartilhados.

---

## Endpoints

---

### 1. `PUT /patients/:id` — Atualizar dados do paciente

**Auth**: 🔒 JWT obrigatório  
**Controller**: `update-patient-by-id.controller.ts`  
**Quando usar**: Formulário de edição do perfil do paciente.

> ⚠️ **Bug histórico corrigido**: O controller estava mapeado em `/patient` (singular). A rota correta é `/patients/:id` (plural), consistente com todos os outros endpoints.

#### Path params

```ts
id: string  // UUID do paciente — validado como UUID pelo backend
```

#### Body (todos opcionais — só envie o que mudou)

```ts
interface UpdatePatientBody {
  firstName?:      string
  lastName?:       string
  phoneNumber?:    string
  dateOfBirth?:    string    // ISO date — coerced para Date no backend
  cpf?:            string    // com ou sem máscara — backend remove não-dígitos
  gender?:         'OTHER' | 'FEMININE' | 'MASCULINE'
  profileImageUrl?: string
  attachmentIds?:  string[]  // UUIDs de attachments para vincular ao paciente
}
```

> **CPF**: Envie com ou sem máscara (`'123.456.789-00'` ou `'12345678900'`). O backend remove todos os não-dígitos antes de salvar.
>
> **Campos não enviados**: Campos omitidos do body não são alterados. É um PUT parcial na prática (comporta-se como PATCH).
>
> **`attachmentIds`**: UUIDs de arquivos já uploadados que devem ser vinculados a este paciente. O backend faz o vínculo em paralelo após salvar o paciente.

#### Response `200 OK`

```ts
interface Response {
  patient: Patient  // entidade de domínio completa — não é PatientHTTP
}
```

> ⚠️ **Atenção**: A resposta retorna a entidade de domínio bruta, **não** o `PatientHTTP` do presenter. Os campos têm formato ligeiramente diferente (ex: `id` é um objeto `UniqueEntityID`, não string). Após um update bem-sucedido, invalide a query do paciente e deixe o `GET /patients/:id` recarregar os dados formatados:

```ts
// ✅ Padrão correto: invalidar cache após mutation
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['patient', id] })
  queryClient.invalidateQueries({ queryKey: ['patients'] })
}
```

#### Erros

| Status | Quando |
|---|---|
| `400` | `id` não é UUID válido, ou `dateOfBirth` é data futura, ou `cpf` inválido |
| `401` | Token ausente ou inválido |
| `404` | Paciente não encontrado |

#### Como implementar

```ts
// services/patient.service.ts
export async function updatePatient(id: string, body: UpdatePatientBody) {
  const { data } = await api.put(`/patients/${id}`, body)
  return data
}

// hooks/use-update-patient.ts
export function useUpdatePatient(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: UpdatePatientBody) => updatePatient(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient', id] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}
```

#### Exemplo de uso no componente

```tsx
function EditPatientForm({ patientId }: { patientId: string }) {
  const { mutate, isPending } = useUpdatePatient(patientId)

  function handleSubmit(formData: UpdatePatientBody) {
    mutate(formData)
  }

  return (
    <form onSubmit={...}>
      {/* campos do formulário */}
      <button disabled={isPending}>Salvar</button>
    </form>
  )
}
```

---

### 2. `POST /patient` — Criar paciente (pelo psicólogo)

**Auth**: 🔒 JWT obrigatório + roles `ADMIN`, `PSYCHOLOGIST`, `SUPER_ADMIN`  
**Controller**: `create-patient.controller.ts`

> ⚠️ **Rota singular**: Este endpoint é `POST /patient` (sem 's'), diferente de todos os outros que usam `/patients`. É assim que o backend está registrado — não altere no frontend.

#### Body

```ts
interface CreatePatientBody {
  firstName:       string           // obrigatório, mínimo 1 char
  lastName:        string           // obrigatório, mínimo 1 char
  phoneNumber?:    string
  profileImageUrl?: string
  dateOfBirth?:    string           // ISO date — não pode ser futura
  cpf?:            string           // validado pelo backend
  gender?:         'OTHER' | 'FEMININE' | 'MASCULINE'  // default: 'OTHER'
}
```

#### Response `201 Created`

```ts
interface Response {
  message:   'Patient created successfully'
  patientId: string  // UUID do paciente criado
}
```

#### Erros

| Status | Quando |
|---|---|
| `400` | Campos obrigatórios faltando, CPF inválido, data futura |
| `401` | Token ausente ou role insuficiente |
| `409` | Paciente com mesmo CPF já existe (`PatientAlreadyExistsError`) |

#### Como implementar

```ts
export async function createPatient(body: CreatePatientBody) {
  const { data } = await api.post<{ message: string; patientId: string }>(
    '/patient',
    body
  )
  return data
}

export function useCreatePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}
```

---

### 3. `POST /invites/:hash/register` — Cadastro do paciente via link de convite

**Auth**: 🌐 Público — sem JWT  
**Controller**: `register-patient-via-invite-link.controller.ts`  
**Quando usar**: Página de cadastro que o paciente acessa pelo link enviado pelo psicólogo.

#### Path params

```ts
hash: string  // hash único da URL de convite
```

#### Body

```ts
interface RegisterPatientBody {
  firstName:    string           // obrigatório
  lastName:     string           // obrigatório
  email:        string           // obrigatório — email válido
  password:     string           // mínimo 8 chars, maiúscula, minúscula, número, especial
  gender:       'OTHER' | 'FEMININE' | 'MASCULINE'  // obrigatório
  phoneNumber?: string
  dateOfBirth?: string           // ISO date
  cpf?:         string
}
```

> **Regras de senha**: mínimo 8 caracteres, pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial. O Zod valida com regex no backend — mostre esses critérios no formulário.

#### Response `201 Created`

```ts
interface Response {
  patientId:      string         // UUID do paciente criado
  firstName:      string
  lastName:       string
  email:          string | null
  psychologistId: string         // UUID do psicólogo que gerou o link
}
```

#### Erros

| Status | Quando |
|---|---|
| `404` | Hash não existe (`INVALID_LINK`) |
| `409` | Email já cadastrado (`EMAIL_ALREADY_EXISTS`) |
| `410` | Link expirado (`EXPIRED_LINK`) |

#### Como implementar

```ts
// Sem token — usa instância pública da API
export async function registerPatientViaInvite(
  hash: string,
  body: RegisterPatientBody
) {
  const { data } = await apiPublic.post(
    `/invites/${hash}/register`,
    body
  )
  return data
}
```

---

### 4. `DELETE /patients/:id` — Remover paciente

**Auth**: 🔒 JWT obrigatório  
**Controller**: `delete-patient.controller.ts`

> ⚠️ **Soft delete comentado**: O backend faz um `prisma.user.update({ data: { updatedAt: new Date() } })` — ou seja, não apaga nem desativa de fato. O campo `isActive: false` está comentado. Na prática, este endpoint não remove o paciente do banco.

#### Path params

```ts
id: string  // UUID do paciente
```

#### Response `200 OK` (ou `204`)

Verificar na resposta real — o controller não foi lido em detalhes. Após delete, invalidar cache:

```ts
export function useDeletePatient() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.delete(`/patients/${id}`),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      queryClient.removeQueries({ queryKey: ['patient', id] })
    },
  })
}
```

---

### 5. `PATCH /patients/:id/status` — Ativar/desativar paciente

**Auth**: 🔒 JWT obrigatório  
**Controller**: `toggle-patient-status.controller.ts`

> Endpoint de toggle de status do paciente. Leia o controller para confirmar o body e a resposta exatos antes de implementar — não foi mapeado em detalhes nesta sessão.

---

## Tipos para mutações

Adicione ao `types.ts` do projeto frontend:

```ts
// Body de update — todos opcionais
export interface UpdatePatientBody {
  firstName?:       string
  lastName?:        string
  phoneNumber?:     string
  dateOfBirth?:     string
  cpf?:             string
  gender?:          Gender
  profileImageUrl?: string
  attachmentIds?:   string[]
}

// Body de create (pelo psicólogo)
export interface CreatePatientBody {
  firstName:        string
  lastName:         string
  phoneNumber?:     string
  profileImageUrl?: string
  dateOfBirth?:     string
  cpf?:             string
  gender?:          Gender
}

// Body de registro via invite link
export interface RegisterPatientBody {
  firstName:    string
  lastName:     string
  email:        string
  password:     string
  gender:       Gender
  phoneNumber?: string
  dateOfBirth?: string
  cpf?:         string
}
```

---

## Armadilhas de mutação

### ❌ Usar a resposta do PUT diretamente como PatientHTTP
```ts
// Errado — o PUT retorna entidade de domínio, não PatientHTTP
const patient = await updatePatient(id, body)
setPatientName(patient.firstName)  // pode quebrar se id for objeto

// Correto — invalide o cache e releia pelo GET
await updatePatient(id, body)
queryClient.invalidateQueries({ queryKey: ['patient', id] })
```

### ❌ Chamar POST /patients para criar (plural)
```ts
// Errado — rota de create é singular
api.post('/patients', body)

// Correto
api.post('/patient', body)
```

### ❌ Enviar campos null para limpar valores
```ts
// O backend ignora campos undefined/null no update
// Para limpar um campo, verifique se o backend suporta null explícito
// Por ora, campos ausentes = não alterados
```
