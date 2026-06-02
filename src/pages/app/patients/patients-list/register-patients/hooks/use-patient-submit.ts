import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { AxiosError } from "axios"

import { createPatients } from "@/api/patients/create-patient"
import { updatePatients } from "@/api/patients/update-patient"
import { uploadAttachment, uploadAvatar } from "@/api/attachments/attachments"

import type { PatientHTTP } from "@/types/patient"
import type { PatientFormData } from "@/validators/patients"

interface UsePatientSubmitOptions {
    patient?:   PatientHTTP
    avatarFile: File | null
    files:      File[]
    onSuccess?: () => void
}

export function usePatientSubmit({ patient, avatarFile, files, onSuccess }: UsePatientSubmitOptions) {
    const queryClient = useQueryClient()
    const isEditMode  = !!patient
    const [isUploading, setIsUploading] = useState(false)

    const { mutateAsync: createFn, isPending: isCreating } = useMutation({
        mutationFn: createPatients,
    })

    const { mutateAsync: updateFn, isPending: isUpdating } = useMutation({
        mutationFn: updatePatients,
    })

    const isSubmitting = isCreating || isUpdating || isUploading

    async function submit(data: PatientFormData) {
        const {
            modality, frequency, price, source, notes,
            email, dateOfBirth, phoneNumber, cpf,
            zipCode, street, neighborhood, city, state,
            complement, number,
            ...coreFields
        } = data

        const shared = {
            ...coreFields,
            phoneNumber:   phoneNumber   || undefined,
            cpf:           cpf           || undefined,
            zipCode:       zipCode       || undefined,
            street:        street        || undefined,
            neighborhood:  neighborhood  || undefined,
            city:          city          || undefined,
            state:         state         || undefined,
            complement:    complement    || undefined,
            number:        number        || undefined,
            dateOfBirth:   dateOfBirth   || undefined,
        }

        try {
            setIsUploading(true)

            const res = isEditMode
                ? await updateFn({ ...shared, id: patient!.id })
                : await createFn({ ...shared, email: email || undefined })

            // ToDo: type response
            const targetId = res?.id ?? res?.patientId

            if (!targetId) throw new Error("ID não identificado")

            if (avatarFile) {
                try {
                    await uploadAvatar(avatarFile, targetId)
                } catch {
                    console.warn("Avatar upload failed — patient saved without avatar")
                }
            }

            for (const f of files) await uploadAttachment(f, targetId)

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["patients"] }),
                queryClient.invalidateQueries({ queryKey: ["patient", targetId] }),
                queryClient.invalidateQueries({ queryKey: ["attachments", targetId] }),
            ])

            toast.success(isEditMode ? "Paciente atualizado!" : "Paciente cadastrado!")
            onSuccess?.()
        } catch (error) {
            toast.error(error instanceof AxiosError ? error.message : "Erro ao salvar. Verifique os dados.")
        } finally {
            setIsUploading(false)
        }
    }

    return { submit, isSubmitting }
}
