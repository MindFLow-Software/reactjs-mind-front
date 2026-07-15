'use client'

import type { ChangeEvent } from 'react'
import { useState, useCallback } from 'react'
import { AtSign, Bold, Paperclip } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { SuggestionInitialsAvatar } from '@/components/suggestion-detail/suggestion-initials-avatar/suggestion-initials-avatar'

import './comment-composer.css'

type ICommentComposer = {
  authorName: string | null
}

export function CommentComposer({ authorName }: ICommentComposer) {
  const [comment, setComment] = useState('')

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => setComment(event.target.value),
    [],
  )

  const isEmpty = comment.length === 0

  return (
    <div className="sdm-composer-row">
      <SuggestionInitialsAvatar name={authorName} size="lg" />
      <div className="sdm-composer">
        <Textarea
          value={comment}
          onChange={handleChange}
          placeholder="Adicione um comentário..."
          className="sdm-composer-input"
        />
        <div className="sdm-composer-toolbar">
          <button type="button" title="Mencionar" className="sdm-composer-tool">
            <AtSign className="size-3.5" />
          </button>
          <button type="button" title="Anexar" className="sdm-composer-tool">
            <Paperclip className="size-3.5" />
          </button>
          <button type="button" title="Negrito" className="sdm-composer-tool">
            <Bold className="size-3.5" />
          </button>
          <span className="sdm-composer-hint">Markdown suportado</span>
          <div className="sdm-composer-spacer" />
          <button
            type="button"
            disabled={isEmpty}
            className={cn(
              'sdm-composer-submit',
              isEmpty
                ? 'sdm-composer-submit-idle'
                : 'sdm-composer-submit-ready',
            )}
          >
            Comentar
          </button>
        </div>
      </div>
    </div>
  )
}
