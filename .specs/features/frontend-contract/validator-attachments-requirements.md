# Attachments — Frontend Validator Requirements

> Source of truth: backend validators + controllers.
> Todos os shapes verificados contra o código-fonte em 2026-05-31.
> Auth: todos os endpoints exigem JWT exceto onde indicado.

---

## 1. POST `/attachments` — Upload de arquivo

**Sem schema Zod** — validação via NestJS `ParseFilePipe` + `FileInterceptor`.

### Formato da request

`multipart/form-data` — **não** `application/json`.

| Campo | Origem | Tipo | Obrigatório | Regras |
|-------|--------|------|-------------|--------|
| `file` | file field | `File` | ✅ | ver restrições abaixo |
| `patientId` | body field | `string` | ❌ | string livre; vazio vira `null` internamente |
| `type` | body field | `string` | ❌ | se `"AVATAR"` e `patientId` presente, atualiza `profileImageUrl` do paciente |

### Restrições do arquivo

| Regra | Valor |
|-------|-------|
| Tamanho máximo | **3 MB** (`1024 * 1024 * 3`) |
| MIME types aceitos | `image/jpeg`, `image/jpg`, `image/png`, `application/pdf` |

> ⚠️ Limite é **3 MB**, não 5 MB. Arquivos entre 3–5 MB passam na validação do frontend
> mas recebem erro do backend.

> ⚠️ Áudio **não é aceito**. A mensagem de erro do backend é:
> `"Tipo de arquivo inválido. Apenas JPG, PNG e PDF são aceitos."`

### Response `201`

```json
{
  "attachmentId": "string",
  "url": "string"
}
```

> O `url` retornado aqui é a URL pública do arquivo no storage (ex: S3).

### Erros possíveis

| Situação | HTTP | Mensagem |
|----------|------|---------|
| Arquivo > 3 MB | 413 | `"O arquivo excedeu o limite de 3MB."` |
| MIME type inválido | 415 | `"Tipo de arquivo inválido. Apenas JPG, PNG e PDF são aceitos."` |

**Backend proof:** `src/infra/http/controllers/attachments/upload-attachment.controller.ts`

---

## 2. GET `/attachments` — Listar todos os anexos do psicólogo autenticado

**Schema:** `src/validators/attachments/controllers/fetch-attachments-schema.ts`

### Query params

| Param | Tipo no schema | Default | Regras |
|-------|---------------|---------|--------|
| `page` | `string` → `number` | `"0"` | enviado como string; backend transforma em número; mín. `0` |
| `filter` | `string` | — | busca textual |
| `patientId` | `string` | — | UUID válido |
| `from` | `string` | — | ISO 8601 — backend faz `new Date(value)` |
| `to` | `string` | — | ISO 8601 — backend faz `new Date(value)` |

> ⚠️ O param de paginação é `page`, **não** `pageIndex`. Enviar `pageIndex` é ignorado.

> ⚠️ Não existe `perPage` — o backend hardcoda 10 itens por página e sempre retorna
> `perPage: 10` no meta.

### Response `200`

```json
{
  "attachments": [
    {
      "id": "string",
      "filename": "string",
      "fileUrl": "string",
      "contentType": "string",
      "sizeInBytes": number,
      "uploadedAt": "ISO date string"
    }
  ],
  "meta": {
    "pageIndex": number,
    "totalCount": number,
    "perPage": 10,
    "totalStorageSize": number
  }
}
```

> ⚠️ O campo de tamanho é `sizeInBytes` (lowercase `s`). Qualquer referência a
> `SizeInBytes` (capital S) no frontend é incorreta.

> O campo `patient` está comentado no backend — **não é retornado** nesta rota.

**Backend proof:** `src/infra/http/controllers/attachments/fetch-all-attachments.controller.ts`

---

## 3. GET `/attachments/patient/:patientId` — Listar anexos de um paciente

Sem schema Zod — path param extraído diretamente.

### Path param

| Param | Tipo | Regras |
|-------|------|--------|
| `patientId` | `string` | sem validação UUID no backend — qualquer string |

### Response `200`

```json
{
  "attachments": [
    {
      "id": "string",
      "filename": "string",
      "url": "string",
      "type": "string",
      "size": number,
      "uploadedAt": "ISO date string"
    }
  ]
}
```

> ⚠️ **Inconsistência com `GET /attachments`** — os campos têm nomes diferentes
> para os mesmos dados:
>
> | `GET /attachments` | `GET /attachments/patient/:id` |
> |--------------------|-------------------------------|
> | `fileUrl` | `url` |
> | `contentType` | `type` |
> | `sizeInBytes` | `size` |
>
> O frontend precisa de dois tipos distintos para cada rota, ou normalizar na camada
> de serviço.

**Backend proof:** `src/infra/http/controllers/attachments/fetch-patient-attachments.controller.ts`

---

## 4. GET `/attachments/:id` — Download / stream de arquivo

Sem schema Zod. **Sem JWT guard declarado no controller.**

> ⚠️ Esta rota **não retorna JSON** — faz streaming binário do arquivo diretamente.
> O frontend não deve tentar parsear a resposta como JSON.

### Path param

| Param | Tipo |
|-------|------|
| `id` | `string` (sem validação UUID — qualquer string) |

### Response — streaming

Headers retornados:

| Header | Valor |
|--------|-------|
| `Content-Type` | MIME type do arquivo |
| `Content-Disposition` | `inline; filename="nome-do-arquivo"` |
| `Content-Length` | tamanho em bytes (quando disponível) |
| `Cache-Control` | `public, max-age=31536000, immutable` |

> O cache é imutável (`immutable`) — arquivos são servidos por 1 ano sem revalidação.
> Para exibir um arquivo no browser, apontar `<img src>` ou `<a href>` diretamente para esta URL.

### Erros (JSON)

| Situação | HTTP | Body |
|----------|------|------|
| ID não encontrado | 404 | `{ "message": "Attachment not found" }` |
| Erro no storage | 404 | `{ "message": "Error retrieving file" }` |

**Backend proof:** `src/infra/http/controllers/attachments/get-attachment.controller.ts`

---

## 5. DELETE `/attachments/:id` — Deletar anexo

**Schema:** `src/validators/attachments/controllers/delete-attachment-schema.ts`

### Path param

| Param | Tipo | Regras |
|-------|------|--------|
| `id` | `string` | UUID válido |

### Response `204`

Sem body.

**Backend proof:** `src/infra/http/controllers/attachments/delete-attachment.controller.ts`

---

## Resumo — o que o frontend precisa corrigir

| # | Endpoint | Problema | Ação |
|---|----------|---------|------|
| 1 | POST `/attachments` | `MAX_FILE_SIZE` é 5 MB no front — backend é **3 MB** | Corrigir para `1024 * 1024 * 3` |
| 1 | POST `/attachments` | Label menciona áudio — backend **não aceita** | Remover áudio do label |
| 2 | GET `/attachments` | Param `pageIndex` não existe — backend usa `page` | Renomear param |
| 2 | GET `/attachments` | `perPage` não é query param — hardcoded no backend | Remover do schema; ler do `meta.perPage` |
| 2 | GET `/attachments` | `sizeInBytes` lowercase — não `SizeInBytes` | Corrigir casing no tipo |
| 3 | GET `/attachments/patient/:id` | Campos `url`, `type`, `size` diferentes da outra rota | Criar tipo separado `PatientAttachmentItem` |
| 4 | GET `/attachments/:id` | Não é JSON — é stream binário | Não parsear como JSON; usar como `src` de `<img>`/`<a>` |
