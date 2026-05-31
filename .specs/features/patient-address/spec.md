# Spec: Patient Address

**Status:** Pendente implementação  
**Backend branch:** `feat/patient-address`  
**Contrato:** [contract.md](./contract.md)  
**Data:** 2026-05-30

---

## O que mudou no backend

| Mudança | Detalhe |
|---------|---------|
| `PatientHTTP` ganhou 5 novos campos | `cep`, `logradouro`, `bairro`, `cidade`, `uf` — todos `string \| null` |
| `POST /patient` aceita endereço | Campos opcionais no body |
| `PUT /patient/:id` aceita endereço | Campos opcionais/anuláveis no body |
| Novo `GET /address/cep/:cep` | Endpoint público — auto-fill via ViaCEP |

---

## Estado atual do frontend

Os campos de endereço (CEP, logradouro, bairro, cidade, UF) já existem visualmente em `StepContactAddress`, mas são **visual-only**:

- Gerenciados como `useState` separados em `register-patients.tsx`
- **Não** fazem parte do schema Zod (`validators/patients.ts`)
- **Não** são enviados para a API em criar/editar
- **Não** são pré-preenchidos no modo edição
- Nenhuma chamada a `GET /address/cep/:cep` existe

---

## Escopo de implementação

### T1 — Tipos (`src/types/patient.ts`)
- Adicionar 5 campos a `PatientHTTP`: `cep | null`, `logradouro | null`, `bairro | null`, `cidade | null`, `uf | null`
- Adicionar 5 campos opcionais a `CreatePatientBody`: `cep?`, `logradouro?`, `bairro?`, `cidade?`, `uf?`
- Adicionar 5 campos opcionais/anuláveis a `UpdatePatientBody`: mesmos, mas `string | null`
- Adicionar interface `AddressByCepResponse`

### T2 — API CEP (`src/api/address/get-address-by-cep.ts`)
- Criar função `getAddressByCep(cep: string)` chamando `GET /address/cep/:cep`
- Endpoint público — sem header de autenticação especial
- Importar tipo `AddressByCepResponse` de `src/types/patient.ts`

### T3 — Schema (`src/validators/patients.ts`)
- Adicionar os 5 campos de endereço ao `patientSchema` existente (não criar novo arquivo)
- Todos opcionais, `uf` com `.max(2)`

### T4 — Formulário (`register-patients.tsx`)
- Remover os 5 `useState` de endereço (`cep`, `street`, `district`, `city`, `uf`)
- Adicionar campos ao `defaultValues` do `useForm`, pré-preenchendo do `patient` no modo edição
- Adicionar `isCepLoading` state
- Criar `handleCepBlur`: strip máscara → 8 dígitos → chama `getAddressByCep` → `setValue` nos 4 campos; trata 400/404/503 com toasts
- Incluir campos de endereço no `basePayload` do `onSubmit` (sem máscara para CEP)
- Atualizar props passadas para `StepContactAddress`

### T5 — StepContactAddress (`steps/step-contact-address.tsx`)
- Remover 10 props de value/callback de endereço
- Vincular todos os campos via `register` ou `Controller`
- Adicionar `onBlur={onCepBlur}` no campo CEP
- Exibir estado de loading nos campos auto-preenchidos enquanto `isCepLoading`

---

## Convenções a seguir

| Item | Localização |
|------|-------------|
| Utilitários de formatação | `src/utils/` |
| Validação Zod | `src/validators/patients.ts` (arquivo existente) |
| API calls | `src/api/address/get-address-by-cep.ts` |
| Tipos | `src/types/patient.ts` (arquivo existente) |
| `formatCEP` | já existe em `src/utils/formatCEP.ts` — reutilizar |

---

## Critérios de aceitação

- [ ] `PatientHTTP` tem os 5 novos campos com `string | null`
- [ ] Criar paciente com endereço → campos persistidos no backend
- [ ] Editar paciente → Step 2 pré-preenchido com endereço existente
- [ ] Digitar CEP válido → onBlur auto-preenche logradouro, bairro, cidade, UF
- [ ] CEP inválido (< 8 dígitos ou formato errado) → toast "CEP inválido"
- [ ] CEP não encontrado → toast "CEP não encontrado"
- [ ] ViaCEP fora do ar → toast "Serviço de CEP indisponível. Preencha manualmente."
- [ ] Paciente sem endereço (legado) → campos exibidos vazios, sem "null"
- [ ] `npx tsc --noEmit` passa sem erros
