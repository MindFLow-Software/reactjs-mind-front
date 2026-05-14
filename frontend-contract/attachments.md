# Attachments — Guia de Implementação para o Frontend

> **Para o Claude do frontend**: Este documento cobre todos os endpoints de attachment. Use `types.ts` deste mesmo diretório para os tipos. Leia as seções de ⚠️ com atenção — há inconsistências no backend que já estão documentadas aqui para que você não precise adivinhar.

---

## Visão geral dos endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/attachments` | 🔒 JWT | Upload de arquivo (foto ou PDF) |
| `GET` | `/attachments` | 🔒 JWT | Lista todos os attachments do psicólogo (paginado) |
| `GET` | `/attachments/patient/:patientId` | 🔒 JWT | Lista attachments de um paciente |
| `GET` | `/attachments/:id` | 🌐 Público | Serve o arquivo binário (stream) |
| `DELETE` | `/attachments/:id` | 🔒 JWT | Remove um attachment |

---

## 1. `POST /attachments` — Upload de arquivo

**Auth**: 🔒 JWT obrigatório  
**Controller**: `upload-attachment.controller.ts`  
**Content-Type**: `multipart/form-data` (obrigatório — não envie JSON)  
**Quando usar**: Upload de foto do paciente ou de documento PDF.

### Campos do form-data

```ts
// Todos os campos são enviados como form-data, não como JSON body
interface UploadAttachmentForm {
  file:       File      // obrigatório — max 3MB, tipos aceitos: JPEG, JPG, PNG, PDF
  patientId?: string    // UUID do paciente — omitir se não quiser vincular
  type?:      string    // 'AVATAR' para atualizar profileImageUrl do paciente
}
```

> **Como enviar com fetch/axios**:
> ```ts
> const formData = new FormData()
> formData.append('file', file)
> formData.append('patientId', patientId)
> formData.append('type', 'AVATAR')  // opcional
>
> await api.post('/attachments', formData)
> // NÃO setar Content-Type manualmente — o browser define o boundary automaticamente
> ```

### Comportamento especial: `type = 'AVATAR'`

Se `patientId` for enviado **e** `type === 'AVATAR'`, o backend:
1. Faz upload do arquivo no R2
2. Salva o attachment no banco
3. Atualiza `profileImageUrl` do usuário com o ID do attachment

Após sucesso, para exibir a foto use `GET /attachments/:attachmentId` (que serve o binário).

### Validações no backend

| Campo | Regra |
|-------|-------|
| `file` | Obrigatório |
| Tamanho | Máximo 3MB |
| Tipo | Apenas `image/jpeg`, `image/jpg`, `image/png`, `application/pdf` |

Erros de validação retornam `400` com mensagem descritiva.

### Response `200 OK`

```ts
// Importar de types.ts:
// import type { UploadAttachmentResponse } from './types'

interface UploadAttachmentResponse {
  attachmentId: string  // UUID — use para GET /attachments/:id
  url:          string  // storage key interno (mesmo valor que attachmentId)
}
```

### Erros

| Status | Quando |
|--------|--------|
| `400` | Arquivo ausente, tipo inválido, ou tamanho acima de 3MB |
| `401` | Token ausente ou inválido |
| `500` | Falha no upload para o storage (R2) |

### Como implementar

```ts
// services/attachment.service.ts
export async function uploadAttachment(
  file: File,
  options?: { patientId?: string; type?: 'AVATAR' }
): Promise<UploadAttachmentResponse> {
  const formData = new FormData()
  formData.append('file', file)
  if (options?.patientId) formData.append('patientId', options.patientId)
  if (options?.type)      formData.append('type', options.type)

  const { data } = await api.post<UploadAttachmentResponse>('/attachments', formData)
  return data
}

// hooks/use-upload-attachment.ts
export function useUploadAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, patientId, type }: {
      file: File
      patientId?: string
      type?: 'AVATAR'
    }) => uploadAttachment(file, { patientId, type }),
    onSuccess: (_, { patientId }) => {
      if (patientId) {
        queryClient.invalidateQueries({ queryKey: ['attachments', 'patient', patientId] })
        queryClient.invalidateQueries({ queryKey: ['patient', patientId] })
      }
      queryClient.invalidateQueries({ queryKey: ['attachments'] })
    },
  })
}
```

---

## 2. `GET /attachments` — Listar todos os attachments (paginado)

**Auth**: 🔒 JWT obrigatório  
**Controller**: `fetch-all-attachments.controller.ts`  
**Quando usar**: Tela de gerenciamento de arquivos — lista arquivos de todos os pacientes do psicólogo.

