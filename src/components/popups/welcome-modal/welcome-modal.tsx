'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronRight, Brain } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { IPopup } from '@/types/popup/popup'
import { Button } from '@/components/ui/button'

import './welcome-modal.css'

type IWelcomeModal = {
  popup: IPopup
  onClose: (action: string) => void
}

export function WelcomeModal({ popup, onClose }: IWelcomeModal) {
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
          className="wm-close-btn"
          aria-label="Fechar modal"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="wm-card">
          <div className="wm-grid-bg" />
          <div className="wm-glow" />

          <div className="wm-content">
            <div className="wm-icon-wrap">
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
              <span className="wm-badge-pill">Bem-vindo ao MindFlush</span>
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
              <span className="wm-button-content">
                {popup.ctaText || 'Começar Agora'}
                <span className="wm-button-icon">
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
