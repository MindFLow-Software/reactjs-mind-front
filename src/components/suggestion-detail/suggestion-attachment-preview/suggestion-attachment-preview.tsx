'use client'

import type { SyntheticEvent } from 'react'
import { X } from 'lucide-react'

import type { IAttachmentPreviewTarget } from '@/components/suggestion-detail/suggestion-detail-main/attachments-grid/attachments-grid'

import './suggestion-attachment-preview.css'

type ISuggestionAttachmentPreview = {
  preview: IAttachmentPreviewTarget
  onClose: () => void
}

function hideBrokenImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = 'none'
}

export function SuggestionAttachmentPreview({
  preview,
  onClose,
}: ISuggestionAttachmentPreview) {
  return (
    <div className="sdm-preview">
      <div className="sdm-preview-head">
        <p className="sdm-preview-name" title={preview.name}>
          {preview.name}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar visualização"
          className="sdm-preview-close"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="sdm-preview-rule" />
      <div className="sdm-preview-body">
        <img
          src={preview.url}
          alt={preview.name}
          className="sdm-preview-img"
          onError={hideBrokenImage}
        />
      </div>
      <div className="sdm-preview-foot">
        <button type="button" onClick={onClose} className="sdm-preview-dismiss">
          Fechar
        </button>
      </div>
    </div>
  )
}
