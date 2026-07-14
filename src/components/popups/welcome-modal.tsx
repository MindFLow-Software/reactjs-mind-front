'use client'

import './welcome-modal.css'
import { useState, useEffect, useCallback } from 'react'
import { X, ChevronRight, Brain } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { IPopup } from '@/types/popup/popup'
import { cn } from '@/lib/utils'

interface WelcomeModalProps {
  popup: IPopup
  onClose: (action: string) => void
}

export function WelcomeModal({ popup, onClose }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(
    (action: string) => {
      setIsOpen(false)
      setTimeout(() => {
        onClose(action)
      }, 300)
    },
    [onClose],
  )

  const handleCTA = useCallback(() => handleClose('cta_clicked'), [handleClose])

  return (
    <div
      className={cn(
        'wm-overlay',
        isOpen ? 'wm-overlay-open' : 'wm-overlay-closed',
      )}
    >
      <div
        className={cn(
          'wm-container',
          isOpen ? 'wm-container-open' : 'wm-container-closed',
        )}
      >
        <button
          onClick={() => handleClose('closed')}
          className="cursor-pointer absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Fechar modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/10">
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage: `
                                linear-gradient(to right, var(--welcome-grid-line) 1px, transparent 1px),
                                linear-gradient(to bottom, var(--welcome-grid-line) 1px, transparent 1px)
                            `,
              backgroundSize: '28px 28px',
            }}
          />

          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-sky-300/80 via-blue-300/55 to-transparent rounded-t-xl" />

          <div className="relative px-8 py-10 sm:px-10 sm:py-12">
            <div className="mb-6 flex justify-center">
              <div
                className={cn(
                  'wm-icon-box',
                  isOpen ? 'wm-icon-box-open' : 'wm-icon-box-closed',
                )}
              >
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div
              className={cn(
                'wm-badge',
                isOpen ? 'wm-badge-open' : 'wm-badge-closed',
              )}
            >
              <span className="inline-flex items-center rounded-full bg-white px-4 py-1.5 text-xs font-medium text-slate-500 border border-slate-100 shadow-sm">
                Bem-vindo ao MindFlush
              </span>
            </div>

            <h1
              className={cn(
                'wm-title',
                isOpen ? 'wm-title-open' : 'wm-title-closed',
              )}
            >
              {popup.title}
            </h1>

            <div
              className={cn(
                'wm-body',
                isOpen ? 'wm-body-open' : 'wm-body-closed',
              )}
              dangerouslySetInnerHTML={{ __html: popup.body || '' }}
            />

            <Button
              onClick={handleCTA}
              size="lg"
              className={cn(
                'group wm-button',
                isOpen ? 'wm-button-open' : 'wm-button-closed',
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {popup.ctaText || 'Começar Agora'}
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ChevronRight className="h-4 w-4" />
                </span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
