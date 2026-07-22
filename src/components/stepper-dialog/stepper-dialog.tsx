import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Check, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { IconBox } from '@/components/icon-box/icon-box'

import './stepper-dialog.css'

export type IStepperNav = {
  current: number
  total: number
  onNext: () => void
  onBack: () => void
  onGoTo: (step: number) => void
}

export type IStepperStepDefinition = {
  id: number
  label: string
  required?: boolean
}

type IStepperSubmit = {
  label: string
  isSubmitting: boolean
  onSubmit: () => void
}

type IStepperDialogRoot = {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
  className?: string
  dismissible?: boolean
}

type IStepperDialogHeader = {
  icon: LucideIcon
  title: string
  subtitle?: string
}

type IStepperDialogSteps = {
  steps: IStepperNav
  definitions: readonly IStepperStepDefinition[]
}

type IStepperDialogBody = {
  children: ReactNode
}

type IStepperDialogFooter = {
  steps: IStepperNav
  submit: IStepperSubmit
  disabled?: boolean
}

function stepBadgeClass(active: boolean, done: boolean, error: boolean = false): string {
  if (active) return 'sd-tab-badge--active'
  if (error) return 'sd-tab-badge--error'
  return done ? 'sd-tab-badge--done' : 'sd-tab-badge--pending'
}

function stepBadgeIcon(id: number, done: boolean, error: boolean = false) {
  if (error) return <X className="size-3.5" />
  return done ? <Check className="size-3.5" /> : <>{id}</>
}

function StepperDialogRoot({
  open,
  onOpenChange,
  children,
  className,
  dismissible = true,
}: IStepperDialogRoot) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('sd-content', className)}
        onPointerDownOutside={
          dismissible ? undefined : (event) => event.preventDefault()
        }
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function StepperDialogHeader({ icon, title, subtitle }: IStepperDialogHeader) {
  return (
    <div className="sd-header">
      <IconBox icon={icon} variant="primary" size="md" />
      <div className="sd-heading">
        <DialogTitle className="sd-title">{title}</DialogTitle>
        {subtitle && (
          <DialogDescription className="sd-subtitle">
            {subtitle}
          </DialogDescription>
        )}
      </div>
    </div>
  )
}

function StepperDialogSteps({ steps, definitions }: IStepperDialogSteps) {
  return (
    <div className="sd-steps-container">
      <div className="sd-steps">
        {definitions.map((definition) => {
          const active = steps.current === definition.id
          const done = steps.current > definition.id

          return (
            <Button
              key={definition.id}
              type="button"
              variant="ghost"
              size="sm"
              className="sd-tab"
              onClick={() => steps.onGoTo(definition.id)}
            >
              <span
                className={cn('sd-tab-badge', stepBadgeClass(active, done))}
              >
                {done ? <Check className="size-3.5" /> : definition.id}
              </span>
              <span>{definition.label}</span>
              {definition.required && (
                <span className="sd-tab-required">*</span>
              )}
            </Button>
          )
        })}
      </div>

      <div className="sd-progress-track">
        <div
          className="sd-progress-fill"
          style={{ width: `${(steps.current / steps.total) * 100}%` }}
        />
      </div>
    </div>
  )
}

function StepperDialogBody({ children }: IStepperDialogBody) {
  return <div className="sd-body">{children}</div>
}

function FooterPrimaryLabel({
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
        <Loader2 data-icon="inline-start" className="animate-spin" />
        <span>Salvando…</span>
      </>
    )
  }

  if (!isLastStep) {
    return (
      <>
        <span>Continuar</span>
        <ChevronRight data-icon="inline-end" />
      </>
    )
  }

  return (
    <>
      <span>{label}</span>
      <Check data-icon="inline-end" />
    </>
  )
}

function StepperDialogFooter({
  steps,
  submit,
  disabled,
}: IStepperDialogFooter) {
  const isFirstStep = steps.current === 1
  const isLastStep = steps.current === steps.total
  const onPrimaryClick = isLastStep ? submit.onSubmit : steps.onNext

  return (
    <DialogFooter className="sd-footer">
      {!isFirstStep && (
        <Button type="button" variant="outline" onClick={steps.onBack}>
          <ChevronLeft data-icon="inline-start" />
          Voltar
        </Button>
      )}
      <DialogClose asChild>
        <Button type="button" variant="outline">
          Cancelar
        </Button>
      </DialogClose>
      <Button
        type="button"
        onClick={onPrimaryClick}
        disabled={submit.isSubmitting || disabled}
      >
        <FooterPrimaryLabel
          label={submit.label}
          isLastStep={isLastStep}
          isSubmitting={submit.isSubmitting}
        />
      </Button>
    </DialogFooter>
  )
}

export const StepperDialog = Object.assign(StepperDialogRoot, {
  Header: StepperDialogHeader,
  Steps: StepperDialogSteps,
  Body: StepperDialogBody,
  Footer: StepperDialogFooter,
})
