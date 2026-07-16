'use client'

import { Link2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { SuggestionStatus } from '@/types/suggestion/suggestion-status'
import {
  resolveStepState,
  bannerStepProgress,
  SUGGESTION_BANNER_STEPS,
  SUGGESTION_STATUS_DISPLAY,
} from '@/components/suggestion-detail/suggestion-detail-config'
import {
  BannerStep,
  BannerStatusContext,
} from '@/components/suggestion-detail/suggestion-detail-banner/banner-step/banner-step'

import './suggestion-detail-banner.css'

type ISuggestionDetailBanner = {
  status: SuggestionStatus
  shortId: string
}

export function SuggestionDetailBanner({
  status,
  shortId,
}: ISuggestionDetailBanner) {
  const statusCfg = SUGGESTION_STATUS_DISPLAY[status]
  const progress = bannerStepProgress(status)

  return (
    <BannerStatusContext.Provider value={status}>
      <div className={cn('sdm-banner', statusCfg.bannerBg)}>
        <span className={cn('sdm-banner-blob', statusCfg.blobColor)} />
        <span className={cn('sdm-banner-label', statusCfg.bannerText)}>
          {statusCfg.label}
        </span>
        <span className="sdm-banner-separator">·</span>

        <div className="sdm-banner-steps">
          {SUGGESTION_BANNER_STEPS.map((label, index) => (
            <BannerStep
              key={label}
              label={label}
              index={index}
              state={resolveStepState(index, progress)}
            />
          ))}
        </div>

        <div className="sdm-banner-code">
          <Link2 className="size-2.5" />
          <span>SUG-{shortId}</span>
        </div>
      </div>
    </BannerStatusContext.Provider>
  )
}
