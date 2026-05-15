# Attachment API — Frontend Contract

> Fonte: varredura completa do backend em 2026-05-14.
> Toda tipagem, enum e shape de resposta aqui são derivados diretamente do código-fonte.

---

## Diagnóstico do erro 500 no upload

**Causa provável:** `R2Storage.upload()` falha quando as env vars do Cloudflare R2 não estão configuradas ou são inválidas (`CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`). A exceção não é capturada no controller e sobe como 500.

**Ação no backend:** verificar logs do servidor e validar as env vars do R2.

**Ação no frontend:** o error body de um 500 não tem estrutura garantida. Tratar como erro genérico.

---

## Modelo de dados

### `Attachment`

```ts
interface Attachment {
  id: string              // UUID
  uploaderId: string      // UUID do psicólogo que enviou
  patientId: string | null
  filename: string        // nome original do arquivo (normalizado para UTF-8)
  contentType: AttachmentContentType
  sizeInBytes: number     // tamanho em bytes
  fileUrl: string         // chave R2 (não é URL pública — usar GET /attachments/:id)
  sessionDate: string | null  // ISO 8601 datetime
  uploadedAt: string      // ISO 8601 datetime
  updatedAt: string       // ISO 8601 datetime
  deletedAt: string | null
  patient: {
    firstName: string
    lastName: string
  } | null
}
```

---

## Enums e literais

### `AttachmentContentType`

Tipos de arquivo aceitos no upload. O backend valida com regex exata:

```ts
type AttachmentContentType =
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'application/pdf'
```

### `AttachmentUploadType`

Campo `type` no body do upload. Só `'AVATAR'` tem comportamento especial:

```ts
type AttachmentUploadType = 'AVATAR' | string
```

Quando `type === 'AVATAR'` **e** `patientId` é informado, o backend atualiza `user.profileImageUrl` com o ID do attachment (chave R2). O frontend deve usar `GET /attachments/:id` para exibir a imagem.

---

## Endpoints

### `POST /attachments` — Upload de arquivo

**Auth:** Bearer JWT obrigatório.

**Content-Type:** `multipart/form-data`

**Campos do form:**

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `file` | File (binary) | sim | Arquivo a enviar |
| `patientId` | string (UUID) | não | Víncula ao paciente |
| `type` | string | não | `'AVATAR'` atualiza o avatar do paciente |

**Restrições:**
- Tamanho máximo: **3 MB** (3 × 1024 × 1024 bytes)
- MIME types aceitos: `image/jpeg`, `image/jpg`, `image/png`, `application/pdf`
- Violação de tamanho → `400` com `"O arquivo excedeu o limite de 3MB."`
- Violação de MIME → `400` com `"Tipo de arquivo inválido. Apenas JPG, PNG e PDF são aceitos."`

**Resposta `200`:**

```ts
interface UploadAttachmentResponse {
  attachmentId: string  // UUID do attachment criado
  url: string           // chave R2 (mesmo valor que attachmentId — use GET /attachments/:id para carregar)
}
```

---

### `GET /attachments` — Listar todos os attachments do psicólogo

**Auth:** Bearer JWT obrigatório.

**Query params:**

| Param | Tipo | Default | Descrição |
|-------|------|---------|-----------|
| `page` | number (inteiro ≥ 0) | `0` | Índice da página (0-based) |
| `filter` | string | — | Busca por filename ou nome do paciente (case-insensitive) |
| `patientId` | string (UUID) | — | Filtra por paciente |
| `from` | string (ISO 8601) | — | Data mínima de upload |
| `to` | string (ISO 8601) | — | Data máxima de upload |

**Resposta `200`:**

```ts
interface FetchAllAttachmentsResponse {
  attachments: FetchedAttachment[]
  meta: {
    pageIndex: number
    totalCount: number
    perPage: 10          // fixo no backend
    totalStorageSize: number  // soma dos bytes de todos os arquivos (considerando filtros)
  }
}

interface FetchedAttachment {
  id: string
  filename: string
  fileUrl: string         // chave R2 — usar GET /attachments/:id para exibir
  contentType: AttachmentContentType
  SizeInBytes: number     // ATENÇÃO: S maiúsculo — vem assim do backend
  uploadedAt: string      // ISO 8601
  patient: {
    firstName: string
    lastName: string
  } | null
}
```

> **Atenção:** `SizeInBytes` com `S` maiúsculo é como o backend serializa. Mapear no frontend para `sizeInBytes` camelCase.

---

### `GET /attachments/:id` — Buscar/exibir arquivo (stream)

**Auth:** sem guard (público).

**Resposta:** stream binário do arquivo com headers:
- `Content-Type`: MIME original do arquivo
- `Content-Disposition`: `inline; filename="<nome original>"`
- `Content-Length`: tamanho em bytes (quando disponível)
- `Cache-Control`: `public, max-age=31536000, immutable`

