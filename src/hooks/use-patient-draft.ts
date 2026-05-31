import { useCallback } from "react"

const DRAFT_KEY = "patient-form-draft"

export interface PatientFormDraft {
    firstName:   string
    lastName:    string
    phoneNumber: string
    email:       string
    cpf:         string
    gender:      string
    dateOfBirth: string | null  // ISO 8601 — null when not set
    birthInput:  string         // DD/MM/YYYY display string
    cep:         string
    logradouro:  string
    bairro:      string
    cidade:      string
    uf:          string
    step:        number
}

export function usePatientDraft() {
    const readDraft = useCallback((): PatientFormDraft | null => {
        try {
            const raw = localStorage.getItem(DRAFT_KEY)
            return raw ? (JSON.parse(raw) as PatientFormDraft) : null
        } catch {
            return null
        }
    }, [])

    const writeDraft = useCallback((draft: PatientFormDraft) => {
        try {
            localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
        } catch {
            // localStorage full or unavailable — fail silently
        }
    }, [])

    const clearDraft = useCallback(() => {
        localStorage.removeItem(DRAFT_KEY)
    }, [])

    return { readDraft, writeDraft, clearDraft }
}
