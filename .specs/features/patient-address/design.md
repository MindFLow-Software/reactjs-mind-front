# Design — Patient Address

## Problema

O backend adicionou suporte a endereço estruturado no domínio de paciente (`cep`, `logradouro`, `bairro`, `cidade`, `uf`) e um endpoint público de auto-preenchimento via ViaCEP (`GET /address/cep/:cep`). O frontend tem a UI do endereço renderizada no Step 2 do formulário, mas os campos são completamente desconectados da camada de dados:

- Cinco `useState` isolados em `register-patients.tsx` nunca entram no schema Zod
- Nenhum campo de endereço é enviado ao criar ou editar um paciente
- No modo edição, os campos ficam sempre vazios — dados existentes são ignorados
- O botão "preenche automático" no label do CEP é decorativo — nenhuma chamada acontece

---

## Solução

Três mudanças coordenadas sem alterar a arquitetura existente:

1. **Mover endereço para dentro do form** — os 5 `useState` viram campos do `patientSchema` e do `useForm`, eliminando a bifurcação entre estado local e estado validado
2. **Conectar à API** — incluir endereço no payload de criar/editar e pre-fill no modo edição a partir dos dados do `PatientHTTP`
3. **Implementar CEP lookup** — `onBlur` no campo CEP dispara `GET /address/cep/:cep` e popula os demais campos via `setValue`

---

## Arquitetura de Componentes

```
register-patients.tsx
├── useForm<PatientFormData>
│   └── defaultValues agora inclui: cep, logradouro, bairro, cidade, uf
│       └── edit mode: pre-fill de patient.cep (formatCEP), patient.logradouro, etc.
│
├── handleCepBlur() — novo handler assíncrono
│   ├── strip máscara → se < 8 dígitos: retorna sem chamar API
│   ├── setIsCepLoading(true)
│   ├── getAddressByCep(cep) → setValue("logradouro"), setValue("bairro"), ...
│   └── catch: toast por status (400 / 404 / 503+)
│
└── StepContactAddress (step === 2)
    ├── register, control, errors  ← já existia
    ├── onCepBlur                  ← novo
    └── isCepLoading               ← novo

StepContactAddress
├── CEP: Controller → formatCEP no onChange + onBlur={onCepBlur}
├── Logradouro: register("logradouro") + disabled={isCepLoading}
├── Bairro:     register("bairro")     + disabled={isCepLoading}
├── Cidade:     register("cidade")     + disabled={isCepLoading}
└── UF:         Controller → <select> vinculado ao form (field.value / field.onChange)
```

---

## Decisões de Design

### CEP permanece como Controller, não register

O CEP precisa de formatação progressiva no `onChange` (`formatCEP` de `src/utils/formatCEP.ts`) e de um `onBlur` customizado para o lookup. `register` não suporta transformação inline de valor — `Controller` é o caminho correto, assim como o campo `phoneNumber` já faz.

### onBlur, não onChange para o lookup

O contrato recomenda `onBlur` ou "após 8 dígitos". `onChange` dispara chamadas a cada keystroke (ex: usuário apaga e redigita um dígito). `onBlur` garante que o usuário terminou a entrada antes de chamar a API, reduzindo requisições desnecessárias e evitando conflitos com edição manual.

### Campos auto-preenchidos ficam editáveis

Após o lookup, logradouro/bairro/cidade/UF são populados mas permanecem editáveis. O `disabled={isCepLoading}` existe apenas durante a requisição em andamento. Isso está alinhado ao contrato e ao padrão UX de auto-fill no Brasil (ViaCEP frequentemente retorna logradouro sem número).

### UF como `<select>` vinculado ao form

O `<select>` de UF já existe com `UF_LIST` de `src/utils/mappers.ts`. Em vez de recriar com `Controller`, simplesmente vincular `field.value` e `field.onChange` do Controller ao `value`/`onChange` do select existente. Sem introduzir novo componente.

### Endereço no payload: `undefined` para omitir, não string vazia

O backend trata `""` como `null`. Mas o padrão do projeto em `onSubmit` já usa `|| undefined` para campos opcionais. Seguir o mesmo padrão: `data.logradouro || undefined`. Para o CEP, strip a máscara antes de enviar (`replace(/\D/g, "")`).

### Sem hook customizado para o lookup

O lookup de CEP é usado em exatamente um lugar (`register-patients.tsx`). Extrair para `use-cep-lookup.ts` seria prematura. O handler `handleCepBlur` inline é suficiente — o padrão já estabelecido no projeto (ex: `handleBirthChange`, `handleCepChange`) confirma essa escolha.

---

## Mapa de Arquivos

### Criados

| Arquivo | Conteúdo |
|---------|----------|
| `src/api/address/get-address-by-cep.ts` | `getAddressByCep(cep)` → `GET /address/cep/:cep` |

