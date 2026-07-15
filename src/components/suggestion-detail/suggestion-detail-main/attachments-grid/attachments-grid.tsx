'use client'

import type { SyntheticEvent } from 'react'
import { useCallback } from 'react'
import { Eye, Paperclip } from 'lucide-react'

import { Files } from '@/utils/files'

import './attachments-grid.css'

export type IAttachmentPreviewTarget = {
  url: string
  name: string
}

type IAttachmentsGrid = {
  attachments: string[]
  onPreview: (target: IAttachmentPreviewTarget) => void
}

function hideBrokenImage(event: SyntheticEvent<HTMLImageElement>) {
  event.currentTarget.style.display = 'none'
}

export function AttachmentsGrid({ attachments, onPreview }: IAttachmentsGrid) {
  const handlePreview = useCallback(
    (name: string) => onPreview({ url: Files.attachmentUrl(name), name }),
    [onPreview],
  )

  return (
    <div className="sdm-attachments">
      <div className="sdm-attachments-head">
        <Paperclip className="size-[13px] text-muted-foreground" />
        <span className="sdm-section-label">Anexos</span>
        <span className="sdm-count-badge">{attachments.length}</span>
      </div>
      <div className="sdm-attachments-grid">
        {attachments.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => handlePreview(name)}
            className="sdm-attachment group"
          >
            <img
              src={Files.attachmentUrl(name)}
              alt={name}
              className="sdm-attachment-img"
              onError={hideBrokenImage}
            />
            <div className="sdm-attachment-overlay">
              <Eye className="sdm-attachment-eye" />
            </div>
            <div className="sdm-attachment-caption">
              <span className="sdm-attachment-name">{name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
