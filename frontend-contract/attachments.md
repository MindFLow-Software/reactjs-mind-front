# Attachments — Guia de Implementação para o Frontend

> **Para o Claude do frontend**: Este documento cobre todos os endpoints de attachments (upload, listagem, download, delete). Inclui a causa raiz do erro 500 no upload, as duas shapes de resposta distintas que o backend retorna, e todas as armadilhas conhecidas.

---

## Causa raiz do erro 500 em POST /attachments

O controller `UploadAttachmentController` está **sem `@UseGuards(JwtAuthGuard)`** no método POST. O decorator `@CurrentUser()` tenta ler `request.user`, que é `undefined` sem o guard. A leitura de `user.sub` lança `TypeError: Cannot read property 'sub' of undefined`, que cai no filtro global como 500.

**Fix no backend**: adicionar `@UseGuards(JwtAuthGuard)` ao método `@Post()` do controller.

**Consequência para o frontend**: enquanto o backend não corrigir, qualquer upload retorna 500. O frontend não tem como contornar isso — é um bug no servidor.

---

## Modelo de dados (Prisma)

```prisma
model Attachment {
  id          String    @id @default(uuid())
  patientId   String?   @map("patient_id")
  uploaderId  String    @map("uploader_id")
  filename    String
  SizeInBytes Int       @map("size_in_bytes")   // ⚠️ S maiúsculo no JSON
  contentType String    @map("content_type")
  sessionDate DateTime? @map("session_date")
  fileUrl     String    @map("file_url")         // armazena só o UUID (key do R2)
  uploadedAt  DateTime  @default(now()) @map("uploaded_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  deletedAt   DateTime?                          // soft delete
}
```

> **`fileUrl` não é uma URL completa** — é o UUID do attachment (key do Cloudflare R2). O arquivo é acessado via `GET /attachments/:id`, não por URL direta.

---

## Tipos de arquivo aceitos

```ts
type AllowedMimeType = 'image/jpeg' | 'image/jpg' | 'image/png' | 'application/pdf'
```

Limite de tamanho: **3 MB** (3.145.728 bytes).

---

## Endpoints

---

### 1. `POST /attachments` — Upload de arquivo

**Auth**: 🔒 JWT obrigatório (**⚠️ bug: guard ausente no backend — retorna 500**)
**Content-Type**: `multipart/form-data`

#### Body (form-data)

| Campo      | Tipo   | Obrigatório | Descrição |
|---|---|---|---|
| `file`     | File   | ✓ | Binário do arquivo (JPG, PNG ou PDF) |
| `patientId`| string | ✓ | UUID do paciente |
| `type`     | string | ✗ | Se `'AVATAR'`, atualiza `user.profileImageUrl` com o `attachmentId` |

#### Response `200 OK`

```ts
interface UploadAttachmentResponse {
  attachmentId: string  // UUID do attachment criado
  url:          string  // mesmo valor que attachmentId (key do R2)
}
```

> ⚠️ `url` **não é uma URL navegável** — é o UUID/key do R2. Para exibir o arquivo, use `GET /attachments/:id` ou construa a URL do R2 conforme o ambiente.

#### Como implementar

```ts
export async function uploadAttachment(file: File, patientId: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('patientId', patientId)

  const { data } = await api.post<UploadAttachmentResponse>('/attachments', formData)
  return data
}

export async function uploadAvatar(file: File, patientId: string) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('patientId', patientId)
  formData.append('type', 'AVATAR')

  const { data } = await api.post<UploadAttachmentResponse>('/attachments', formData)
  return data
}
```

#### Erros

| Status | Quando |
|---|---|
| `500` | Guard ausente no backend (bug) — `request.user` é `undefined` |
| `413` | Arquivo maior que 3 MB |
| `415` | MIME type não permitido |
| `401` | Token ausente ou inválido (após o fix do guard) |

---

### 2. `GET /attachments/:id` — Servir arquivo (download/visualização)

