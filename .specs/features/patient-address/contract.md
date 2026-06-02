# Backend Contract — Patient Address

> **Purpose**: Authoritative reference for the frontend on todas as mudanças introduzidas pela feature de endereço de paciente. Use como fonte única de verdade ao atualizar formulários, tipagens e chamadas de API.
>
> **Generated from**: NestJS backend at `nestjs-mind-back`, branch `feat/patient-address`.
> **Last updated**: 2026-05-30

---

## Resumo das mudanças

| O que mudou | Impacto no front |
|-------------|-----------------|
| `Ipatient` ganhou 5 novos campos de endereço | Atualizar tipo `Ipatient` em todo o projeto |
| `POST /patient` aceita campos de endereço | Formulário de cadastro pode enviar endereço |
| `PUT /patient/:id` aceita campos de endereço | Formulário de edição pode atualizar endereço |
| **Novo** `GET /address/cep/:cep` | Usar para auto-preencher formulário ao digitar CEP |

---

## Tipo Ipatient — atualizado

O tipo `Ipatient` (retornado pelo `PatientPresenter`) ganhou **5 novos campos** ao final:

```ts
interface Ipatient {
  id:              string        // UUID
  firstName:       string        // capitalizado pelo backend
  lastName:        string        // capitalizado pelo backend
  name:            string        // computed: `${firstName} ${lastName}`
  email:           string | null
  cpf:             string | null // dígitos puros, sem máscara
  phoneNumber:     string | null
  gender:          'OTHER' | 'FEMININE' | 'MASCULINE'
  isActive:        boolean
  dateOfBirth:     string | null // ISO 8601
  profileImageUrl: string | null
  createdAt:       string        // ISO 8601
  lastSessionAt:   string | null // ISO 8601 — última sessão FINISHED

  // NOVOS CAMPOS — endereço estruturado
  cep:        string | null  // 8 dígitos sem máscara, ex: "01001000"
  logradouro: string | null  // rua e número, ex: "Praça da Sé, 1"
  bairro:     string | null
  cidade:     string | null
  uf:         string | null  // 2 caracteres, ex: "SP"
}
```

> **Todos os campos de endereço são `null` para pacientes criados antes desta feature.** O front deve tratar `null` como "não informado".

> **CEP é salvo sem máscara** (8 dígitos numéricos). Aplicar máscara `00000-000` apenas na exibição.

Este tipo atualizado afeta todos os endpoints que retornam pacientes:
- `GET /patients` → cada item do array `patients`
- `GET /patients/:id` → objeto `patient`
- `GET /patients/filter/with-attachments` → cada item do array `patients`

---

## Endpoints existentes atualizados

### `POST /patient` — Criar paciente

🔒 JWT required · Roles: `PSYCHOLOGIST`, `ADMIN`, `SUPER_ADMIN`

Campos de endereço são **opcionais**. Enviar apenas os que o usuário preencheu.

#### Body (campos de endereço adicionados)

```ts
interface CreatePatientBody {
  // campos existentes
  firstName:       string
  lastName:        string
  gender?:         'OTHER' | 'FEMININE' | 'MASCULINE'  // default: 'OTHER'
  cpf?:            string        // formato livre — backend valida e limpa
  phoneNumber?:    string
  dateOfBirth?:    string        // ISO 8601 date
  profileImageUrl?: string

  // NOVOS — todos opcionais
  cep?:        string   // enviar sem máscara ("01001000") ou com ("01001-000") — backend limpa
  logradouro?: string
  bairro?:     string
  cidade?:     string
  uf?:         string   // máximo 2 caracteres
}
```

> String vazia (`""`) é tratada como `null` pelo backend. Não é necessário converter antes de enviar.

#### Response `201 Created`

```json
{
  "message": "Patient created successfully",
  "patientId": "uuid-here"
}
```

> O response de criação **não retorna o paciente completo**. Para exibir os dados após criação, buscar com `GET /patients/:id`.

---

### `PUT /patient/:id` — Atualizar paciente

🔒 JWT required · Roles: `PSYCHOLOGIST`, `ADMIN`, `SUPER_ADMIN`

Campos de endereço são **opcionais e independentes**: enviar apenas os que foram alterados. Campos não enviados **não são zerados**.

#### Body (campos de endereço adicionados)

