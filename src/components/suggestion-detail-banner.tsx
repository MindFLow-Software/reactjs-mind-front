'use client'

import { Link2, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SuggestionStatus } from '@/types/enums'
import {
  SUGGESTION_STATUS_DISPLAY,
  SUGGESTION_BANNER_STEPS,
} from '@/components/suggestion-detail-config'
import './suggestion-detail-banner.css'

interface SuggestionDetailBannerProps {
  status: SuggestionStatus
  shortId: string
}

export function SuggestionDetailBanner({
  status,
  shortId,
}: SuggestionDetailBannerProps) {
  const statusCfg = SUGGESTION_STATUS_DISPLAY[status]

  return (
    <div className={cn('sdm-banner', statusCfg.bannerBg)}>
      <span
        className={cn('size-2 rounded-full shrink-0', statusCfg.blobColor)}
      />
      <span className={cn('sdm-banner-label', statusCfg.bannerText)}>
        {statusCfg.label}
      </span>
      <span className="text-slate-300 dark:text-slate-600 shrink-0">·</span>

      <div className="hidden sm:flex items-center gap-1 flex-1 min-w-0 overflow-hidden">
        {SUGGESTION_BANNER_STEPS.map((label, i) => {
          const isDone = i < statusCfg.currentStep
          const isCurrent = i === statusCfg.currentStep
          return (
            <div key={label} className="flex items-center gap-1 shrink-0">
              {i > 0 && (
                <ChevronRight className="size-3 text-slate-300 dark:text-slate-600 shrink-0" />
              )}
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    'sdm-banner-step',
                    isDone
                      ? cn(statusCfg.blobColor, 'text-white')
                      : isCurrent
                        ? 'bg-blue-500 text-white ring-2 ring-blue-500/30 ring-offset-1 ring-offset-transparent'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
                  )}
                  aria-label={`Etapa ${i + 1} de ${SUGGESTION_BANNER_STEPS.length}: ${label}`}
                >
                  {isDone ? (
                    <Check className="size-2.5" strokeWidth={3} />
                  ) : isCurrent ? (
                    <span className="size-1.5 rounded-full bg-white block" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                {(isDone || isCurrent) && (
                  <span
                    className={cn(
                      'text-[11px] font-medium hidden lg:block whitespace-nowrap',
                      statusCfg.bannerText,
                    )}
                  >
                    {label}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="sdm-banner-code">
        <Link2 className="size-2.5" />
        <span>SUG-{shortId}</span>
      </div>
    </div>
  )
}