**Auth**: 🌐 Público — sem JWT
**Response**: stream binário do arquivo

#### Path params

```ts
id: string  // UUID do attachment
```

#### Response `200 OK`

Headers:
```
Content-Type:        <MIME type original>
Content-Disposition: inline; filename="<filename>"
Content-Length:      <bytes>
Cache-Control:       public, max-age=31536000, immutable
```

Body: stream binário do arquivo.

> Para exibir uma imagem: `<img src="/attachments/{attachmentId}" />`
> Para exibir um PDF: `<iframe src="/attachments/{attachmentId}" />`

#### Erros

| Status | Quando |
|---|---|
| `404` | Attachment não encontrado ou deletado (soft delete) |

---

### 3. `DELETE /attachments/:id` — Deletar attachment

**Auth**: 🔒 JWT obrigatório

#### Path params

```ts
id: string  // UUID do attachment
```

#### Response `204 No Content`

#### Erros

| Status | Quando |
|---|---|
| `404` | Attachment não encontrado |
| `403` | Usuário não é o uploader do attachment |

> Soft delete — apenas seta `deletedAt`. O arquivo no R2 não é removido imediatamente.

---

### 4. `GET /attachments/patient/:patientId` — Attachments de um paciente específico

**Auth**: 🔒 JWT obrigatório

#### Path params

```ts
patientId: string  // UUID do paciente
```

#### Response `200 OK`

```ts
// ⚠️ Shape diferente da GET /attachments paginada — campos mapeados pelo presenter
interface PatientAttachmentItem {
  id:         string
  filename:   string
  url:        string  // ← fileUrl mapeado para 'url'
  type:       string  // ← contentType mapeado para 'type'
  size:       number  // ← SizeInBytes mapeado para 'size'
  uploadedAt: string  // ISO 8601
}

interface GetPatientAttachmentsResponse {
  attachments: PatientAttachmentItem[]
}
```

> **`url` aqui é o `fileUrl` do banco (UUID/key do R2)** — não uma URL navegável. Para visualizar, use `GET /attachments/{url}`.

---

### 5. `GET /attachments` — Listagem paginada de attachments do psicólogo

**Auth**: 🔒 JWT obrigatório

#### Query params

```ts
type GetAllAttachmentsParams = {
  page?:      number  // 0-indexed, default: 0
  filter?:    string  // busca em filename e patient firstName/lastName
  patientId?: string  // UUID — filtro por paciente específico
  from?:      string  // ISO 8601 — data de início (gte)
  to?:        string  // ISO 8601 — data de fim (lte)
}
```

> Não envie `patientId: 'all'` — omita o campo quando não houver filtro.

#### Response `200 OK`

```ts
// ⚠️ Shape DIFERENTE de GET /attachments/patient/:patientId
// Campos em snake_case/camelCase inconsistentes com o outro endpoint
interface PaginatedAttachmentItem {
  id:          string
  filename:    string
  fileUrl:     string  // ← campo 'fileUrl' (não 'url')
  contentType: string  // ← campo 'contentType' (não 'type')
  SizeInBytes: number  // ← 'S' MAIÚSCULO — reflete o campo Prisma
  uploadedAt:  string  // ISO 8601
  patient:     { firstName: string; lastName: string } | null
}

interface GetAllAttachmentsResponse {
  attachments: PaginatedAttachmentItem[]
  meta: {
    pageIndex:        number
    totalCount:       number
    perPage:          number  // fixo: 10
    totalStorageSize: number  // total em bytes de todos os attachments
  }
}
```

> **Filtro só retorna attachments do psicólogo autenticado** (via `uploaderId === user.sub`).

---

## As duas shapes de attachment

O backend tem **dois presenters diferentes** para attachments. Nunca misture os tipos:

