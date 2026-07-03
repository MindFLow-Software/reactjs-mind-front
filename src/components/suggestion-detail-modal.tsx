'use client'

import { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Link2, MessageCircle, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ISuggestion } from '@/types/suggestion'
import { DialogPortal, DialogOverlay } from '@/components/ui/dialog'
import { copyToClipboard } from '@/utils/copy-to-clipboard'
import { SuggestionDetailBanner } from '@/components/suggestion-detail-banner'
import { SuggestionDetailHeader } from '@/components/suggestion-detail-header'
import { SuggestionDetailMain } from '@/components/suggestion-detail-main'
import { SuggestionDetailSidebar } from '@/components/suggestion-detail-sidebar'
import { SuggestionAttachmentPreview } from '@/components/suggestion-attachment-preview'
import './suggestion-detail-modal.css'

interface SuggestionDetailModalContentProps {
  item: ISuggestion
  userId?: string
  onLike: (id: string) => void
}

export function SuggestionDetailModalContent({
  item,
  userId,
  onLike,
}: SuggestionDetailModalContentProps) {
  const [previewItem, setPreviewItem] = useState<{
    url: string
    name: string
  } | null>(null)

  const handleCopyLink = () => copyToClipboard(window.location.href)

  return (
    <DialogPortal>
      <DialogOverlay className="bg-[rgba(15,52,100,0.45)] backdrop-blur-[4px]" />
      <DialogPrimitive.Content
        aria-labelledby="dm-title"
        className="sdm-content"
      >
        <SuggestionDetailBanner
          status={item.status}
          shortId={item.id.slice(-4).toUpperCase()}
        />

        <SuggestionDetailHeader item={item} userId={userId} onLike={onLike} />

        <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden">
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
          <div className="flex-1" />
          <button
            type="button"
            className={cn(
              'sdm-footer-action',
              'text-red-500/70 hover:text-red-600',
            )}
          >
            <TriangleAlert className="size-3.5" />
            <span>Reportar</span>
          </button>
        </div>

        {previewItem && (
          <SuggestionAttachmentPreview
            preview={previewItem}
            onClose={() => setPreviewItem(null)}
          />
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}
