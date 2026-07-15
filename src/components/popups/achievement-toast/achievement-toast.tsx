'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { IPopup } from '@/types/popup/popup'
import {
  ConfettiPiece,
  type IConfettiPieceData,
} from '@/components/popups/confetti-piece/confetti-piece'
import {
  AchievementVariant,
  ACHIEVEMENT_VARIANTS,
  CONFETTI_COLORS,
} from '@/components/popups/achievement-toast/achievement-toast-variants'

import './achievement-toast.css'

type IAchievementToast = {
  popup: IPopup
  onClose: (action: string) => void
  duration?: number
}

const CONFETTI_PIECE_COUNT = 35
const MAX_DURATION_MS = 15000

function buildConfettiPieces(
  variant: AchievementVariant,
): IConfettiPieceData[] {
  const colors = CONFETTI_COLORS[variant]
  return Array.from({ length: CONFETTI_PIECE_COUNT }).map((_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 400,
    left: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 1,
  }))
}

function resolveVariant(internalName: string | null | undefined) {
  const raw = internalName?.split('-')[1]
  const isKnownVariant = Object.values(AchievementVariant).includes(
    raw as AchievementVariant,
  )

  return isKnownVariant
    ? (raw as AchievementVariant)
    : AchievementVariant.BRONZE
}

export function AchievementToast({
  popup,
  onClose,
  duration = MAX_DURATION_MS,
}: IAchievementToast) {
  const [isVisible, setIsVisible] = useState(false)

  const variant = useMemo(
    () => resolveVariant(popup.internalName),
    [popup.internalName],
  )

  const style = ACHIEVEMENT_VARIANTS[variant]
  const IconComponent = style.Icon

  const confettiPieces = useMemo(() => buildConfettiPieces(variant), [variant])

  const handleDismiss = useCallback(
    (action: string) => {
      setIsVisible(false)
      const timer = setTimeout(() => onClose(action), 500)
      return () => clearTimeout(timer)
    },
    [onClose],
  )

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 50)
    const autoCloseTimer = setTimeout(() => {
      handleDismiss('auto_closed')
    }, duration)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(autoCloseTimer)
    }
  }, [duration, handleDismiss])

  if (typeof document === 'undefined') return null

  return createPortal(
    <div role="alert" aria-live="assertive" className="at-toast-viewport">
      <div
        className={cn(
          'at-toast',
          style.bg,
          style.border,
          style.glow,
          isVisible ? 'at-toast-open' : 'at-toast-closed',
        )}
      >
        <div className="at-confetti-layer">
          {isVisible &&
            confettiPieces.map((piece) => (
              <ConfettiPiece key={piece.id} piece={piece} />
            ))}
        </div>

        <div className={cn('at-shimmer-bar', style.shimmer)} />

        <div className="at-body">
          <div className="at-row">
            <div className={cn('at-icon-box', style.iconBg, style.iconRing)}>
              <IconComponent className="at-icon" />
            </div>

            <div className="at-text-col">
              <span className={cn('at-label', style.labelColor)}>
                <span className="at-label-dot" />
                {style.label}
              </span>
              <h3 className="at-title">{popup.title}</h3>
              <div
                className="at-description"
                dangerouslySetInnerHTML={{ __html: popup.body || '' }}
              />
            </div>

            <button
              onClick={() => handleDismiss('manual_closed')}
              className="group at-close-btn"
              aria-label="Fechar"
            >
              <X className="at-close-icon" />
            </button>
          </div>
        </div>

        <div className="at-progress-track">
          <div
            className={cn('at-progress-fill', style.progressBar)}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}