### Modificados

| Arquivo | O que muda |
|---------|-----------|
| `src/types/patient.ts` | `PatientHTTP` +5 campos; `CreatePatientBody` +5 opcionais; `UpdatePatientBody` +5 anuláveis; `AddressByCepResponse` nova interface |
| `src/validators/patients.ts` | `patientSchema` +5 campos de endereço (`cep`, `logradouro`, `bairro`, `cidade`, `uf`) |
| `register-patients.tsx` | Remove 5 `useState`; adiciona ao `useForm`; `handleCepBlur`; `isCepLoading`; payload do submit |
| `steps/step-contact-address.tsx` | Remove 10 props de value/callback; vincula ao form via `register`/`Controller`; `onBlur` no CEP; `disabled` no loading |

### Não modificados

| Arquivo | Motivo |
|---------|--------|
| `src/utils/formatCEP.ts` | Já formata `XXXXX-XXX` — reutilizado sem alteração |
| `src/utils/mappers.ts` | `UF_LIST` já existe — reutilizado sem alteração |
| `src/api/patients/create-patient.ts` | O tipo `CreatePatientsInput` extende `CreatePatientBody` — campos novos passam automaticamente |
| `src/api/patients/update-patient.ts` | Mesmo padrão — campos novos passam via spread do payload |

---

## Interface dos Componentes

### StepContactAddress — props antes vs. depois

```ts
// ANTES (10 props extras de endereço)
interface StepContactAddressProps {
  register:         UseFormRegister<PatientFormData>
  control:          Control<PatientFormData>
  errors:           FieldErrors<PatientFormData>
  cep:              string
  onCepChange:      (e: ChangeEvent<HTMLInputElement>) => void
  street:           string
  onStreetChange:   (v: string) => void
  district:         string
  onDistrictChange: (v: string) => void
  city:             string
  onCityChange:     (v: string) => void
  uf:               string
  onUfChange:       (v: string) => void
}

// DEPOIS (apenas form primitives + 2 props de CEP lookup)
interface StepContactAddressProps {
  register:     UseFormRegister<PatientFormData>
  control:      Control<PatientFormData>
  errors:       FieldErrors<PatientFormData>
  onCepBlur:    () => void
  isCepLoading: boolean
}
```

### getAddressByCep

```ts
// src/api/address/get-address-by-cep.ts
import { api } from "@/lib/axios"
import type { AddressByCepResponse } from "@/types/patient"

export async function getAddressByCep(cep: string): Promise<AddressByCepResponse> {
  const { data } = await api.get<AddressByCepResponse>(`/address/cep/${cep}`)
  return data
}
```

### handleCepBlur — lógica do lookup

```ts
async function handleCepBlur() {
  const digits = (getValues("cep") ?? "").replace(/\D/g, "")
  if (digits.length < 8) return
  try {
    setIsCepLoading(true)
    const address = await getAddressByCep(digits)
    setValue("logradouro", address.logradouro)
    setValue("bairro",     address.bairro)
    setValue("cidade",     address.cidade)
    setValue("uf",         address.uf)
  } catch (error) {
    const status = error instanceof AxiosError ? error.response?.status : null
    if (status === 400) toast.error("CEP inválido")
    else if (status === 404) toast.error("CEP não encontrado")
    else toast.error("Serviço de CEP indisponível. Preencha manualmente.")
  } finally {
    setIsCepLoading(false)
  }
}
```

---

## Estados Visuais do CEP

| Estado | CEP | Campos endereço | Indicador |
|--------|-----|-----------------|-----------|
| Vazio / digitando | `""` ou `< 8 dígitos` | Editáveis | — |
| Carregando | 8 dígitos, blur | `disabled` | Spinner ou opacidade reduzida |
| Sucesso | formatado | Preenchidos + editáveis | — |
| 400 Bad Request | inválido | Mantêm valor anterior | Toast: "CEP inválido" |
| 404 Not Found | válido mas inexistente | Mantêm valor anterior | Toast: "CEP não encontrado" |
| 503 / erro rede | qualquer | Mantêm valor anterior | Toast: "Serviço de CEP indisponível. Preencha manualmente." |

---

## Comportamento no Modo Edição

```ts
// defaultValues — edit mode
cep:        patient?.cep        ? formatCEP(patient.cep) : "",
logradouro: patient?.logradouro ?? "",
bairro:     patient?.bairro     ?? "",
cidade:     patient?.cidade     ?? "",
uf:         patient?.uf         ?? "",
```

- Pacientes legados (sem endereço): todos os campos `null` → campos exibidos vazios
- Paciente com endereço: campos pré-preenchidos ao abrir o modal
- CEP exibido com máscara (`formatCEP`) — salvo sem máscara no submit
