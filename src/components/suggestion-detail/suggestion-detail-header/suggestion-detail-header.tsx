'use client'

import { useCallback } from 'react'

import { DialogTitle } from '@/components/ui/dialog'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import { SuggestionStatus } from '@/types/suggestion/suggestion-status'
import { VoteButton } from '@/components/suggestion-detail/suggestion-detail-header/vote-button/vote-button'
import { VoteComplete } from '@/components/suggestion-detail/suggestion-detail-header/vote-complete/vote-complete'
import { HeaderMeta } from '@/components/suggestion-detail/suggestion-detail-header/header-meta/header-meta'
import { HeaderActions } from '@/components/suggestion-detail/suggestion-detail-header/header-actions/header-actions'

import './suggestion-detail-header.css'

type ISuggestionDetailHeader = {
  item: ISuggestion
  userId?: string
  onLike: (id: string) => void
}

export function SuggestionDetailHeader({
  item,
  userId,
  onLike,
}: ISuggestionDetailHeader) {
  const isLiked = userId ? Boolean(item.likes?.includes(userId)) : false
  const isImplemented = item.status === SuggestionStatus.IMPLEMENTED

  const handleVote = useCallback(() => onLike(item.id), [onLike, item.id])

  return (
    <div className="sdm-header">
      {isImplemented ? (
        <VoteComplete />
      ) : (
        <VoteButton
          count={item.likesCount}
          isLiked={isLiked}
          onVote={handleVote}
        />
      )}

      <div className="sdm-header-main">
        <DialogTitle id="dm-title" className="sdm-title">
          {item.title}
        </DialogTitle>
        <HeaderMeta item={item} />
      </div>

      <HeaderActions />
    </div>
  )
}
