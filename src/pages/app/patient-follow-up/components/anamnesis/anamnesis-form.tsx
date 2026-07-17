import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

import { AnamnesisHeader } from './anamnesis-header'
import { AnamnesisToolbar } from './anamnesis-toolbar'
import { AnamnesisEditorBlock } from './anamnesis-editor-block'
import { AnamnesisSkeleton } from './anamnesis-skeleton'
import { AnamnesisNavigation } from './anamnesis-navigation'
import { AnamnesisEditorContext } from './anamnesis-context'
import type { SaveStatus } from './anamnesis-context'

import { useAnamnesisEditor } from '../../hooks/use-anamnesis-editor'
import { countWords } from '../../helpers'

function resolveSaveStatus(
  isPending: boolean,
  hasLocalDraft: boolean,
): SaveStatus {
  if (isPending) return 'pending'
  if (hasLocalDraft) return 'draft'
  return 'synced'
}

export function AnamnesisForm({
  patientId,
  patientName,
}: {
  patientId: string
  patientName: string
}) {
  const {
    blocks,
    activeBlockId,
    hasLocalDraft,
    hydrated,
    isPending,
    isExporting,
    pdfExportedSuccessfully,
    copied,
    content,
    setActiveBlockId,
    updateBlock,
    addBlock,
    deleteBlock,
    exportToPdf,
    onCopy,
  } = useAnamnesisEditor({ patientId, patientName })

  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})
  const prevBlockCount = useRef(blocks.length)

  const saveStatus = resolveSaveStatus(isPending, hasLocalDraft)

  const handleApplyFormat = useCallback(
    (marker: string) => {
      const targetId = activeBlockId || blocks[0]?.id
      const textarea = textareaRefs.current[targetId!]
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const cur = textarea.value
      const selected = cur.slice(start, end)

      const next = `${cur.slice(0, start)}${marker}${selected}${marker}${cur.slice(end)}`
      updateBlock(targetId!, { content: next })

      requestAnimationFrame(() => {
        textarea.focus()
        const cursor = selected
          ? end + marker.length * 2
          : start + marker.length
        textarea.setSelectionRange(cursor, cursor)
      })
    },
    [activeBlockId, blocks, updateBlock],
  )

  const jumpToBlock = useCallback(
    (id: string) => {
      setActiveBlockId(id)
      textareaRefs.current[id]?.focus()
      textareaRefs.current[id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    },
    [setActiveBlockId],
  )

  const sections = useMemo(
    () =>
      blocks.map((b, i) => ({
        id: b.id,
        label: b.title || `Seção ${i + 1}`,
        wordCount: countWords(b.content),
      })),
    [blocks],
  )

  const contextValue = useMemo(
    () => ({
      saveStatus,
      canDeleteBlocks: blocks.length > 1,
      activeBlockId,
      sections,
      updateBlock,
      deleteBlock,
      setActiveBlockId,
      jumpToBlock,
      onCopy,
      registerRef: (id: string, el: HTMLTextAreaElement | null) => {
        textareaRefs.current[id] = el
      },
      onFormat: handleApplyFormat,
    }),
    [
      saveStatus,
      blocks.length,
      activeBlockId,
      sections,
      updateBlock,
      deleteBlock,
      setActiveBlockId,
      jumpToBlock,
      handleApplyFormat,
      onCopy,
    ],
  )

  useEffect(() => {
    if (blocks.length > prevBlockCount.current) {
      const newId = blocks[blocks.length - 1].id
      setTimeout(() => {
        textareaRefs.current[newId]?.focus()
        textareaRefs.current[newId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 50)
    }
    prevBlockCount.current = blocks.length
  }, [blocks])

  if (!hydrated) return <AnamnesisSkeleton />

  return (
    <AnamnesisEditorContext.Provider value={contextValue}>
      <div className="w-full flex flex-col gap-4">
        <AnamnesisHeader
          pdf={{
            isExporting,
            exportedSuccessfully: pdfExportedSuccessfully,
            isCopyDisabled: !content.trim(),
            copied,
            onGeneratePDF: exportToPdf,
            onCopy,
          }}
        />

        <AnamnesisToolbar />

        <div className="flex items-start gap-4">
          <AnamnesisNavigation />

          <div className="flex-1 min-w-0 flex flex-col gap-3">
            {blocks.map((block, index) => (
              <AnamnesisEditorBlock
                key={block.id}
                block={block}
                index={index}
                isActive={activeBlockId === block.id}
              />
            ))}

            <Button
              size="sm"
              onClick={addBlock}
              variant="outline"
              className="w-full cursor-pointer border-dashed text-muted-foreground hover:text-foreground hover:border-border"
            >
              <Plus className="mr-1.5 size-4" /> Novo bloco
            </Button>
          </div>
        </div>
      </div>
    </AnamnesisEditorContext.Provider>
  )
}
