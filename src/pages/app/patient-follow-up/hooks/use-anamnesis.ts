import { useQuery } from '@tanstack/react-query'

import { getAnamnesis } from '@/api/patient-profiles/get-anamnesis'
import type { IAnamnesis } from '@/types/clinical/anamnesis'

type IUseAnamnesisReturn = {
  anamnesis: IAnamnesis | null | undefined
}

export function useAnamnesis(patientProfileId: string): IUseAnamnesisReturn {
  const { data: anamnesis } = useQuery({
    queryKey: ['patient-follow-up', patientProfileId, 'anamnesis'],
    queryFn: () => getAnamnesis(patientProfileId),
  })

  return { anamnesis }
}