```ts
interface UpdatePatientBody {
  // campos existentes
  firstName?:       string
  lastName?:        string
  email?:           string
  phoneNumber?:     string
  dateOfBirth?:     string        // ISO 8601 date
  cpf?:             string
  gender?:          'OTHER' | 'FEMININE' | 'MASCULINE'
  profileImageUrl?: string
  attachmentIds?:   string[]      // UUIDs

  // NOVOS — todos opcionais
  cep?:        string | null
  logradouro?: string | null
  bairro?:     string | null
  cidade?:     string | null
  uf?:         string | null      // máximo 2 caracteres
}
```

> Para **limpar** um campo de endereço, enviar `null` explicitamente (`"cep": null`).
> Para **não alterar** um campo, simplesmente não incluí-lo no body.

#### Response `200 OK`

```ts
interface UpdatePatientResponse {
  patient: Ipatient  // shape atualizado com os 5 novos campos
}
```

---

## Novo endpoint

### `GET /address/cep/:cep` — Lookup de CEP

🌐 **Público — sem autenticação necessária**

Consulta a [ViaCEP](https://viacep.com.br) e retorna os dados de endereço para auto-preenchimento do formulário.

**Fluxo recomendado no front:**
1. Usuário digita o CEP no campo do formulário
2. Ao sair do campo (onBlur) ou após 8 dígitos, chamar este endpoint
3. Preencher automaticamente os demais campos com o retorno
4. Permitir que o usuário edite manualmente após o auto-preenchimento

#### Path Parameter

| Param | Tipo | Descrição |
|-------|------|-----------|
| `cep` | `string` | CEP com ou sem máscara — backend aceita `"01001000"` e `"01001-000"` |

#### Response `200 OK`

```ts
interface AddressByCepResponse {
  cep:        string  // formato com máscara: "01001-000"
  logradouro: string  // ex: "Praça da Sé"
  bairro:     string  // ex: "Sé"
  cidade:     string  // ex: "São Paulo"
  uf:         string  // ex: "SP"
}
```

**Exemplo de chamada e resposta:**

```
GET /address/cep/01001000
```

```json
{
  "cep": "01001-000",
  "logradouro": "Praça da Sé",
  "bairro": "Sé",
  "cidade": "São Paulo",
  "uf": "SP"
}
```

> **Atenção**: o `cep` retornado tem **máscara** (`"01001-000"`). Ao salvar no paciente via `POST /patient` ou `PUT /patient/:id`, enviar **sem máscara** (`"01001000"`) — ou simplesmente enviar como retornado, o backend remove a máscara automaticamente.

#### Error Cases

| Status | Quando | O que mostrar no front |
|--------|--------|----------------------|
| `400 Bad Request` | CEP com formato inválido (letras, ≠ 8 dígitos) | "CEP inválido" |
| `404 Not Found` | CEP válido mas não existe na base dos Correios | "CEP não encontrado" |
| `503 Service Unavailable` | ViaCEP fora do ar | "Serviço de CEP indisponível. Preencha manualmente." |

---

## Checklist de atualização no front

- [ ] Atualizar interface/tipo `Ipatient` (ou equivalente) com os 5 novos campos `string | null`
- [ ] Formulário de **cadastro de paciente**: adicionar campos CEP, Logradouro, Bairro, Cidade, UF
- [ ] Formulário de **edição de paciente**: adicionar os mesmos campos com valores pré-preenchidos
- [ ] Implementar chamada a `GET /address/cep/:cep` ao sair do campo CEP (onBlur / após 8 dígitos)
- [ ] Tratar os 3 estados de erro do endpoint de CEP (400, 404, 503)
- [ ] Aplicar máscara visual `00000-000` no campo CEP (apenas display — enviar sem máscara)
- [ ] Validar `uf` com máximo 2 caracteres antes de enviar
- [ ] Garantir que campos de endereço `null` são exibidos como vazios (não como "null")

---

## Quick Reference

| Route | Method | Auth | Descrição |
|-------|--------|------|-----------|
| `GET /address/cep/:cep` | GET | 🌐 Público | Lookup de CEP via ViaCEP |
| `POST /patient` | POST | 🔒 JWT | Criar paciente (aceita endereço) |
| `PUT /patient/:id` | PUT | 🔒 JWT | Atualizar paciente (aceita endereço) |
| `GET /patients` | GET | 🔒 JWT | Listar pacientes (response inclui endereço) |
| `GET /patients/:id` | GET | 🔒 JWT | Buscar paciente por ID (response inclui endereço) |
