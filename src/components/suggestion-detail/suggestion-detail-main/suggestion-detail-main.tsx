'use client'

import { MessageCircle } from 'lucide-react'

import type { ISuggestion } from '@/types/suggestion/suggestion'
import {
  AttachmentsGrid,
  type IAttachmentPreviewTarget,
} from '@/components/suggestion-detail/suggestion-detail-main/attachments-grid/attachments-grid'
import { CommentComposer } from '@/components/suggestion-detail/suggestion-detail-main/comment-composer/comment-composer'

import './suggestion-detail-main.css'

type ISuggestionDetailMain = {
  item: ISuggestion
  onPreviewAttachment: (target: IAttachmentPreviewTarget) => void
}

export function SuggestionDetailMain({
  item,
  onPreviewAttachment,
}: ISuggestionDetailMain) {
  const hasAttachments = Boolean(item.attachments?.length)

  return (
    <div className="sdm-main">
      <div className="sdm-description">
        <p className="sdm-description-text">{item.description}</p>
      </div>

      {hasAttachments && (
        <AttachmentsGrid
          attachments={item.attachments}
          onPreview={onPreviewAttachment}
        />
      )}

      <div className="sdm-discussion">
        <div className="sdm-discussion-head">
          <MessageCircle className="size-[13px] text-muted-foreground" />
          <span className="sdm-section-label">Discussão</span>
          <span className="sdm-count-badge">0</span>
        </div>

        <CommentComposer authorName={item.psychologistName} />

        <p className="sdm-discussion-empty">
          Seja o primeiro a comentar nessa sugestão.
        </p>
      </div>
    </div>
  )
}
