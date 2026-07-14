'use client'

import { useState } from 'react'
import { MessageCircle, Paperclip, AtSign, Bold, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ISuggestion } from '@/types/suggestion/suggestion'
import { Textarea } from '@/components/ui/textarea'
import { buildAttachmentUrl } from '@/components/suggestion-detail-config'
import { Normalizer } from '@/utils/normalizer'
import './suggestion-detail-main.css'

interface AttachmentPreviewTarget {
  url: string
  name: string
}

interface SuggestionDetailMainProps {
  item: ISuggestion
  onPreviewAttachment: (target: AttachmentPreviewTarget) => void
}

export function SuggestionDetailMain({
  item,
  onPreviewAttachment,
}: SuggestionDetailMainProps) {
  const [comment, setComment] = useState('')
  const initials = Normalizer.initials(item.psychologistName)

  return (
    <div className="sdm-main">
      <div className="sdm-description">
        <p className="text-[14px] leading-[1.6] text-slate-800 dark:text-foreground whitespace-pre-wrap break-words">
          {item.description}
        </p>
      </div>

      {item.attachments && item.attachments.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5">
            <Paperclip className="size-[13px] text-muted-foreground" />
            <span className="sdm-section-label">Anexos</span>
            <span className="sdm-count-badge">{item.attachments.length}</span>
          </div>
          <div className="sdm-attachments-grid">
            {item.attachments.map((att) => (
              <button
                key={att}
                type="button"
                onClick={() =>
                  onPreviewAttachment({
                    url: buildAttachmentUrl(att),
                    name: att,
                  })
                }
                className="sdm-attachment group"
              >
                <img
                  src={buildAttachmentUrl(att)}
                  alt={att}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <Eye className="size-5 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                </div>
                <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-black/70 to-transparent flex items-end px-2 pb-1">
                  <span className="text-[10px] text-white font-medium truncate">
                    {att}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1.5">
          <MessageCircle className="size-[13px] text-muted-foreground" />
          <span className="sdm-section-label">Discussão</span>
          <span className="sdm-count-badge">0</span>
        </div>

        <div className="flex gap-2.5">
          <div className="sdm-composer-avatar">{initials}</div>
          <div className="sdm-composer">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Adicione um comentário..."
              className="resize-none min-h-[64px] max-h-[120px] border-none shadow-none focus-visible:ring-0 text-[13px] bg-transparent"
            />
            <div className="flex items-center gap-2 px-3 py-2 border-t border-border bg-muted/30">
              <button
                type="button"
                title="Mencionar"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <AtSign className="size-3.5" />
              </button>
              <button
                type="button"
                title="Anexar"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Paperclip className="size-3.5" />
              </button>
              <button
                type="button"
                title="Negrito"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bold className="size-3.5" />
              </button>
              <span className="text-[11px] text-muted-foreground ml-1 hidden sm:block">
                Markdown suportado
              </span>
              <div className="flex-1" />
              <button
                type="button"
                disabled={comment.length === 0}
                className={cn(
                  'text-[12px] font-semibold px-3 py-1 rounded-lg bg-blue-600 text-white',
                  comment.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700 cursor-pointer transition-colors',
                )}
              >
                Comentar
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-[12px] text-muted-foreground py-6 italic">
          Seja o primeiro a comentar nessa sugestão.
        </p>
      </div>
    </div>
  )
}
