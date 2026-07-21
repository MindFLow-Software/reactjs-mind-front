import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { updatePatientProfileById } from '@/api/patient-profiles/update-patient-profile-by-id'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import { useFormData } from '@/hooks/use-form-data'
import type { UpdatePatientFormData } from '@/validators/patients/form/update-patient-schema'
import { usePatientAttachmentsUpload } from './use-patient-attachments-upload'

type IUseUpdatePatient = {
  patientId: string
  files: File[]
  onSuccess?: () => void
}

export function useUpdatePatient({
  patientId,
  files,
  onSuccess,
}: IUseUpdatePatient) {
  const queryClient = useQueryClient()

  const { transform } = useFormData<UpdatePatientFormData>()
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
      const formData = transform(data)

      await mutateAsync({ id: patientId, formData })

      await uploadAll({ targetId: patientId, files })
      onSuccess?.()
    },
    [mutateAsync, transform, uploadAll, patientId, files, onSuccess],
  )

  return { submit, isSubmitting: isPending /* || isUploading */ }
}
