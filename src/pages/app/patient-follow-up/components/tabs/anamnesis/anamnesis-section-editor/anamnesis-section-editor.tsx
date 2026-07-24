import { useRef, useEffect, memo, useCallback, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Trash2, Check, Copy, GripVertical } from 'lucide-react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { Clipboard } from '@/utils/clipboard'
import { MarkdownContent } from '@/components/markdown-content/markdown-content'
import type { IAnamnesisSection } from '@/types/clinical/anamnesis-section'
import { AnamnesisSaveStatus, useAnamnesisContext } from '../anamnesis-context'

import './anamnesis-section-editor.css'
import { countWords } from '../../../../helpers'

function renderSaveStatus(status: AnamnesisSaveStatus) {
  switch (status) {
    case AnamnesisSaveStatus.SYNCED:
      return (
        <>
          <Check className="ph-anamnesis-section-editor__status-check" />
          <span className="ph-anamnesis-section-editor__status-synced">
            Salvo automaticamente
          </span>
        </>
      )
    case AnamnesisSaveStatus.PENDING:
      return (
        <span className="ph-anamnesis-section-editor__status-pending">
          Sincronizando...
        </span>
      )
    case AnamnesisSaveStatus.DRAFT:
      return (
        <span className="ph-anamnesis-section-editor__status-pending">
          Rascunho local
        </span>
      )
  }
}

type IAnamnesisSectionEditor = {
  section: IAnamnesisSection
  index: number
  isActive: boolean
}

export const AnamnesisSectionEditor = memo(function AnamnesisSectionEditor({
  section,
  index,
  isActive,
}: IAnamnesisSectionEditor) {
  const {
    saveStatus,
    canDeleteSections,
    updateSection,
    deleteSection,
    setActiveSectionId,
    registerRef,
  } = useAnamnesisContext()

  const internalRef = useRef<HTMLTextAreaElement | null>(null)
  const words = countWords(section.content)
  const [mode, setMode] = useState('edit')

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id })

  const sortableStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleCopy = useCallback(() => {
    Clipboard.copy(section.content)
  }, [section.content])

  const handleAutoResize = useCallback(() => {
    if (internalRef.current) {
      internalRef.current.style.height = 'auto'
      internalRef.current.style.height = `${internalRef.current.scrollHeight}px`
    }
  }, [])

  useEffect(() => {
    handleAutoResize()
  }, [section.content, handleAutoResize])

  return (
    <div
      ref={setNodeRef}
      style={sortableStyle}
      className={cn(
        'ph-anamnesis-section-editor',
        isActive && 'ph-anamnesis-section-editor--active',
        isDragging && 'ph-anamnesis-section-editor--dragging',
      )}
    >
      <div className="ph-anamnesis-section-editor__header">
        <button
          type="button"
          className="ph-anamnesis-section-editor__drag-handle"
          aria-label="Reordenar seção"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="ph-anamnesis-section-editor__drag-icon" />
        </button>
        <span className="ph-anamnesis-section-editor__index">{index + 1}</span>
        <input
          type="text"
          value={section.title}
          onChange={(e) => updateSection(section.id, { title: e.target.value })}
          onFocus={() => setActiveSectionId(section.id)}
          placeholder={`Seção ${index + 1}`}
          className="ph-anamnesis-section-editor__title-input"
        />
        <Button
          size="icon"
          variant="ghost"
          className="ph-anamnesis-section-editor__copy-btn"
          onClick={handleCopy}
          disabled={!section.content.trim()}
          aria-label="Copiar conteúdo da seção"
        >
          <Copy className="ph-anamnesis-section-editor__copy-icon" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="ph-anamnesis-section-editor__delete-btn"
          onClick={() => deleteSection(section.id)}
          disabled={!canDeleteSections}
          aria-label="Excluir seção"
        >
          <Trash2 className="ph-anamnesis-section-editor__delete-icon" />
        </Button>
      </div>

      <div className="ph-anamnesis-section-editor__body">
        <Tabs
          value={mode}
          onValueChange={setMode}
          className="ph-anamnesis-section-editor__tabs"
        >
          <TabsList className="ph-anamnesis-section-editor__tabs-list">
            <TabsTrigger value="edit">Editar</TabsTrigger>
            <TabsTrigger value="preview">Pré-visualizar</TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <Textarea
              ref={(el) => {
                internalRef.current = el
                registerRef(section.id, el)
              }}
              value={section.content}
              onFocus={() => setActiveSectionId(section.id)}
              onChange={(e) =>
                updateSection(section.id, { content: e.target.value })
              }
              placeholder="Queixa principal, história..."
              className="ph-anamnesis-section-editor__textarea"
              style={{ resize: 'none' }}
            />
          </TabsContent>

          <TabsContent value="preview">
            <MarkdownContent
              content={section.content}
              className="ph-anamnesis-section-editor__preview"
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="ph-anamnesis-section-editor__footer">
        {renderSaveStatus(saveStatus)}
        {words > 0 && (
          <>
            <span className="ph-anamnesis-section-editor__word-sep">·</span>
            <span className="ph-anamnesis-section-editor__word-count">
              {words} {words === 1 ? 'palavra' : 'palavras'}
            </span>
          </>
        )}
      </div>
    </div>
  )
})
