import { Time } from '@/utils/time'
import type { SuggestionStatus } from '@/types/suggestion/suggestion-status'
import {
  resolveStepState,
  SUGGESTION_TIMELINE_STEPS,
  SUGGESTION_TIMELINE_PROGRESS,
} from '@/components/suggestion-detail/suggestion-detail-config'
import { JourneyStep } from '@/components/suggestion-detail/suggestion-detail-sidebar/journey-card/journey-step/journey-step'

import './journey-card.css'

type IJourneyCard = {
  status: SuggestionStatus
  createdAt: string
}

export function JourneyCard({ status, createdAt }: IJourneyCard) {
  const progress = SUGGESTION_TIMELINE_PROGRESS[status]
  const doneDate = Time.toShortMonthDate(createdAt)

  return (
    <div className="sdm-card">
      <span className="sdm-card-label sdm-journey-label-block">Jornada</span>
      <div className="sdm-journey-track">
        <div className="sdm-journey-rail" />
        {SUGGESTION_TIMELINE_STEPS.map((label, index) => (
          <JourneyStep
            key={label}
            label={label}
            state={resolveStepState(index, progress)}
            doneDate={doneDate}
          />
        ))}
      </div>
    </div>
  )
}
