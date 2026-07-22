import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/constants/query-keys'
import { validatePatientInvite } from '@/api/patient-profiles/validate-patient-invite'
import type { IPatientInviteMetadata } from '@/types/invite/patient-invite-metadata'

type IUseValidatePatientInvite = {
  isLoadingInvite: boolean
  patientInvite: IPatientInviteMetadata | undefined
}

export function useValidatePatientInvite(
  token: string | undefined,
): IUseValidatePatientInvite {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.patientInvite(token),
    queryFn: () => validatePatientInvite(token),
    enabled: Boolean(token),
    retry: 2,
  })

  return { patientInvite: data, isLoadingInvite: isPending }
}
