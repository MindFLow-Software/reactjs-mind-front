# Feature: Patient Toggle Status

## Context

Psicólogos precisam arquivar e reativar pacientes (soft toggle, sem perda de dados). O backend já expõe `PATCH /patients/:id/status` com `{ isActive: boolean }` (204 sem body). A função de API `togglePatientStatus` existe e está correta. O botão de status na tabela já funciona via toggle direto. Seis gaps bloqueiam o fluxo completo.

---

## Requirements

| ID | Requirement | Prioridade |
|----|-------------|-----------|
| REQ-01 | Filtro de status (Ativos / Arquivados / Todos) deve ser passado para a query da API — hoje os pills existem mas o `status` não vai no `getPatients` nem no `queryKey` | Alta |
| REQ-02 | Ação "Arquivar" no dropdown deve chamar `PATCH /patients/:id/status` com `{ isActive: false }`, não `DELETE /patients/:id` | Alta |
| REQ-03 | Dropdown deve exibir "Reativar paciente" para pacientes inativos (chama toggle direto, sem dialog) e "Arquivar paciente" para ativos (abre dialog de confirmação) — mutuamente exclusivos | Alta |
| REQ-04 | Toast de sucesso/erro em toda mudança de status via badge click (`handleToggleStatus`) — dropdown via dialog já tem toast interno | Média |
| REQ-05 | `PatientHTTP` deve refletir o contrato real do backend: `isActive: boolean` e `status: 'active' \| 'inactive'` como campos required. `get-patients.ts` normaliza os dois campos para garantir consistência independente da versão da API | Alta |
| REQ-06 | Toggle de status deve usar optimistic update (React Query `onMutate`) para UI instantânea — rollback automático em caso de erro | Média |

---

## Out of Scope

- Dialog de confirmação para reativação (ação de baixo risco, chamada direta é suficiente)
- Toggle em massa (seleção múltipla)
- React Hook Form — não há formulário nesse fluxo

---

## Comportamento Esperado

```
Badge click (qualquer status)
  → onMutate: atualiza cache imediatamente (optimistic)
  → togglePatientStatus(id, !patientIsActive)
  → onSuccess: invalida ['patients-count'], toast.success
  → onSettled: invalida ['patients'] (sync com servidor)
  → onError: rollback do cache, toast.error

Dropdown — paciente ativo
  → "Arquivar paciente" → DeletePatientDialog
      → confirma → togglePatientStatus(id, false)
      → toast interno do dialog
      → invalida ['patients'], ['patients-count'], ['patient-details']

Dropdown — paciente inativo
  → "Reativar paciente" → handleToggleStatus() direto (mesmo fluxo que badge click)

Filtro de status
  → pill "Ativos"     → ?status=active    → API recebe status=active
  → pill "Arquivados" → ?status=inactive  → API recebe status=inactive
  → pill "Todos"      → sem param         → API retorna todos
```

---

## Contrato de Tipo (PatientHTTP após REQ-05)

```ts
export interface PatientHTTP {
  id:              string
  firstName:       string
  lastName:        string
  name:            string
  email:           string | null
  cpf:             string | null
  phoneNumber:     string | null
  gender:          Gender
  dateOfBirth:     string | null
  profileImageUrl: string | null
  createdAt:       string
  lastSessionAt:   string | null
  isActive:        boolean                  // required
  status:          'active' | 'inactive'   // required
}
```

---

## Referência API

| Método | Endpoint | Body | Response |
|--------|----------|------|----------|
| `PATCH` | `/patients/:id/status` | `{ isActive: boolean }` | `204` |
| `GET` | `/patients?status=active\|inactive` | — | lista filtrada |

Erros relevantes: `404` (paciente não encontrado) — tratar com toast de erro genérico.
