# Frontend Contract — Patient GET Endpoints

> **Para o Claude do frontend**: Este diretório é o contrato oficial entre o backend NestJS (`nestjs-mind-back`) e o frontend. Use-o como **única fonte de verdade** para implementar chamadas de API relacionadas a pacientes. Não invente tipos. Não suponha nullability. Tudo está aqui.

---

## Como usar estes arquivos

### 1. `types.ts`
Copie ou importe este arquivo no projeto frontend. Contém todos os enums e interfaces TypeScript que correspondem **exatamente** ao que o backend envia e recebe via HTTP.

```ts
// No frontend, importe assim:
import type { PatientHTTP, Gender, AppointmentStatus } from '@/contracts/types'
```

### 2. `patient-get.md`
Referência completa dos endpoints GET relacionados a pacientes. Para cada endpoint há:
- Rota exata e método HTTP
- Se exige JWT ou é público
- Params (query, path) com tipos e defaults
- Response shape tipada
- Exemplo de implementação (service + React Query hook)
- Erros esperados por status code

### 3. `patient-mutations.md`
Endpoints POST/PUT/PATCH/DELETE de pacientes (criar, editar, deletar, status, registro via link).

### 4. `attachments.md`
Todos os 5 endpoints de attachments: upload, listagem geral, listagem por paciente, serving do arquivo binário, e delete. Inclui armadilhas de `multipart/form-data`, inconsistências de nomenclatura entre endpoints e o fluxo completo de foto de perfil.

---

## Regras que o frontend DEVE seguir

### Nunca use `undefined` para campos opcionais
O backend usa `null` para valores ausentes. Seus tipos devem refletir isso:
```ts
// ❌ Errado
email?: string

// ✅ Correto
email: string | null
```

### Enums: use os valores exatos do wire
Os valores de enum que trafegam no HTTP são strings exatas. Use `types.ts` como referência:
```ts
// ❌ Errado
gender: 'female' | 'male'

// ✅ Correto
gender: 'FEMININE' | 'MASCULINE' | 'OTHER'
// ou
gender: Gender  // importado de types.ts
```

### Paginação é zero-indexed
`pageIndex: 0` = primeira página. Nunca envie `page: 1` como se fosse one-indexed.

### Datas chegam como ISO 8601 strings
Todos os campos de data (`createdAt`, `dateOfBirth`, `lastSessionAt`, etc.) chegam como `string` no JSON. Parse com `new Date()` ou sua lib de datas antes de exibir.

### O filtro `'all'` nunca é enviado de volta
Quando o usuário seleciona "Todos" num filtro, o frontend deve enviar `undefined` ou omitir o param (não enviar `'all'`). O backend aceita `'all'` mas normaliza para `null` internamente.

---

## Endpoints em falta ou quebrados

| Endpoint | Status | O que fazer |
|---|---|---|
| `GET /patients/stats/new` | ⚠️ Retorna sempre `[]` | Não construa gráfico que dependa disso agora |
| `GET /patients/:cpf`, `/:email`, `/:name` | ⚠️ Conflito de rota com `/:id` | Use `GET /patients?filter=` em vez dessas rotas |

---

## Fonte da verdade

Gerado de: `nestjs-mind-back` — branch `feat/patient-qrcode-registration`
Atualizado em: 2026-05-13

Se o backend mudar um contrato, este arquivo deve ser atualizado junto.
