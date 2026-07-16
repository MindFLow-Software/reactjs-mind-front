import type { ReactNode } from 'react'
import { Check, Zap } from 'lucide-react'

import { cn } from '@/lib/utils'
import { SuggestionStepState } from '@/components/suggestion-detail/suggestion-detail-config'

import './journey-step.css'

type IJourneyStep = {
  label: string
  state: SuggestionStepState
  doneDate: string
}

const NODE_CLASS: Record<SuggestionStepState, string> = {
  [SuggestionStepState.DONE]: 'sdm-timeline-node-done',
  [SuggestionStepState.CURRENT]: 'sdm-timeline-node-current',
  [SuggestionStepState.PENDING]: 'sdm-timeline-node-pending',
}

const NODE_MARK: Record<SuggestionStepState, ReactNode> = {
  [SuggestionStepState.DONE]: <Check className="size-3" strokeWidth={3} />,
  [SuggestionStepState.CURRENT]: <Zap className="size-3" />,
  [SuggestionStepState.PENDING]: <span className="sdm-timeline-blob" />,
}

export function JourneyStep({ label, state, doneDate }: IJourneyStep) {
  const isDone = state === SuggestionStepState.DONE
  const isActive = isDone || state === SuggestionStepState.CURRENT

  return (
    <div className="sdm-journey-step">
      <div className={cn('sdm-timeline-node', NODE_CLASS[state])}>
        {NODE_MARK[state]}
      </div>
      <div className={cn(!isActive && 'sdm-journey-body-pending')}>
        <p
          className={cn(
            'sdm-journey-label',
            isActive && 'sdm-journey-label-active',
          )}
        >
          {label}
        </p>
        {isDone && <p className="sdm-journey-date">{doneDate}</p>}
      </div>
    </div>
  )
}
