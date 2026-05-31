# Tasks — Patient Address

Rastreabilidade: [spec.md](spec.md) · [design.md](design.md) · [contract.md](contract.md)

---

## T-01 — Atualizar tipos em `src/types/patient.ts` ⭐ P1

**Escopo:** Adicionar os 5 novos campos de endereço ao `PatientHTTP` e aos bodies de criar/editar. Adicionar `AddressByCepResponse`.

- [ ] Adicionar ao final de `PatientHTTP`: `cep`, `logradouro`, `bairro`, `cidade`, `uf` — todos `string | null`
- [ ] Adicionar a `CreatePatientBody`: `cep?`, `logradouro?`, `bairro?`, `cidade?`, `uf?` — todos `string`
- [ ] Adicionar a `UpdatePatientBody`: `cep?`, `logradouro?`, `bairro?`, `cidade?`, `uf?` — todos `string | null`
- [ ] Criar interface `AddressByCepResponse` com os 5 campos como `string` (não nulos — o backend sempre retorna preenchido)
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** PA-01

**Commit:**
```
feat(patients): add address fields to PatientHTTP and request bodies
```

---

## T-02 — Criar `src/api/address/get-address-by-cep.ts` ⭐ P1

**Escopo:** Novo arquivo de API para o endpoint público de lookup de CEP.

- [ ] Criar pasta `src/api/address/` se não existir
- [ ] Implementar `getAddressByCep(cep: string): Promise<AddressByCepResponse>` chamando `GET /address/cep/:cep` via instância `api`
- [ ] Importar `AddressByCepResponse` de `@/types/patient`
- [ ] **Não** adicionar header de autenticação — endpoint é público
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** PA-04

**Commit:**
```
feat(api): add getAddressByCep for ViaCEP lookup endpoint
```

---

## T-03 — Adicionar endereço ao schema Zod em `src/validators/patients.ts` ⭐ P1

**Escopo:** Estender o `patientSchema` existente com os 5 campos de endereço. Não criar novo arquivo de validator.

- [ ] Adicionar ao `patientSchema`:
  ```ts
  cep:        z.string().optional().or(z.literal("")),
  logradouro: z.string().optional().or(z.literal("")),
  bairro:     z.string().optional().or(z.literal("")),
  cidade:     z.string().optional().or(z.literal("")),
  uf:         z.string().max(2).optional().or(z.literal("")),
  ```
- [ ] `PatientFormData` é inferido automaticamente — nenhuma alteração manual necessária
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** PA-03

**Commit:**
```
feat(validators): add address fields to patientSchema
```

---

## T-04 — Refatorar `register-patients.tsx` ⭐ P1

**Escopo:** Mover endereço de `useState` isolado para `useForm`; implementar CEP lookup com tratamento de erros; incluir endereço no payload de submit.

**Depende de:** T-01, T-02, T-03

- [ ] Remover os 5 `useState` de endereço: `cep`, `street`, `district`, `city`, `uf`
- [ ] Remover `handleCepChange` (substituído pelo lookup)
- [ ] Adicionar ao `defaultValues` do `useForm`:
  ```ts
  cep:        patient?.cep        ? formatCEP(patient.cep) : "",
  logradouro: patient?.logradouro ?? "",
  bairro:     patient?.bairro     ?? "",
  cidade:     patient?.cidade     ?? "",
  uf:         patient?.uf         ?? "",
  ```
- [ ] Adicionar `isCepLoading` state (`useState<boolean>(false)`)
- [ ] Adicionar import de `getValues` e `setValue` do `useForm` (já usa `watch` — expandir desestruturação)
- [ ] Implementar `handleCepBlur()`:
  - Strip máscara → se `digits.length < 8`, retornar sem chamar API
  - `setIsCepLoading(true)`
  - `await getAddressByCep(digits)` → `setValue` em `logradouro`, `bairro`, `cidade`, `uf`
  - `catch`: toast por status HTTP (400 → "CEP inválido", 404 → "CEP não encontrado", demais → "Serviço de CEP indisponível. Preencha manualmente.")
  - `finally`: `setIsCepLoading(false)`
