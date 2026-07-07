import { useState, useCallback } from 'react'

interface IUseFormStepsReturn {
  step: number
  handleNext: () => Promise<void>
  handleBack: () => void
  goToStep: (id: number) => void
  isFirstStep: boolean
  isLastStep: boolean
}

interface IuseFormSteps {
  stepsLength: number
}

export function useFormSteps({
  stepsLength
}: IuseFormSteps): IUseFormStepsReturn {
  const [step, setStep] = useState<number>(1)

  const handleNext = useCallback(async () => {
    setStep((prevStep) => (prevStep >= stepsLength ? prevStep : prevStep + 1))
  }, [step])

  const handleBack = useCallback(() => {
    setStep((prevStep) => (prevStep <= 0 ? prevStep : prevStep - 1))
  }, [])

  const goToStep = useCallback((id: number) => {
    setStep(id)
  }, [])

  return {
    step,
    handleNext,
    handleBack,
    goToStep,
    isFirstStep: step === 1,
    isLastStep: step === stepsLength,
  }
}