**Erros:**
- `404` JSON `{ "message": "Attachment not found" }` — ID não existe no banco
- `404` JSON `{ "message": "Error retrieving file" }` — falha ao buscar no R2

**Uso no frontend:**
```ts
// Para exibir imagem:
<img src={`/attachments/${attachmentId}`} />

// Para download:
window.open(`/attachments/${attachmentId}`, '_blank')
```

---

### `GET /attachments/patient/:patientId` — Attachments de um paciente

**Auth:** Bearer JWT obrigatório.

**Resposta `200`:**

```ts
interface FetchPatientAttachmentsResponse {
  attachments: PatientAttachment[]
}

interface PatientAttachment {
  id: string
  filename: string
  url: string              // chave R2 — diferente de fileUrl usado em GET /attachments
  type: AttachmentContentType  // campo chama-se "type" aqui, não "contentType"
  size: number             // campo chama-se "size" aqui, não "SizeInBytes"
  uploadedAt: string       // ISO 8601
}
```

> **Atenção:** este endpoint usa nomes de campos **diferentes** de `GET /attachments`.
> Mapeamento: `url` ↔ `fileUrl`, `type` ↔ `contentType`, `size` ↔ `SizeInBytes`.

---

### `DELETE /attachments/:id` — Deletar attachment

**Auth:** Bearer JWT obrigatório.

**Regras:**
- Apenas o psicólogo que fez o upload pode deletar (verifica `uploaderId`)
- Soft delete: seta `deletedAt` e remove do R2

**Respostas:**
- `204` — deletado com sucesso (sem body)
- `404` — attachment não encontrado
- `403` — tentativa de deletar attachment de outro usuário

---

## Inconsistências de nomenclatura entre endpoints

O frontend deve normalizar internamente:

| Campo de domínio | `GET /attachments` | `GET /attachments/patient/:id` | `POST /attachments` (resposta) |
|---|---|---|---|
| ID | `id` | `id` | `attachmentId` |
| Nome do arquivo | `filename` | `filename` | — |
| Chave R2 | `fileUrl` | `url` | `url` |
| MIME type | `contentType` | `type` | — |
| Tamanho | `SizeInBytes` (S maiúsculo) | `size` | — |
| Data de upload | `uploadedAt` | `uploadedAt` | — |
| Paciente | `patient { firstName, lastName }` | — | — |

**Recomendação:** criar um tipo `Attachment` canônico no frontend e mappers por endpoint.

---

## Fluxo de avatar de paciente

```
1. Frontend envia POST /attachments
   form: { file, patientId: "<uuid>", type: "AVATAR" }

2. Backend:
   a. Faz upload para R2 (chave = attachment UUID)
   b. Cria registro na tabela attachments
   c. Atualiza user.profileImageUrl = attachment.id (UUID, não URL)
   d. Retorna { attachmentId, url }

3. Frontend exibe avatar:
   <img src={`/attachments/${attachmentId}`} />
   (O endpoint GET /attachments/:id busca do R2 e faz stream)
```

---

## Tipos TypeScript recomendados para o frontend

```ts
type AttachmentContentType =
  | 'image/jpeg'
  | 'image/jpg'
  | 'image/png'
  | 'application/pdf'

// Tipo canônico normalizado
interface Attachment {
  id: string
  filename: string
  fileUrl: string            // chave R2 — usar /attachments/:id para exibir
  contentType: AttachmentContentType
  sizeInBytes: number
  uploadedAt: string
  patient: { firstName: string; lastName: string } | null
}

// POST /attachments response
interface UploadAttachmentResponse {
  attachmentId: string
  url: string
}

// GET /attachments response
interface FetchAllAttachmentsResponse {
  attachments: Array<{
    id: string
    filename: string
    fileUrl: string
    contentType: AttachmentContentType
    SizeInBytes: number      // manter S maiúsculo ao tipar o contrato raw
    uploadedAt: string
    patient: { firstName: string; lastName: string } | null
  }>
  meta: {
    pageIndex: number
    totalCount: number
    perPage: number
    totalStorageSize: number
  }
}

// GET /attachments/patient/:patientId response
interface FetchPatientAttachmentsResponse {
  attachments: Array<{
    id: string
    filename: string
    url: string
    type: AttachmentContentType
    size: number
    uploadedAt: string
  }>
}
```

---

## Constraints resumidas

| Regra | Valor |
|-------|-------|
| Tamanho máximo por arquivo | 3 MB |
| MIME types aceitos | `image/jpeg`, `image/jpg`, `image/png`, `application/pdf` |
| Paginação | 10 itens por página, 0-based |
| Auth | Bearer JWT (exceto `GET /attachments/:id`) |
| Soft delete | `deletedAt` setado + arquivo removido do R2 |
| Avatar | `type: 'AVATAR'` + `patientId` → atualiza `user.profileImageUrl` |
| `fileUrl` / `url` | Chave R2 (UUID), não URL pública. Exibir via `GET /attachments/:id` |
