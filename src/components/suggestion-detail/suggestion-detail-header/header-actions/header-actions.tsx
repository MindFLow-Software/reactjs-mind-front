'use client'

import { useState, useCallback } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Bell, Share2, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Clipboard } from '@/utils/clipboard'

import './header-actions.css'

export function HeaderActions() {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleToggleFollow = useCallback(() => setIsFollowing((v) => !v), [])
  const handleCopyLink = useCallback(
    () => Clipboard.copy(window.location.href),
    [],
  )

  const followLabel = isFollowing ? 'Parar de seguir' : 'Seguir atualizações'

  return (
    <div className="sdm-actions">
      <button
        type="button"
        title={followLabel}
        aria-label={followLabel}
        onClick={handleToggleFollow}
        className={cn(
          'sdm-action',
          isFollowing ? 'sdm-action-following' : 'sdm-action-idle',
        )}
      >
        <Bell className="size-4" />
      </button>
      <button
        type="button"
        title="Compartilhar"
        aria-label="Compartilhar"
        onClick={handleCopyLink}
        className="sdm-action sdm-action-idle"
      >
        <Share2 className="size-4" />
      </button>
      <DialogPrimitive.Close asChild>
        <button
          type="button"
          title="Fechar"
          aria-label="Fechar"
          className="sdm-action-close"
        >
          <X className="size-4" />
        </button>
      </DialogPrimitive.Close>
    </div>
  )
}
