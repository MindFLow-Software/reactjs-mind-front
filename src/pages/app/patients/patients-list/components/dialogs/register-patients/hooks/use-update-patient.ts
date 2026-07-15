import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updatePatientProfileById } from '@/api/patient-profiles/update-patient-profile-by-id'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import type { UpdatePatientFormData } from '@/validators/patients/form/update-patient-schema'
import { usePatientAttachmentsUpload } from './use-patient-attachments-upload'

type IUseUpdatePatient = {
  patientId: string
  avatarFile: File | null
  files: File[]
  onSuccess?: () => void
}

export function useUpdatePatient({
  patientId,
  avatarFile,
  files,
  onSuccess,
}: IUseUpdatePatient) {
  const queryClient = useQueryClient()
  const { uploadAll, isUploading } = usePatientAttachmentsUpload()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updatePatientProfileById,
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['patients'] }),
        queryClient.invalidateQueries({ queryKey: ['patient', patientId] }),
        queryClient.invalidateQueries({ queryKey: ['attachments', patientId] }),
        queryClient.invalidateQueries({ queryKey: ['patients-metrics'] }),
      ])

      toast.success(response.message ?? 'Paciente atualizado!')
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, 'Erro ao salvar. Verifique os dados.'),
      )
    },
  })

  const submit = useCallback(
    async (data: UpdatePatientFormData) => {
      await mutateAsync({
        ...data,
        dateOfBirth: data.dateOfBirth ?? undefined,
        id: patientId,
      })

      await uploadAll({ targetId: patientId, avatarFile, files })
      onSuccess?.()
    },
    [mutateAsync, uploadAll, patientId, avatarFile, files, onSuccess],
  )

  return { submit, isSubmitting: isPending || isUploading }
}
