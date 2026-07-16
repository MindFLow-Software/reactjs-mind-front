import { Check } from 'lucide-react'

import './vote-complete.css'

export function VoteComplete() {
  return (
    <div className="sdm-vote-done">
      <div className="sdm-vote-done-mark">
        <Check className="sdm-vote-done-icon" strokeWidth={2.5} />
      </div>
      <span className="sdm-vote-done-label">Disponível</span>
    </div>
  )
}
