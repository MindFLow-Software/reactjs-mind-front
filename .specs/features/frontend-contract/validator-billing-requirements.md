# Billing — Frontend Validator Requirements

> Source of truth: backend validators + controllers.
> Verificado contra o código-fonte em 2026-05-31.

---

## 1. POST `/billing` — Criar cobrança

**Schema:** `src/validators/billing/controllers/create-billing-schema.ts`

### Request body

| Campo | Tipo | Obrigatório | Regras |
|-------|------|-------------|--------|
| `patientEmail` | `string` | ✅ | email válido |
| `patientTaxId` | `string` | ✅ | `min(11)` / `max(18)` — aceita CPF (11 dígitos) ou CNPJ (14 dígitos numéricos ou 18 com formatação `XX.XXX.XXX/XXXX-XX`) |
| `patientName` | `string` | ✅ | `min(1)` |
| `amountInCents` | `number` | ✅ | inteiro, mínimo `100` (equivale a R$ 1,00) |
| `consultationDetails` | `string` | ✅ | `min(1)` — descrição da consulta |
| `frequency` | `string` | ✅ | `'ONE_TIME'` \| `'MULTIPLE_PAYMENTS'` |
| `methods` | `string[]` | ✅ | array com valores `'PIX'` e/ou `'CARD'` |
| `returnUrl` | `string` | ✅ | URL válida — redirecionamento após cancelamento/abandono |
| `completionUrl` | `string` | ✅ | URL válida — redirecionamento após pagamento concluído |

> ⚠️ `amountInCents` deve ser enviado como **centavos inteiros**. R$ 150,00 → `15000`.
> O backend rejeita valores menores que `100` (menos de R$ 1,00).

> ⚠️ `methods` é um array — o frontend deve enviar ao menos um valor.
> O backend não valida `min(1)` no array, mas um array vazio resultará em erro de
> processamento no gateway de pagamento.

> ⚠️ `patientTaxId` aceita tanto CPF quanto CNPJ. O backend não valida o dígito
> verificador — apenas comprimento (11–18 chars). A validação de formato fica a
> cargo do frontend.

> ⚠️ O JWT é **opcional** no controller (`user?: UserPayload`). Se não autenticado,
> o backend usa `'TESTE'` como `psychologistId`. Isso é um artifact de desenvolvimento —
> em produção, sempre enviar o token.

### Response `201`

```json
{
  "message": "Cobrança criada com sucesso!",
  "billingUrl": "string",
  "billingId": "string",
  "amount": number
}
```

| Campo | Descrição |
|-------|-----------|
| `billingUrl` | URL do checkout do gateway — redirecionar o paciente para cá |
| `billingId` | ID da cobrança no gateway |
| `amount` | Valor confirmado (provavelmente em centavos — verificar com o gateway) |

**Backend proof:** `src/infra/http/controllers/billing/create-billing.controller.ts`

---

## 2. Webhook — não implementado

O `WebhookController` existe mas está **vazio** — sem rota, sem body, sem lógica.

```ts
export class WebhookController {
  constructor() {}
  async handle() {}
}
```

Não há endpoint de webhook ativo no backend. O frontend não deve depender de eventos
de webhook por enquanto.

**Backend proof:** `src/infra/http/controllers/billing/webhook.controller.ts`

---

## Resumo

| # | Campo / Situação | Observação |
|---|-----------------|------------|
| 1 | `amountInCents` | Centavos inteiros, mín. 100 |
| 2 | `methods` | Array de `'PIX'` e/ou `'CARD'` — enviar ao menos um |
| 3 | `patientTaxId` | CPF ou CNPJ, 11–18 chars — backend não valida dígito verificador |
| 4 | JWT opcional | Artifact de dev — sempre autenticar em produção |
| 5 | Webhook | Não implementado — ignorar |
