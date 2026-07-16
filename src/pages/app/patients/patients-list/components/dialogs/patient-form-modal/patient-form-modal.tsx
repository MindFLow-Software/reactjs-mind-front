import './patient-form-modal.css'
import type { ElementType, ReactNode } from 'react'
import { Check, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { STEPS } from '../register-patients/constants'
import type { IPatientFormSteps } from '../../../patients-list.types'

type IPatientFormModalRoot = {
  children: ReactNode
}

type IPatientFormModalHeader = {
  icon: ElementType
  title: string
  subtitle: string
}

type IPatientFormModalStepper = {
  steps: IPatientFormSteps
}

type IPatientFormModalBody = {
  children: ReactNode
}

type IPatientFormModalFooter = {
  steps: IPatientFormSteps
  submit: { label: string; isSubmitting: boolean; onSubmit: () => void }
  disabled?: boolean
}

function badgeClassName(active: boolean, done: boolean): string {
  if (active) return 'rp-modal-tab-badge--active'
  return done ? 'rp-modal-tab-badge--done' : 'rp-modal-tab-badge--pending'
}

function PatientFormModalRoot({ children }: IPatientFormModalRoot) {
  return (
    <DialogContent
      className="rp-modal"
      onPointerDownOutside={(e) => e.preventDefault()}
    >
      {children}
    </DialogContent>
  )
}

function PatientFormModalHeader({
  icon: Icon,
  title,
  subtitle,
}: IPatientFormModalHeader) {
  return (
    <DialogTitle className="rp-modal-header">
      <div className="rp-modal-icon-box">
        <Icon className="text-blue-600" />
      </div>
      <div className="rp-modal-heading">
        <h2 className="rp-modal-title">{title}</h2>
        <p className="rp-modal-subtitle">{subtitle}</p>
      </div>
    </DialogTitle>
  )
}

function PatientFormModalStepper({ steps }: IPatientFormModalStepper) {
  return (
    <>
      <div className="rp-modal-stepper">
        {STEPS.map((step) => {
          const active = steps.current === step.id
          const done = steps.current > step.id

          return (
            <button
              key={step.id}
              type="button"
              className="rp-modal-tab"
              onClick={() => steps.goToStep(step.id)}
            >
              <span
                className={cn(
                  'rp-modal-tab-badge',
                  badgeClassName(active, done),
                )}
              >
                {step.id}
              </span>
              <span>{step.label}</span>
              {step.required && (
                <span className="rp-modal-tab-required">*</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="rp-modal-progress-track">
        <div
          className="rp-modal-progress-fill"
          style={{ width: `${(steps.current / STEPS.length) * 100}%` }}
        />
      </div>
    </>
  )
}

function PatientFormModalBody({ children }: IPatientFormModalBody) {
  return <div className="rp-modal-body">{children}</div>
}

function SubmitLabel({
  label,
  isSubmitting,
  isLastStep,
}: {
  label: string
  isSubmitting: boolean
  isLastStep: boolean
}) {
  if (isSubmitting) {
    return (
      <>
        <Loader2 className="size-4 animate-spin" />
        <span>Salvando…</span>
      </>
    )
  }

  if (!isLastStep) {
    return (
      <>
        <span>Continuar</span>
        <ChevronRight className="size-4" />
      </>
    )
  }

  return (
    <>
      <span>{label}</span>
      <Check className="size-4" />
    </>
  )
}

function PatientFormModalFooter({
  steps,
  submit,
  disabled,
}: IPatientFormModalFooter) {
  const onClick = steps.isLastStep ? submit.onSubmit : steps.handleNext

  return (
    <DialogFooter className="rp-modal-footer">
      {!steps.isFirstStep && (
        <Button
          type="button"
          variant="outline"
          onClick={steps.handleBack}
          className="rp-btn-secondary"
        >
          <ChevronLeft className="size-4" strokeWidth={2.5} />
          Voltar
        </Button>
      )}
      <DialogClose asChild>
        <Button type="button" variant="outline" className="rp-btn-secondary">
          Cancelar
        </Button>
      </DialogClose>
      <Button
        type="button"
        onClick={onClick}
        className="rp-btn-primary"
        disabled={submit.isSubmitting || disabled}
      >
        <SubmitLabel
          label={submit.label}
          isLastStep={steps.isLastStep}
          isSubmitting={submit.isSubmitting}
        />
      </Button>
    </DialogFooter>
  )
}

export const PatientFormModal = Object.assign(PatientFormModalRoot, {
  Header: PatientFormModalHeader,
  Stepper: PatientFormModalStepper,
  Body: PatientFormModalBody,
  Footer: PatientFormModalFooter,
})
