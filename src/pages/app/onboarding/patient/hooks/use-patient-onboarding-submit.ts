import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApiMutation } from '@/hooks/use-api-mutation'
import { queryKeys } from '@/constants/query-keys'
import { claimPatientProfileByAccessCode } from '@/api/patient-profiles/claim-patient-profile-by-access-code'
import { createOwnPatientProfile } from '@/api/patient-profiles/create-own-patient-profile'
import type { CreatePatientProfileByAccessCodeData } from '@/validators/patient-profile/form/create-patient-profile-by-access-code-schema'

type UsePatientOnboardingSubmitReturn = {
  submit: (data: CreatePatientProfileByAccessCodeData) => Promise<void>
  isSubmitting: boolean
}

export function usePatientOnboardingSubmit(): UsePatientOnboardingSubmitReturn {
  const navigate = useNavigate()

  const claimMutation = useApiMutation({
    mutationFn: claimPatientProfileByAccessCode,
    successFallback: 'Perfil vinculado com sucesso.',
    errorFallback: 'Não foi possível vincular o perfil com este código.',
    invalidateKeys: [queryKeys.me],
  })

  const createOwnMutation = useApiMutation({
    mutationFn: createOwnPatientProfile,
    successFallback: 'Perfil de paciente criado.',
    errorFallback: 'Não foi possível criar o perfil de paciente.',
    invalidateKeys: [queryKeys.me],
  })

  const submit = useCallback(
    async (data: CreatePatientProfileByAccessCodeData) => {
      if (data.accessCode) {
        await claimMutation.mutateAsync({ code: data.accessCode })
      } else {
        await createOwnMutation.mutateAsync({
          psychologistPracticeContextId: null,
        })
      }
      navigate('/profiles')
    },
    [claimMutation, createOwnMutation, navigate],
  )

  return {
    submit,
    isSubmitting: claimMutation.isPending || createOwnMutation.isPending,
  }
}