| Endpoint | `url`/`fileUrl` | `type`/`contentType` | `size`/`SizeInBytes` | `patient` |
|---|---|---|---|---|
| `GET /attachments/patient/:id` | `url` | `type` | `size` | não inclui |
| `GET /attachments` (paginado) | `fileUrl` | `contentType` | `SizeInBytes` (S maiúsculo) | inclui `{firstName, lastName}` |

---

## Armadilhas comuns

### ❌ Esperar uma URL navegável em `url` / `fileUrl`
```ts
// Errado — fileUrl é o UUID/key do R2, não uma URL
<img src={attachment.url} />

// Correto — use o endpoint de serving
<img src={`${import.meta.env.VITE_API_URL}/attachments/${attachment.url}`} />
```

### ❌ Usar `size` no attachment da listagem paginada
```ts
// Errado — campo errado para GET /attachments
attachment.size       // undefined

// Correto
attachment.SizeInBytes  // ← S maiúsculo
```

### ❌ Enviar `patientId: 'all'` como filtro
```ts
// Errado
params.patientId = 'all'

// Correto — omita quando não houver filtro
const params: GetAllAttachmentsParams = {
  page: 0,
  // patientId: omitido = sem filtro
}
```

### ❌ Esperar `Content-Type: application/json` no GET /:id
```ts
// Errado — retorna stream binário
const { data } = await api.get(`/attachments/${id}`)
JSON.parse(data)  // quebra

// Correto — use direto como src em img/iframe ou baixe como blob
const response = await api.get(`/attachments/${id}`, { responseType: 'blob' })
const objectUrl = URL.createObjectURL(response.data)
```

---

## Tipos para adicionar ao contracts/types.ts

```ts
// Attachment retornado por GET /attachments/patient/:patientId
export interface PatientAttachmentItem {
  id:         string
  filename:   string
  url:        string        // fileUrl do R2 (UUID) — não URL navegável
  type:       string        // MIME type
  size:       number        // bytes
  uploadedAt: string        // ISO 8601
}

// Attachment retornado por GET /attachments (listagem paginada)
export interface PaginatedAttachmentItem {
  id:          string
  filename:    string
  fileUrl:     string        // fileUrl do R2 (UUID) — não URL navegável
  contentType: string        // MIME type
  SizeInBytes: number        // ⚠️ S maiúsculo
  uploadedAt:  string        // ISO 8601
  patient:     { firstName: string; lastName: string } | null
}

export interface AttachmentsMeta {
  pageIndex:        number
  totalCount:       number
  perPage:          number  // fixo: 10
  totalStorageSize: number  // bytes
}

// Resposta do POST /attachments
export interface UploadAttachmentResponse {
  attachmentId: string
  url:          string  // mesmo que attachmentId
}

// Params de GET /attachments
export type GetAllAttachmentsParams = {
  page?:      number
  filter?:    string
  patientId?: string
  from?:      string  // ISO 8601
  to?:        string  // ISO 8601
}
```

---

## Resumo dos endpoints

| Rota | Método | Auth | Resposta |
|---|---|---|---|
| `/attachments` | POST | 🔒 JWT (**⚠️ bug: guard ausente**) | `{ attachmentId, url }` |
| `/attachments/:id` | GET | 🌐 Público | Stream binário |
| `/attachments/:id` | DELETE | 🔒 JWT | `204 No Content` |
| `/attachments/patient/:patientId` | GET | 🔒 JWT | `{ attachments: PatientAttachmentItem[] }` |
| `/attachments` | GET | 🔒 JWT | `{ attachments: PaginatedAttachmentItem[], meta }` |

---

## Status do backend

| Problema | Impacto | Fix |
|---|---|---|
| `POST /attachments` sem `@UseGuards(JwtAuthGuard)` | **500 em qualquer upload** | Adicionar guard no controller |
| `GET /attachments/:id` público | Qualquer pessoa pode baixar qualquer arquivo com o UUID | Adicionar guard se necessário |
| `profileImageUrl` recebe `attachmentId` (não URL) no flow de AVATAR | Preview de avatar depende do `GET /attachments/:id` | Construir URL na exibição |
