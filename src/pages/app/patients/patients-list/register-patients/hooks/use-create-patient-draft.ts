import { useState, useCallback } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFileSelection } from "@/hooks/use-file-selection"
import { patientSchema, type PatientFormData } from "@/validators/patients"
import { buildPatientDefaults } from "../helpers"
import { MAX_DOC_FILES, MAX_DOC_SIZE } from "../constants"

export interface CreatePatientDraft {
    methods:       UseFormReturn<PatientFormData>
    avatarFile:    File | null
    setAvatarFile: (f: File | null) => void
    files:         File[]
    addFiles:      (incoming: File[]) => void
    removeFile:    (index: number) => void
    clearFiles:    () => void
}

export function useCreatePatientDraft(): CreatePatientDraft {
    const methods = useForm<PatientFormData>({
        resolver: zodResolver(patientSchema),
        mode: "onTouched",
        defaultValues: buildPatientDefaults(),
    })

    const [avatarFile, setAvatarFileState] = useState<File | null>(null)
    const setAvatarFile = useCallback((f: File | null) => setAvatarFileState(f), [])

    const { files, addFiles, removeFile, clearFiles } = useFileSelection({
        maxFiles:     MAX_DOC_FILES,
        maxSizeBytes: MAX_DOC_SIZE,
    })

    return { methods, avatarFile, setAvatarFile, files, addFiles, removeFile, clearFiles }
}
