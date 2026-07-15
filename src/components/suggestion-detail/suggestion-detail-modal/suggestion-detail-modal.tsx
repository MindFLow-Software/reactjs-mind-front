'use client'

import { useState, useCallback } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Link2, MessageCircle, TriangleAlert } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Clipboard } from '@/utils/clipboard'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import { DialogPortal, DialogOverlay } from '@/components/ui/dialog'
import { SuggestionDetailBanner } from '@/components/suggestion-detail/suggestion-detail-banner/suggestion-detail-banner'
import { SuggestionDetailHeader } from '@/components/suggestion-detail/suggestion-detail-header/suggestion-detail-header'
import { SuggestionDetailMain } from '@/components/suggestion-detail/suggestion-detail-main/suggestion-detail-main'
import { SuggestionDetailSidebar } from '@/components/suggestion-detail/suggestion-detail-sidebar/suggestion-detail-sidebar'
import { SuggestionAttachmentPreview } from '@/components/suggestion-detail/suggestion-attachment-preview/suggestion-attachment-preview'
import type { IAttachmentPreviewTarget } from '@/components/suggestion-detail/suggestion-detail-main/attachments-grid/attachments-grid'

import './suggestion-detail-modal.css'

type ISuggestionDetailModalContent = {
  item: ISuggestion
  userId?: string
  onLike: (id: string) => void
}

export function SuggestionDetailModalContent({
  item,
  userId,
  onLike,
}: ISuggestionDetailModalContent) {
  const [previewItem, setPreviewItem] =
    useState<IAttachmentPreviewTarget | null>(null)

  const handleCopyLink = useCallback(
    () => Clipboard.copy(window.location.href),
    [],
  )
  const handleClosePreview = useCallback(() => setPreviewItem(null), [])

  return (
    <DialogPortal>
      <DialogOverlay className="sdm-overlay" />
      <DialogPrimitive.Content
        aria-labelledby="dm-title"
        className="sdm-content"
      >
        <SuggestionDetailBanner
          status={item.status}
          shortId={item.id.slice(-4).toUpperCase()}
        />

        <SuggestionDetailHeader item={item} userId={userId} onLike={onLike} />

        <div className="sdm-body">
          <SuggestionDetailMain
            item={item}
            onPreviewAttachment={setPreviewItem}
          />
          <SuggestionDetailSidebar item={item} />
        </div>

        <div className="sdm-footer">
          <button
            type="button"
            onClick={handleCopyLink}
            className="sdm-footer-action"
          >
            <Link2 className="size-3.5" />
            <span>Copiar link</span>
          </button>
          <button type="button" className="sdm-footer-action">
            <MessageCircle className="size-3.5" />
            <span>Discutir no canal</span>
          </button>
          <div className="sdm-footer-spacer" />
          <button
            type="button"
            className={cn('sdm-footer-action', 'sdm-footer-action-danger')}
          >
            <TriangleAlert className="size-3.5" />
            <span>Reportar</span>
          </button>
        </div>

        {previewItem && (
          <SuggestionAttachmentPreview
            preview={previewItem}
            onClose={handleClosePreview}
          />
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
