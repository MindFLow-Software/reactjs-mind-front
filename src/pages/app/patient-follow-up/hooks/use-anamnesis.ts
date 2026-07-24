import { useQuery } from '@tanstack/react-query'

import { getAnamnesis } from '@/api/patient-profiles/get-anamnesis'
import type { IAnamnesisContent } from '@/types/clinical/anamnesis-content'

type IuseAnamnesisReturn = {
  anamnesis: IAnamnesisContent | undefined
}

export function useAnamnesis(patientId: string): IuseAnamnesisReturn {
  const { data: anamnesis } = useQuery({
    queryKey: ['patient-follow-up', patientId, 'anamnesis'],
    queryFn: () => getAnamnesis(patientId),
  })

  return { anamnesis }
}
