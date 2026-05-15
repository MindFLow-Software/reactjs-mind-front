# Tasks: API Envelope Adaptation

## Dependency Graph

```
T1 (types)
  └── T2 (axios interceptors)
        ├── T3 [P] (10 component files — padrão mecânico)
        └── T4 [P] (sign-up-form — caso especial)
              └── T5 (gate: tsc --noEmit)
```

T3 e T4 são paralelos — tocam arquivos disjuntos e dependem apenas de T2.

---

## T1 — Criar `src/types/api.ts`

| Campo | Valor |
|-------|-------|
| **Status** | `[ ] pending` |
| **Onde** | `src/types/api.ts` (arquivo novo) |
| **Depende de** | — |
| **Paralelo com** | — |

**O que fazer:** Criar arquivo com todos os tipos do contrato de envelope e module augmentation de `AxiosError`.

```typescript
export type ApiErrorCode =
  | 'RESOURCE_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'UNAUTHORIZED'
  | 'EMAIL_ALREADY_IN_USE'
  | 'PSYCHOLOGIST_NOT_FOUND'
  | 'PATIENT_NOT_FOUND'
  | 'APPOINTMENT_NOT_FOUND'
  | 'SLOT_ALREADY_BOOKED'
  | 'SLOT_NOT_AVAILABLE'
  | 'INVALID_APPOINTMENT_TIME'
  | 'APPOINTMENT_ALREADY_CANCELLED'
  | 'APPOINTMENT_ALREADY_CONFIRMED'
  | 'MISSING_GOOGLE_TOKENS'
  | 'INVALID_GOOGLE_TOKENS'
  | 'GOOGLE_CALENDAR_ERROR'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_ERROR'

export interface ApiSuccessEnvelope<T = unknown> {
  success: true
  statusCode: number
  data: T
  message?: string
}

export interface ApiErrorEnvelope {
  success: false
  statusCode: number
  error: {
    code: ApiErrorCode
    message: string
  }
}

// Torna err.apiCode disponível globalmente em AxiosError sem cast por call site
declare module 'axios' {
  interface AxiosError {
    apiCode?: ApiErrorCode
  }
}
```

**Pronto quando:**
- [ ] `src/types/api.ts` existe com o conteúdo acima
- [ ] `tsc --noEmit` sem erros neste arquivo

---

## T2 — Reescrever `src/lib/axios.ts`

| Campo | Valor |
|-------|-------|
| **Status** | `[ ] pending` |
| **Onde** | `src/lib/axios.ts` (reescrita completa) |
| **Depende de** | T1 |
| **Paralelo com** | — |

**O que fazer:** Substituir o interceptor de response atual por dois interceptors — success (desembrulha envelope) e error (normaliza `message` e `apiCode`, mantém redirect 401).

```typescript
import axios from 'axios'
import type { ApiSuccessEnvelope, ApiErrorEnvelope } from '@/types/api'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

const SKIP_REDIRECT_PATHS = [
  '/sign-in',
  '/auth/google/success',
  '/auth/google/complete',
  '/google-oauth-success',
  '/google-oauth-complete',
]

function isSuccessEnvelope(body: unknown): body is ApiSuccessEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as ApiSuccessEnvelope).success === true &&
    'data' in (body as object)
  )
}

function isErrorEnvelope(body: unknown): body is ApiErrorEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    (body as ApiErrorEnvelope).success === false &&
    typeof (body as ApiErrorEnvelope).error?.code === 'string'
  )
}

api.interceptors.response.use(
  (response) => {
    if (response.status === 204 || response.data == null) return response
    if (isSuccessEnvelope(response.data)) {
      response.data = response.data.data
    }
    return response
  },
  (error) => {
    if (!error.response) return Promise.reject(error)

    if (axios.isAxiosError(error) && isErrorEnvelope(error.response?.data)) {
      const envelope = error.response!.data as ApiErrorEnvelope
      error.message = envelope.error.message
      error.apiCode  = envelope.error.code
    }

    if (error.response.status === 401) {
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user')
      const currentPath = window.location.pathname
      const shouldRedirect = !SKIP_REDIRECT_PATHS.some((p) => currentPath.startsWith(p))
      if (shouldRedirect) window.location.href = '/sign-in'
    }

    return Promise.reject(error)
  },
)
```

**Edge cases cobertos:**
- 204 No Content → `response.data == null`, interceptor pula desembrulhamento
- Network error (sem `error.response`) → pass-through, fallback strings nos componentes
- Body não-envelope (nginx 502 HTML) → `isErrorEnvelope` retorna false, `error.message` permanece default do axios

**Pronto quando:**
- [ ] `src/lib/axios.ts` contém os dois interceptors
- [ ] Nenhum arquivo em `src/api/` foi modificado
- [ ] `tsc --noEmit` sem erros

---

## T3 [P] — Atualizar 10 arquivos de componente (padrão mecânico)

| Campo | Valor |
|-------|-------|
| **Status** | `[ ] pending` |
| **Depende de** | T2 |
| **Paralelo com** | T4 |

**O que fazer:** Substituir `err.response?.data?.message` por `err.message` em 10 arquivos.