### Query params

```ts
// Importar de types.ts:
// import type { FetchAllAttachmentsParams } from './types'

type FetchAllAttachmentsParams = {
  page?:      number    // default: 0 (zero-indexed)
  filter?:    string    // busca em filename OU nome do paciente
  patientId?: string    // UUID — filtra por paciente específico
  from?:      string    // ISO date string — início do intervalo (uploadedAt)
  to?:        string    // ISO date string — fim do intervalo (uploadedAt)
}
```

### Response `200 OK`

```ts
// Importar de types.ts:
// import type { AttachmentListItem, AttachmentListMeta } from './types'

interface Response {
  attachments: AttachmentListItem[]
  meta: AttachmentListMeta
}

// AttachmentListItem (wire exato):
interface AttachmentListItem {
  id:          string
  filename:    string
  fileUrl:     string        // storage key — use GET /attachments/:id para exibir
  contentType: string        // MIME type: 'image/jpeg' | 'image/png' | 'application/pdf'
  SizeInBytes: number        // ⚠️ S maiúsculo — inconsistência no backend, use assim no frontend
  uploadedAt:  string        // ISO 8601
  patient:     { firstName: string; lastName: string } | null
}

// AttachmentListMeta:
interface AttachmentListMeta {
  pageIndex:        number   // zero-indexed
  totalCount:       number   // total de registros (com filtros aplicados)
  perPage:          number   // sempre 10 (hardcoded no backend)
  totalStorageSize: number   // soma de bytes de todos os itens filtrados
}
```

> ⚠️ **`SizeInBytes` com S maiúsculo**: É um bug de nomenclatura no backend. O campo chega com `S` maiúsculo no JSON. Mapeie assim no frontend para não quebrar.

> ⚠️ **`patientId` não está na resposta**: O `AttachmentListItem` não inclui `patientId`. Use `patient.firstName + patient.lastName` para exibir o nome. Se precisar navegar para o paciente, use o endpoint de busca por nome.

### Como implementar

```ts
export async function fetchAllAttachments(params: FetchAllAttachmentsParams) {
  const { data } = await api.get<{
    attachments: AttachmentListItem[]
    meta: AttachmentListMeta
  }>('/attachments', { params })
  return data
}

export function useAllAttachments(params: FetchAllAttachmentsParams) {
  return useQuery({
    queryKey: ['attachments', params],
    queryFn: () => fetchAllAttachments(params),
  })
}
```

---

## 3. `GET /attachments/patient/:patientId` — Attachments de um paciente

**Auth**: 🔒 JWT obrigatório  
**Controller**: `fetch-patient-attachments.controller.ts`  
**Quando usar**: Aba de arquivos na ficha do paciente.

### Path params

```ts
patientId: string  // UUID do paciente
```

### Response `200 OK`

```ts
// Importar de types.ts:
// import type { AttachmentPatientItem } from './types'

interface Response {
  attachments: AttachmentPatientItem[]
}

// AttachmentPatientItem (wire exato):
interface AttachmentPatientItem {
  id:         string
  filename:   string
  url:        string    // storage key — use GET /attachments/:id para exibir
  type:       string    // MIME type
  size:       number    // bytes
  uploadedAt: string    // ISO 8601
}
```

> **Diferença de nomenclatura entre endpoints**:
>
> | Campo | GET /attachments/patient/:id | GET /attachments |
> |-------|-------------------------------|-----------------|
> | URL do arquivo | `url` | `fileUrl` |
> | Tamanho | `size` | `SizeInBytes` |
> | Tipo MIME | `type` | `contentType` |
>
> Os dois endpoints retornam o mesmo dado mas com nomes diferentes. Mapeie para um tipo interno único no frontend.

### Como implementar

```ts
export async function fetchPatientAttachments(patientId: string) {
  const { data } = await api.get<{ attachments: AttachmentPatientItem[] }>(
    `/attachments/patient/${patientId}`
  )
  return data.attachments
}

export function usePatientAttachments(patientId: string) {
  return useQuery({
    queryKey: ['attachments', 'patient', patientId],
    queryFn:  () => fetchPatientAttachments(patientId),
    enabled:  !!patientId,
  })
}
```

---

## 4. `GET /attachments/:id` — Servir arquivo binário

**Auth**: 🌐 Público (sem JWT)  
**Controller**: `get-attachment.controller.ts`  
**Quando usar**: Exibir imagem ou PDF diretamente na UI.

