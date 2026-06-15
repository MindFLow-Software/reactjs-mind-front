import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'
import { AxiosError } from 'axios'

import { createPatients } from '@/api/patients/create-patient'
import { updatePatients } from '@/api/patients/update-patient'
import type { PatientFormData } from '@/validators/patients'
import { uploadAttachment, uploadAvatar } from '@/api/attachments/attachments'

interface UsePatientSubmitOptions {
  files: File[]
  patientId?: string
  avatarFile: File | null
  onSuccess?: () => void
}

export function usePatientSubmit({
  files,
  onSuccess,
  patientId,
  avatarFile,
}: UsePatientSubmitOptions) {
  const queryClient = useQueryClient()
  const isEditMode = Boolean(patientId)
  const [isUploading, setIsUploading] = useState(false)

  const { mutateAsync: createFn, isPending: isCreating } = useMutation({
    mutationFn: createPatients,
    onSuccess: async (response) => {
      const targetId = isEditMode ? patientId! : response.patientId

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['patients'] }),
        queryClient.invalidateQueries({ queryKey: ['patient', targetId] }),
        queryClient.invalidateQueries({ queryKey: ['attachments', targetId] }),
        queryClient.invalidateQueries({ queryKey: ['patients-metrics'] }),
      ])

      onSuccess?.()
      toast.success('Paciente cadastrado!')
    },
    onError: (error) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.message
          : 'Erro ao criar. Verifique os dados.'

      toast.error(errorMessage)
    },
  })

  const { mutateAsync: updateFn, isPending: isUpdating } = useMutation({
    mutationFn: updatePatients,
    onSuccess: async (response) => {
      const targetId = isEditMode ? patientId! : response.id

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['patients'] }),
        queryClient.invalidateQueries({ queryKey: ['patient', targetId] }),
        queryClient.invalidateQueries({ queryKey: ['attachments', targetId] }),
        queryClient.invalidateQueries({ queryKey: ['patients-metrics'] }),
      ])

      onSuccess?.()
      toast.success('Paciente atualizado!')
    },
    onError: (error) => {
      const errorMessage =
        error instanceof AxiosError
          ? error.message
          : 'Erro ao salvar. Verifique os dados.'

      toast.error(errorMessage)
    },
  })

  const isSubmitting = isCreating || isUpdating || isUploading

  async function submit(data: PatientFormData) {
    const shared = {
      ...data,
      dateOfBirth: data?.dateOfBirth ?? undefined,
    }

    try {
      setIsUploading(true)

      let targetId: string

      if (isEditMode) {
        await updateFn({ ...shared, id: patientId! })
        targetId = patientId!
      } else {
        const response = await createFn(shared)
        targetId = response.patientId
      }

      if (avatarFile) {
        try {
          await uploadAvatar(avatarFile, targetId)
        } catch {
          console.warn('Avatar upload failed — patient saved without avatar')
        }
      }

      for (const file of files) await uploadAttachment(file, targetId)
    } finally {
      setIsUploading(false)
    }
  }

  return { submit, isSubmitting }
}
