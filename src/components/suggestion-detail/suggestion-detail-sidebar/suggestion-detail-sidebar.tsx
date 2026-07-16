'use client'

import { useMemo } from 'react'
import { ChevronUp, Clock, MessageCircle, Users } from 'lucide-react'

import { Time } from '@/utils/time'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import { VotersCard } from '@/components/suggestion-detail/suggestion-detail-sidebar/voters-card/voters-card'
import { JourneyCard } from '@/components/suggestion-detail/suggestion-detail-sidebar/journey-card/journey-card'
import {
  StatsCard,
  type ISuggestionMiniStat,
} from '@/components/suggestion-detail/suggestion-detail-sidebar/stats-card/stats-card'
import { RelatedCard } from '@/components/suggestion-detail/suggestion-detail-sidebar/related-card/related-card'

import './suggestion-detail-sidebar.css'

type ISuggestionDetailSidebar = {
  item: ISuggestion
}

export function SuggestionDetailSidebar({ item }: ISuggestionDetailSidebar) {
  const stats = useMemo<ISuggestionMiniStat[]>(
    () => [
      { label: 'Votos', value: String(item.likesCount), Icon: ChevronUp },
      { label: 'Comentários', value: '0', Icon: MessageCircle },
      {
        label: 'Aberta há',
        value: Time.toRelativeFromNowShort(item.createdAt),
        Icon: Clock,
      },
      { label: 'Seguidores', value: '0', Icon: Users },
    ],
    [item.likesCount, item.createdAt],
  )

  return (
    <div className="sdm-sidebar">
      <VotersCard likesCount={item.likesCount} />
      <JourneyCard status={item.status} createdAt={item.createdAt} />
      <StatsCard stats={stats} />
      <RelatedCard />
    </div>
  )
}
