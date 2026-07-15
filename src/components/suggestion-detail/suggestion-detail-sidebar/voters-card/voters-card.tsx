import { cn } from '@/lib/utils'
import { SuggestionInitialsAvatar } from '@/components/suggestion-detail/suggestion-initials-avatar/suggestion-initials-avatar'

import './voters-card.css'

const MAX_VISIBLE_VOTERS = 5

type IVotersCard = {
  likesCount: number
}

function VotersEmpty() {
  return <p className="sdm-voters-empty">Nenhum voto ainda.</p>
}

function VotersStack({ likesCount }: IVotersCard) {
  const visible = Math.min(MAX_VISIBLE_VOTERS, likesCount)
  const overflow = likesCount - MAX_VISIBLE_VOTERS

  return (
    <div className="sdm-voters-stack">
      <div className="sdm-voters-row">
        {Array.from({ length: visible }).map((_, index) => (
          <SuggestionInitialsAvatar
            key={index}
            name={String.fromCharCode(65 + index)}
            size="md"
            className={cn(index > 0 && '-ml-2')}
          />
        ))}
        {overflow > 0 && <div className="sdm-voters-overflow">+{overflow}</div>}
      </div>
      <p className="sdm-voters-summary">
        <strong className="sdm-voters-count">{likesCount}</strong> psicólogos
        votaram
      </p>
    </div>
  )
}

export function VotersCard({ likesCount }: IVotersCard) {
  return (
    <div className="sdm-card sdm-voters">
      <span className="sdm-card-label">Quem votou</span>
      {likesCount > 0 ? (
        <VotersStack likesCount={likesCount} />
      ) : (
        <VotersEmpty />
      )}
    </div>
  )
}
