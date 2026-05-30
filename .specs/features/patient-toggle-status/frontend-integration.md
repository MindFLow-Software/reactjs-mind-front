# Frontend Integration — Patient Toggle Status

> Como usar a API de ativar/desativar pacientes e aplicar nos componentes.

---

## 1. Atualizar o tipo `Patient`

Adicionar `isActive` ao tipo que representa um paciente no front.

```ts
// types/patient.ts (ou onde o tipo já existe)
interface Patient {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string | null
  cpf: string | null
  phoneNumber: string | null
  gender: 'OTHER' | 'FEMININE' | 'MASCULINE'
  isActive: boolean   // ← novo campo
  dateOfBirth: string | null
  profileImageUrl: string | null
  createdAt: string
  lastSessionAt: string | null
}
```

---

## 2. Função de API

```ts
// services/patients.ts (ou api/patients.ts)

// Ativar ou desativar um paciente
export async function togglePatientStatus(patientId: string, isActive: boolean): Promise<void> {
  await api.patch(`/patients/${patientId}/status`, { isActive })
  // Retorna 204 — sem body
}
```

> **Importante:** `isActive` deve ser `boolean` (`true`/`false`), nunca string `"true"`.

---

## 3. Hook (React Query / TanStack Query)

```ts
// hooks/useTogglePatientStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { togglePatientStatus } from '@/services/patients'

export function useTogglePatientStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ patientId, isActive }: { patientId: string; isActive: boolean }) =>
      togglePatientStatus(patientId, isActive),

    onSuccess: () => {
      // Invalida a listagem para refletir o novo status
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })
}
```

---

## 4. Botão "Arquivar / Reativar" no componente

```tsx
// components/PatientCard.tsx (ou onde o card do paciente é renderizado)
import { useTogglePatientStatus } from '@/hooks/useTogglePatientStatus'

interface Props {
  patient: Patient
}

export function PatientCard({ patient }: Props) {
  const { mutate: toggleStatus, isPending } = useTogglePatientStatus()

  function handleToggle() {
    toggleStatus({ patientId: patient.id, isActive: !patient.isActive })
  }

  return (
    <div>
      <span>{patient.name}</span>

      {/* Badge de status */}
      <span className={patient.isActive ? 'badge-active' : 'badge-inactive'}>
        {patient.isActive ? 'Ativo' : 'Arquivado'}
      </span>

      {/* Botão de toggle */}
      <button onClick={handleToggle} disabled={isPending}>
        {patient.isActive ? 'Arquivar' : 'Reativar'}
      </button>
    </div>
  )
}
```

---

## 5. Filtro de listagem por status

O endpoint `GET /patients` já aceita `?status=active|inactive|all`.

```ts
// Na query de listagem de pacientes
const { data } = useQuery({
  queryKey: ['patients', { status }],
  queryFn: () => fetchPatients({ status }), // 'active' | 'inactive' | 'all'
})
```

```tsx
// Componente de filtro
type StatusFilter = 'all' | 'active' | 'inactive'

const [statusFilter, setStatusFilter] = useState<StatusFilter>('active')

<select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
  <option value="all">Todos</option>
  <option value="active">Ativos</option>
  <option value="inactive">Arquivados</option>
</select>
```

---

## 6. Feedback de erro

O backend retorna:

| Status | Quando | O que mostrar |
|---|---|---|
| `204` | Sucesso | Toast "Paciente arquivado" / "Paciente reativado" |
| `400` | Body inválido | Nunca deve acontecer se o código estiver correto |
| `404` | Paciente não encontrado | Toast "Paciente não encontrado" |

```ts
// No onError do useMutation
onError: (error) => {
  if (error.response?.status === 404) {
    toast.error('Paciente não encontrado.')
  } else {
    toast.error('Erro ao atualizar status do paciente.')
  }
}
```

---

## Resumo rápido

| O que fazer | Como |
|---|---|
| Adicionar campo ao tipo | `isActive: boolean` em `Patient` |
| Chamar a API | `PATCH /patients/:id/status` com `{ isActive: boolean }` |
| Invalidar cache | `queryClient.invalidateQueries(['patients'])` após sucesso |
| Filtrar por status | `GET /patients?status=active` ou `?status=inactive` |
| Mostrar estado visual | `patient.isActive` já vem na listagem |
