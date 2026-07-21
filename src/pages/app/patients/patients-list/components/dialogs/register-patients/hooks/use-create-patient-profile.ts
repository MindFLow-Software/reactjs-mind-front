import { useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createPatientProfile } from '@/api/patient-profiles/create-patient-profile'
import { getApiErrorMessage } from '@/lib/get-api-error-message'
import type { CreatePatientFormData } from '@/validators/patients/form/create-patient-schema'
import { usePatientAttachmentsUpload } from './use-patient-attachments-upload'
import { useFormData } from '@/hooks/use-form-data'

type IUseCreatePatient = {
  files: File[]
  onSuccess: () => void
}

export function useCreatePatientProfile({
  files,
  onSuccess,
}: IUseCreatePatient) {
  const queryClient = useQueryClient()

  const { transform } = useFormData<CreatePatientFormData>()
  const { uploadAll, isUploading } = usePatientAttachmentsUpload()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPatientProfile,
    onSuccess: async (response) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['patients'] }),
        queryClient.invalidateQueries({
          queryKey: ['patient', response.patientId],
        }),
        queryClient.invalidateQueries({
          queryKey: ['attachments', response.patientId],
        }),
        queryClient.invalidateQueries({ queryKey: ['patients-metrics'] }),
      ])

      toast.success(response.message)
    },
    onError: (error) => {
      toast.error(
        getApiErrorMessage(error, 'Erro ao criar. Verifique os dados.'),
      )
    },
  })

  const submit = useCallback(
    async (data: CreatePatientFormData) => {
      const formData = transform(data)

      const response = await mutateAsync(formData)

      await uploadAll({ targetId: response.patientId, files })
      onSuccess()
    },
    [mutateAsync, transform, uploadAll, files, onSuccess],
  )

  return { submit, isSubmitting: isPending || isUploading }
}