**Mudança padrão:**
```typescript
// Antes
toast.error(err?.response?.data?.message || 'Ocorreu um erro')

// Depois
toast.error(err?.message || 'Ocorreu um erro')
```

| Arquivo | Linha | Trecho a alterar |
|---------|-------|-----------------|
| `src/pages/auth/components/sign-in-form.tsx` | 87 | `error?.response?.data?.message` |
| `src/pages/auth/components/patient-sign-up-form.tsx` | 61 | `error?.response?.data?.message` |
| `src/pages/auth/google-oauth-complete.tsx` | 96 | `error?.response?.data?.message` |
| `src/pages/auth/complete-registration.tsx` | 85 | `error?.response?.data?.message` |
| `src/pages/app/billing/test-billing.tsx` | 30 | `error?.response?.data?.message` |
| `src/pages/app/video-room/components/appointment-add-form.tsx` | 78 | `err.response?.data?.message` |
| `src/pages/app/account/components/edit-psychologist-dialog.tsx` | 42 | `err.response?.data?.message` |
| `src/pages/app/patients/patients-list/components/delete-patient-dialog.tsx` | 27 | `err?.response?.data?.message` |
| `src/pages/app/patients/patients-list/register-patients/register-patients.tsx` | 377 | `error.response?.data?.message` |
| `src/pages/app/appointment/appointment-list/components/register-appointment.tsx` | 91 | `error.response?.data?.message` |

**Pronto quando:**
- [ ] Nenhuma ocorrência de `response?.data?.message` nos 10 arquivos acima
- [ ] `tsc --noEmit` sem erros nos arquivos alterados

---

## T4 [P] — Corrigir branching por código de erro em `sign-up-form.tsx`

| Campo | Valor |
|-------|-------|
| **Status** | `[ ] pending` |
| **Onde** | `src/pages/auth/components/sign-up-form.tsx` linhas 207–226 |
| **Depende de** | T2 |
| **Paralelo com** | T3 |

**O que fazer:** Substituir comparação de string (`message === "EMAIL_ALREADY_EXISTS"`) por comparação de `apiCode` tipado. A lógica de detecção de duplicata de e-mail deve usar `err.apiCode === 'EMAIL_ALREADY_IN_USE'`.

**Antes (linhas 207–226):**
```typescript
} catch (err: any) {
  const status = err.response?.status
  const message = Array.isArray(err.response?.data?.message)
    ? err.response.data.message[0]
    : err.response?.data?.message

  if (status === 409) {
    if (message === "EMAIL_ALREADY_EXISTS") {
      setError("email", { type: "manual", message: "E-mail já cadastrado" })
      toast.error("E-mail já cadastrado")
      return
    }
    if (message === "CPF_ALREADY_EXISTS") {
      setError("cpf", { type: "manual", message: "CPF já cadastrado" })
      toast.error("CPF já cadastrado")
      return
    }
  }
  toast.error("Erro ao realizar cadastro")
}
```

**Depois:**
```typescript
} catch (err: unknown) {
  if (!axios.isAxiosError(err)) {
    toast.error("Erro ao realizar cadastro")
    return
  }

  if (err.apiCode === 'EMAIL_ALREADY_IN_USE') {
    setError("email", { type: "manual", message: "E-mail já cadastrado" })
    toast.error("E-mail já cadastrado")
    return
  }

  // CPF: ApiErrorCode não inclui código específico para CPF (OQ-1 aberto no spec.md).
  // O fallback exibe a mensagem humanizada do envelope.
  toast.error(err.message || "Erro ao realizar cadastro")
}
```

**Adicionar import (se ausente):**
```typescript
import axios from 'axios'
```

**Pronto quando:**
- [ ] Nenhuma comparação com `"EMAIL_ALREADY_EXISTS"` ou `"CPF_ALREADY_EXISTS"` no arquivo
- [ ] `err.apiCode` usado e inferido como `ApiErrorCode | undefined` pelo TypeScript
- [ ] `tsc --noEmit` sem erros neste arquivo

---

## T5 — Gate: TypeScript type check

| Campo | Valor |
|-------|-------|
| **Status** | `[ ] pending` |
| **Depende de** | T3, T4 |
| **Comando** | `npx tsc --noEmit` |

**Pronto quando:**
- [ ] Saída do comando vazia (zero erros)

---

## Verificação End-to-End (pós T5)

| # | Cenário | Resultado esperado |
|---|---------|-------------------|
| AC-1 | Login com senha errada | Toast mostra string do backend, não `undefined` |
| AC-2 | Login com credenciais corretas | Redireciona para dashboard |
| AC-3 | Cadastro com e-mail duplicado | Campo `email` marcado inválido + toast descritivo |
| AC-4 | Carregamento da lista de pacientes | Tabela popula com dados |
| AC-5 | Deleção de paciente (DELETE 204) | Dialog fecha, sem erro de runtime |
| AC-6 | Rede offline durante qualquer request | Toast mostra string de fallback, não `undefined` |

## Arquivos que NÃO mudam

Todos os 63 arquivos em `src/api/` — o success interceptor desembrulha o envelope transparentemente, sem que nenhum service file precise ser alterado.