### Comportamento

Este endpoint não retorna JSON. Retorna o **arquivo binário** com headers adequados:

```
Content-Type: <mime-type-original>
Content-Disposition: inline; filename="<nome-original>"
Cache-Control: public, max-age=31536000, immutable
```

O navegador pode exibir diretamente. Use como `src` de `<img>` ou `href` de link para PDF.

### Como usar

```tsx
// Para imagem de perfil do paciente:
// profileImageUrl contém o UUID do attachment
<img src={`${API_BASE_URL}/attachments/${patient.profileImageUrl}`} />

// Para link de download de PDF:
<a href={`${API_BASE_URL}/attachments/${attachment.id}`} target="_blank">
  Baixar {attachment.filename}
</a>
```

> ⚠️ **`profileImageUrl` é o ID do attachment**, não uma URL completa. Monte a URL completa concatenando com a base do backend.

### Erros

| Status | Quando |
|--------|--------|
| `404` | Attachment não existe no banco ou não foi encontrado no storage |

---

## 5. `DELETE /attachments/:id` — Remover attachment

**Auth**: 🔒 JWT obrigatório  
**Controller**: `delete-attachment.controller.ts`

### Path params

```ts
id: string  // UUID do attachment — validado como UUID pelo backend
```

### Response `204 No Content`

Sem body na resposta.

### Erros

| Status | Quando |
|--------|--------|
| `400` | `id` não é UUID válido |
| `401` | Token ausente ou inválido |
| `404` | Attachment não encontrado ou não pertence ao psicólogo |

### Como implementar

```ts
export async function deleteAttachment(id: string) {
  await api.delete(`/attachments/${id}`)
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments'] })
    },
  })
}
```

---

## Fluxo completo: upload de foto de perfil do paciente

```ts
// 1. Upload do arquivo
const { attachmentId } = await uploadAttachment(file, {
  patientId: patient.id,
  type: 'AVATAR',
})

// 2. O backend já atualizou profileImageUrl do paciente com o attachmentId
// Invalide as queries para refletir o novo estado
queryClient.invalidateQueries({ queryKey: ['patient', patient.id] })

// 3. Para exibir a imagem:
// patient.profileImageUrl === attachmentId (string UUID)
<img src={`${API_BASE_URL}/attachments/${patient.profileImageUrl}`} />
```

---

## Armadilhas

### ❌ Enviar JSON em vez de form-data

```ts
// Errado — o backend usa FileInterceptor, espera multipart/form-data
await api.post('/attachments', { file, patientId })

// Correto
const form = new FormData()
form.append('file', file)
form.append('patientId', patientId)
await api.post('/attachments', form)
```

### ❌ Setar Content-Type manualmente

```ts
// Errado — quebra o boundary do multipart
await api.post('/attachments', form, {
  headers: { 'Content-Type': 'multipart/form-data' }
})

// Correto — deixe o browser/node definir com o boundary correto
await api.post('/attachments', form)
```

### ❌ Usar `fileUrl` como URL absoluta

```ts
// Errado — fileUrl é um storage key interno, não URL pública
<img src={attachment.fileUrl} />

// Correto — passe pelo endpoint de serving
<img src={`${API_BASE_URL}/attachments/${attachment.id}`} />
```

### ❌ Confundir os campos dos dois endpoints de listagem

```ts
// GET /attachments/patient/:id retorna:
attachment.url        // storage key
attachment.size       // bytes
attachment.type       // MIME type

// GET /attachments retorna:
attachment.fileUrl    // storage key
attachment.SizeInBytes // bytes (S maiúsculo!)
attachment.contentType // MIME type

// Normalize para um tipo interno único:
interface NormalizedAttachment {
  id:          string
  filename:    string
  storageKey:  string   // attachment.url ou attachment.fileUrl
  mimeType:    string   // attachment.type ou attachment.contentType
  sizeInBytes: number   // attachment.size ou attachment.SizeInBytes
  uploadedAt:  Date
}
```

---

## Fonte da verdade

Gerado de: `nestjs-mind-back` — branch `feat/patient-qrcode-registration`  
Atualizado em: 2026-05-14

Controllers de referência:
- `src/infra/http/controllers/upload-attachment.controller.ts`
- `src/infra/http/controllers/fetch-all-attachments.controller.ts`
- `src/infra/http/controllers/fetch-patient-attachments.controller.ts`
- `src/infra/http/controllers/get-attachment.controller.ts`
- `src/infra/http/controllers/delete-attachment.controller.ts`
