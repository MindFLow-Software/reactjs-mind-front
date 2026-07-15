import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { Check, ChevronRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { SuggestionStatus } from '@/types/suggestion/suggestion-status'
import {
  SuggestionStepState,
  SUGGESTION_BANNER_STEPS,
  SUGGESTION_STATUS_DISPLAY,
} from '@/components/suggestion-detail/suggestion-detail-config'

import './banner-step.css'

export const BannerStatusContext = createContext<SuggestionStatus>(
  SuggestionStatus.PENDING,
)

type IBannerStep = {
  label: string
  index: number
  state: SuggestionStepState
}

const STATE_CLASS: Record<SuggestionStepState, string> = {
  [SuggestionStepState.DONE]: 'sdm-banner-step-done',
  [SuggestionStepState.CURRENT]: 'sdm-banner-step-current',
  [SuggestionStepState.PENDING]: 'sdm-banner-step-pending',
}

function renderStepMark(state: SuggestionStepState, index: number): ReactNode {
  if (state === SuggestionStepState.DONE) {
    return <Check className="size-2.5" strokeWidth={3} />
  }

  if (state === SuggestionStepState.CURRENT) {
    return <span className="sdm-banner-step-current-blob" />
  }

  return <span>{index + 1}</span>
}

export function BannerStep({ label, index, state }: IBannerStep) {
  const status = useContext(BannerStatusContext)
  const { blobColor, bannerText } = SUGGESTION_STATUS_DISPLAY[status]

  const isDone = state === SuggestionStepState.DONE
  const isNamed = isDone || state === SuggestionStepState.CURRENT

  return (
    <div className="sdm-banner-step-wrap">
      {index > 0 && <ChevronRight className="sdm-banner-step-chevron" />}
      <div className="sdm-banner-step-inner">
        <div
          className={cn(
            'sdm-banner-step',
            STATE_CLASS[state],
            isDone && blobColor,
          )}
          aria-label={`Etapa ${index + 1} de ${SUGGESTION_BANNER_STEPS.length}: ${label}`}
        >
          {renderStepMark(state, index)}
        </div>
        {isNamed && (
          <span className={cn('sdm-banner-step-label', bannerText)}>
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
