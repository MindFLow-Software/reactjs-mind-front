import { useApiMutation } from '@/hooks/use-api-mutation'
import { saveAnamnesis } from '@/api/patient-profiles/save-anamnesis'
import type { IAnamnesisContent } from '@/types/clinical/anamnesis-content'

type IUseSaveAnamnesisOptions = {
  patientId: string
  onSaved?: (data: IAnamnesisContent) => void
}

export function useSaveAnamnesis({
  patientId,
  onSaved,
}: IUseSaveAnamnesisOptions) {
  return useApiMutation<{ message: string | null }, IAnamnesisContent>({
    mutationFn: (data) => saveAnamnesis(patientId, data),
    showSuccessToast: false,
    invalidateKeys: [['patient-hub', patientId, 'anamnesis']],
    onSuccess: (_result, variables) => onSaved?.(variables),
  })
}