- [ ] Atualizar `basePayload` no `onSubmit`:
  ```ts
  cep:        data.cep?.replace(/\D/g, "") || undefined,
  logradouro: data.logradouro || undefined,
  bairro:     data.bairro     || undefined,
  cidade:     data.cidade     || undefined,
  uf:         data.uf         || undefined,
  ```
- [ ] Atualizar as props passadas para `<StepContactAddress>`: remover as 10 props de value/callback; adicionar `onCepBlur={handleCepBlur}` e `isCepLoading={isCepLoading}`
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** PA-02, PA-04, PA-05, PA-06

**Commit:**
```
feat(register-patients): wire address fields into form and add CEP auto-fill
```

---

## T-05 — Atualizar `steps/step-contact-address.tsx` ⭐ P1

**Escopo:** Remover props manuais de endereço; vincular todos os campos ao React Hook Form; adicionar `onBlur` no CEP e estado de loading nos campos auto-preenchidos.

**Depende de:** T-03, T-04

- [ ] Remover 10 props da interface (`cep`, `onCepChange`, `street`, `onStreetChange`, `district`, `onDistrictChange`, `city`, `onCityChange`, `uf`, `onUfChange`)
- [ ] Adicionar 2 novas props: `onCepBlur: () => void` e `isCepLoading: boolean`
- [ ] Campo CEP: vincular via `Controller` com `formatCEP` no `onChange` e `onCepBlur` no `onBlur`; `maxLength={9}`, `inputMode="numeric"`, `autoComplete="off"`
- [ ] Campos Logradouro, Bairro, Cidade: vincular via `register("logradouro")` etc.; adicionar `disabled={isCepLoading}` e classe de opacidade quando loading
- [ ] Campo UF: vincular `<select>` existente via `Controller` (`field.value` / `field.onChange`)
- [ ] Verificar: `npx tsc --noEmit` → zero erros

**Req cobertos:** PA-02, PA-04

**Commit:**
```
refactor(step-contact-address): bind address fields to RHF and add CEP blur handler
```

---

## Gate — Verificação Final

**Critério de saída:** todos os itens abaixo passam antes de abrir PR.

- [ ] `npx tsc --noEmit` → 0 erros
- [ ] **Criar** — preencher Step 2 com CEP válido → tab fora do campo → logradouro/bairro/cidade/UF preenchidos automaticamente → submit → reabrir paciente → endereço persistido
- [ ] **Editar** — abrir paciente com endereço → Step 2 exibe campos pré-preenchidos → alterar um campo → salvar → campo atualizado
- [ ] **Legado** — abrir paciente sem endereço (criado antes da feature) → Step 2 exibe todos os campos de endereço vazios, sem texto "null"
- [ ] **CEP inválido** — digitar `00000000` → blur → toast "CEP não encontrado"
- [ ] **CEP incompleto** — digitar 5 dígitos e sair → nenhuma chamada à API, sem toast
- [ ] Steps 1, 3, 4 — navegação e validação sem regressões

---

## Rastreabilidade

| Req | Descrição | Task | Status |
|-----|-----------|------|--------|
| PA-01 | `PatientHTTP` com 5 novos campos `string \| null` | T-01 | ⬜ pendente |
| PA-02 | Formulário de criação/edição envia endereço | T-04, T-05 | ⬜ pendente |
| PA-03 | Schema Zod inclui campos de endereço | T-03 | ⬜ pendente |
| PA-04 | CEP lookup auto-preenche logradouro/bairro/cidade/UF | T-02, T-04, T-05 | ⬜ pendente |
| PA-05 | Erros de CEP tratados com toast (400, 404, 503) | T-04 | ⬜ pendente |
| PA-06 | Modo edição pré-preenche endereço existente | T-04 | ⬜ pendente |

## Ordem de Execução

```
T-01 (tipos — base para todos)
  └─ T-02 (API CEP — independente, mas usa AddressByCepResponse do T-01)
  └─ T-03 (schema — usa PatientFormData do T-01)
       └─ T-04 (formulário — depende de T-01, T-02, T-03)
            └─ T-05 (step component — depende de T-03, T-04)
```

Sequência recomendada: **T-01 → T-02 → T-03 → T-04 → T-05 → Gate**
