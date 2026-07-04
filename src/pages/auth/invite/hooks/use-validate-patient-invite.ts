import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/constants/query-keys'
import { validatePatientInvite } from '@/api/patient-profiles/validate-patient-invite'

export function useValidatePatientInvite(token: string | undefined) {
  return useQuery({
    queryKey: queryKeys.patientInvite(token),
    queryFn: () => validatePatientInvite(token),
    enabled: Boolean(token),
    retry: 2,
  })
}
