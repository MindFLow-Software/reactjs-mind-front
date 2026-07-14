'use client'

import './achievement-toast.css'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IPopup } from '@/types/popup/popup'
import {
  ACHIEVEMENT_VARIANTS,
  CONFETTI_COLORS,
  type AchievementVariant,
} from './achievement-toast-variants'
import { ConfettiPiece, type ConfettiPieceData } from './confetti-piece'

interface AchievementToastProps {
  popup: IPopup
  onClose: (action: string) => void
  duration?: number
}

const CONFETTI_PIECE_COUNT = 35
const MAX_DURATION_MS = 15000

function buildConfettiPieces(variant: AchievementVariant): ConfettiPieceData[] {
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

export function AchievementToast({
  popup,
  onClose,
  duration = MAX_DURATION_MS,
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  const variant = useMemo(() => {
    const raw = popup.internalName?.split('-')[1] as AchievementVariant
    return raw && raw in ACHIEVEMENT_VARIANTS ? raw : 'bronze'
  }, [popup.internalName])

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
    <div
      role="alert"
      aria-live="assertive"
      className="fixed top-6 right-6 z-[9999] w-full max-w-[340px] pointer-events-none flex justify-end"
    >
      <div
        className={cn(
          'pointer-events-auto relative overflow-hidden w-full rounded-2xl border backdrop-blur-xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]',
          style.bg,
          style.border,
          style.glow,
          isVisible
            ? 'translate-x-0 opacity-100 scale-100 shadow-2xl'
            : 'translate-x-12 opacity-0 scale-95',
        )}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {isVisible &&
            confettiPieces.map((p) => <ConfettiPiece key={p.id} {...p} />)}
        </div>

        <div className={cn('at-shimmer-bar', style.shimmer)} />

        <div className="relative p-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-lg',
                style.iconBg,
                style.iconRing,
              )}
            >
              <IconComponent className="h-6 w-6 text-white drop-shadow-md" />
            </div>

            <div className="flex flex-col flex-1 min-w-0 gap-1">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-black/5 dark:bg-white/10 w-fit',
                  style.labelColor,
                )}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                {style.label}
              </span>
              <h3 className="font-bold text-sm text-foreground leading-tight">
                {popup.title}
              </h3>
              <div
                className="text-xs text-muted-foreground leading-relaxed line-clamp-2"
                dangerouslySetInnerHTML={{ __html: popup.body || '' }}
              />
            </div>

            <button
              onClick={() => handleDismiss('manual_closed')}
              className="shrink-0 p-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-black/5 transition-all cursor-pointer group"
              aria-label="Fechar"
            >
              <X className="h-4 w-4 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </div>

        <div className="h-1 bg-black/5 dark:bg-white/5">
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
