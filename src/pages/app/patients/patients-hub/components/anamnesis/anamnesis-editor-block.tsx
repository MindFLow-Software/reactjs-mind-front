import { useRef, useEffect, memo, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IAnamnesisBlock } from './anamnesis-types'
import { useAnamnesisContext } from './anamnesis-context'
import type { SaveStatus } from './anamnesis-context'

import './anamnesis-editor-block.css'
import { countWords } from '../../helpers'

function renderSaveStatus(status: SaveStatus) {
  switch (status) {
    case 'synced':
      return (
        <>
          <Check className="ph-anamnesis-editor-block__status-check" />
          <span className="ph-anamnesis-editor-block__status-synced">
            Salvo automaticamente
          </span>
        </>
      )
    case 'pending':
      return (
        <span className="ph-anamnesis-editor-block__status-pending">
          Sincronizando...
        </span>
      )
    case 'draft':
      return (
        <span className="ph-anamnesis-editor-block__status-pending">
          Rascunho local
        </span>
      )
  }
}

interface EditorBlockProps {
  block: IAnamnesisBlock
  index: number
  isActive: boolean
}

export const AnamnesisEditorBlock = memo(function AnamnesisEditorBlock({
  block,
  index,
  isActive,
}: EditorBlockProps) {
  const {
    saveStatus,
    canDeleteBlocks,
    updateBlock,
    deleteBlock,
    setActiveBlockId,
    registerRef,
  } = useAnamnesisContext()

  const internalRef = useRef<HTMLTextAreaElement | null>(null)
  const words = countWords(block.content)

  const handleAutoResize = useCallback(() => {
    if (internalRef.current) {
      internalRef.current.style.height = 'auto'
      internalRef.current.style.height = `${internalRef.current.scrollHeight}px`
    }
  }, [])

  useEffect(() => {
    handleAutoResize()
  }, [block.content, handleAutoResize])

  return (
    <div
      className={cn(
        'ph-anamnesis-editor-block',
        isActive && 'ph-anamnesis-editor-block--active',
      )}
    >
      <div className="ph-anamnesis-editor-block__header">
        <span className="ph-anamnesis-editor-block__index">{index + 1}</span>
        <input
          type="text"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          onFocus={() => setActiveBlockId(block.id)}
          placeholder={`Seção ${index + 1}`}
          className="ph-anamnesis-editor-block__title-input"
        />
        <Button
          size="icon"
          variant="ghost"
          className="ph-anamnesis-editor-block__delete-btn"
          onClick={() => deleteBlock(block.id)}
          disabled={!canDeleteBlocks}
        >
          <Trash2 className="ph-anamnesis-editor-block__delete-icon" />
        </Button>
      </div>

      <div className="ph-anamnesis-editor-block__body">
        <Textarea
          ref={(el) => {
            internalRef.current = el
            registerRef(block.id, el)
          }}
          value={block.content}
          onFocus={() => setActiveBlockId(block.id)}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          placeholder="Queixa principal, história..."
          className="ph-anamnesis-editor-block__textarea"
          style={{ resize: 'none' }}
        />
      </div>

      <div className="ph-anamnesis-editor-block__footer">
        {renderSaveStatus(saveStatus)}
        {words > 0 && (
          <>
            <span className="ph-anamnesis-editor-block__word-sep">·</span>
            <span className="ph-anamnesis-editor-block__word-count">
              {words} {words === 1 ? 'palavra' : 'palavras'}
            </span>
          </>
        )}
      </div>
    </div>
  )
})
