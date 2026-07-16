import { ChevronUp } from 'lucide-react'

import { cn } from '@/lib/utils'

import './vote-button.css'

type IVoteButton = {
  count: number
  isLiked: boolean
  onVote: () => void
}

export function VoteButton({ count, isLiked, onVote }: IVoteButton) {
  return (
    <button
      type="button"
      onClick={onVote}
      aria-pressed={isLiked}
      title={isLiked ? 'Remover voto' : 'Votar nessa sugestão'}
      className={cn(
        'sdm-vote',
        isLiked ? 'sdm-vote-liked' : 'sdm-vote-default',
      )}
    >
      <ChevronUp className="size-[18px]" strokeWidth={2.5} />
      <span className="sdm-vote-count">{count}</span>
      <span className="sdm-vote-caption">VOTOS</span>
    </button>
  )
}
