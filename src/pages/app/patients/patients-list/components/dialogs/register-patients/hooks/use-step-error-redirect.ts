import { useEffect, useRef } from 'react'
import type { FieldErrors, FieldValues } from 'react-hook-form'
import type { ZodObject } from 'zod'

import { schemaFields } from '@/utils/schema-fields'
import { STEPS } from '../constants'
import { RegisterPatientTab } from '../../../../patients-list.types'

type IUseStepErrorRedirect = {
  errors: FieldErrors<FieldValues>
  schema: ZodObject
  goToStep: (id: number) => void
}

function emptyTabs(): Record<RegisterPatientTab, string[]> {
  return {
    [RegisterPatientTab.BASIC_DATA]: [],
    [RegisterPatientTab.CONTACT]: [],
    [RegisterPatientTab.DOCUMENTS]: [],
  }
}

export function useStepErrorRedirect({
  errors,
  schema,
  goToStep,
}: IUseStepErrorRedirect) {
  const hasRedirected = useRef(false)

  useEffect(() => {
    if (hasRedirected.current) return

    const firstErrorField = Object.keys(errors)[0]
    if (!firstErrorField) return

    const tabs = schemaFields.getGrouped<RegisterPatientTab>(
      emptyTabs(),
      schema,
    )

    const tabWithError = tabs.find((tab) =>
      tab.fields.includes(firstErrorField),
    )
    if (!tabWithError) return

    const stepWithError = STEPS.find(({ key }) => tabWithError.name === key)
    if (!stepWithError) return

    goToStep(stepWithError.id)
    hasRedirected.current = true
  }, [errors, schema, goToStep])
}
