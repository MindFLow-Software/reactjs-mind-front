import { useState, useCallback } from "react"
import type { UseFormTrigger } from "react-hook-form"
import type { PatientFormData } from "@/validators/patients"
import { type StepId } from "../constants"

const STEP_FIELDS: Partial<Record<StepId, (keyof PatientFormData)[]>> = {
    1: ["firstName", "lastName", "cpf", "dateOfBirth", "gender"],
    2: ["phoneNumber", "email"],
}

interface UsePatientFormStepsOptions {
    trigger: UseFormTrigger<PatientFormData>
}

interface UsePatientFormStepsReturn {
    step:        StepId
    handleNext:  () => Promise<void>
    handleBack:  () => void
    goToStep:    (id: StepId) => void
    isFirstStep: boolean
    isLastStep:  boolean
}

export function usePatientFormSteps({ trigger }: UsePatientFormStepsOptions): UsePatientFormStepsReturn {
    const [step, setStep] = useState<StepId>(1)

    const handleNext = useCallback(async () => {
        const fields = STEP_FIELDS[step] ?? []
        const valid  = fields.length === 0 || await trigger(fields)
        if (valid && step < 4) setStep((s) => (s + 1) as StepId)
    }, [step, trigger])

    const handleBack = useCallback(() => {
        setStep((s) => (s - 1) as StepId)
    }, [])

    const goToStep = useCallback((id: StepId) => {
        setStep(id)
    }, [])

    return {
        step,
        handleNext,
        handleBack,
        goToStep,
        isFirstStep: step === 1,
        isLastStep:  step === 4,
    }
}
