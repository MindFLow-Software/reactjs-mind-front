import { useApiMutation } from '@/hooks/use-api-mutation'
import { saveAnamnesis } from '@/api/patient-profiles/save-anamnesis'
import type { IAnamnesis } from '@/types/clinical/anamnesis'
import type { ISaveAnamnesisBody } from '@/types/clinical/save-anamnesis-body'

type ISaveAnamnesisResult = { anamnesis: IAnamnesis; message: string | null }

type IUseSaveAnamnesisOptions = {
  patientProfileId: string
  onSaved?: (anamnesis: IAnamnesis) => void
}

export function useSaveAnamnesis({
  patientProfileId,
  onSaved,
}: IUseSaveAnamnesisOptions) {
  return useApiMutation<ISaveAnamnesisResult, ISaveAnamnesisBody>({
    mutationFn: (data) => saveAnamnesis(patientProfileId, data),
    showSuccessToast: false,
    invalidateKeys: [['patient-follow-up', patientProfileId, 'anamnesis']],
    onSuccess: (result) => onSaved?.(result.anamnesis),
  })
}
