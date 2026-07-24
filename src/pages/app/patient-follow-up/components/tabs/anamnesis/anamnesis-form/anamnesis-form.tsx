import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

// import { AnamnesisHeaderActions } from '../anamnesis-header-actions'
import { AnamnesisToolbar } from '../anamnesis-toolbar/anamnesis-toolbar'
import { AnamnesisSectionEditor } from '../anamnesis-section-editor/anamnesis-section-editor'
import { AnamnesisSkeleton } from '../anamnesis-skeleton/anamnesis-skeleton'
import { AnamnesisNavigation } from '../anamnesis-navigation/anamnesis-navigation'
import { AnamnesisPublishBar } from '../anamnesis-publish-bar/anamnesis-publish-bar'
import {
  AnamnesisEditorContext,
  AnamnesisSaveStatus,
} from '../anamnesis-context'

import { useAnamnesisEditor } from '../../../../hooks/use-anamnesis-editor'
import { countWords } from '../../../../helpers'
import { TabCard } from '../../tab-card/tab-card'

import './anamnesis-form.css'

function resolveSaveStatus(
  isPending: boolean,
  hasLocalDraft: boolean,
): AnamnesisSaveStatus {
  if (isPending) return AnamnesisSaveStatus.PENDING
  if (hasLocalDraft) return AnamnesisSaveStatus.DRAFT
  return AnamnesisSaveStatus.SYNCED
}

type IAnamnesisForm = {
  patientProfileId: string
  patientName: string
}

export function AnamnesisForm({
  patientProfileId,
  patientName,
}: IAnamnesisForm) {
  const {
    sections,
    activeSectionId,
    hasLocalDraft,
    hydrated,
    isPending,
    isDraft,
    canPublish,
    setActiveSectionId,
    updateSection,
    addSection,
    deleteSection,
    reorderSections,
    onPublish,
  } = useAnamnesisEditor({ patientProfileId, patientName })

  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})
  const prevSectionCount = useRef(sections.length)

  const saveStatus = resolveSaveStatus(isPending, hasLocalDraft)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = sections.findIndex((section) => section.id === active.id)
      const newIndex = sections.findIndex((section) => section.id === over.id)
      if (oldIndex === -1 || newIndex === -1) return

      const reordered = arrayMove(sections, oldIndex, newIndex)
      reorderSections(reordered.map((section) => section.id))
    },
    [sections, reorderSections],
  )

  const handleApplyFormat = useCallback(
    (marker: string) => {
      const targetId = activeSectionId || sections[0]?.id
      const textarea = textareaRefs.current[targetId!]
      if (!textarea) return

      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const cur = textarea.value
      const selected = cur.slice(start, end)

      const next = `${cur.slice(0, start)}${marker}${selected}${marker}${cur.slice(end)}`
      updateSection(targetId!, { content: next })

      requestAnimationFrame(() => {
        textarea.focus()
        const cursor = selected
          ? end + marker.length * 2
          : start + marker.length
        textarea.setSelectionRange(cursor, cursor)
      })
    },
    [activeSectionId, sections, updateSection],
  )

  const jumpToSection = useCallback(
    (id: string) => {
      setActiveSectionId(id)
      textareaRefs.current[id]?.focus()
      textareaRefs.current[id]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    },
    [setActiveSectionId],
  )

  const navSections = useMemo(
    () =>
      sections.map((section, index) => ({
        id: section.id,
        label: section.title || `Seção ${index + 1}`,
        wordCount: countWords(section.content),
      })),
    [sections],
  )

  const contextValue = useMemo(
    () => ({
      saveStatus,
      canDeleteSections: sections.length > 1,
      activeSectionId,
      sections: navSections,
      isDraft,
      canPublish,
      updateSection,
      deleteSection,
      setActiveSectionId,
      jumpToSection,
      reorderSections,
      onPublish,
      registerRef: (id: string, el: HTMLTextAreaElement | null) => {
        textareaRefs.current[id] = el
      },
      onFormat: handleApplyFormat,
    }),
    [
      saveStatus,
      sections.length,
      activeSectionId,
      navSections,
      isDraft,
      canPublish,
      updateSection,
      deleteSection,
      setActiveSectionId,
      jumpToSection,
      reorderSections,
      onPublish,
      handleApplyFormat,
    ],
  )

  useEffect(() => {
    if (sections.length > prevSectionCount.current) {
      const newId = sections[sections.length - 1].id
      setTimeout(() => {
        textareaRefs.current[newId]?.focus()
        textareaRefs.current[newId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 50)
    }
    prevSectionCount.current = sections.length
  }, [sections])

  if (!hydrated) return <AnamnesisSkeleton />

  return (
    <AnamnesisEditorContext.Provider value={contextValue}>
      <TabCard
        title="Anamnese"
        description="Seções editáveis com salvamento automático e rascunho local."
      >
        <AnamnesisToolbar />

        <AnamnesisPublishBar
          isDraft={isDraft}
          canPublish={canPublish}
          isPending={isPending}
          onPublish={onPublish}
        />

        <div className="af-layout">
          <AnamnesisNavigation />

          <div className="af-content">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <SortableContext
                items={sections.map((section) => section.id)}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((section, index) => (
                  <AnamnesisSectionEditor
                    key={section.id}
                    section={section}
                    index={index}
                    isActive={activeSectionId === section.id}
                  />
                ))}
              </SortableContext>
            </DndContext>

            <Button
              size="sm"
              onClick={addSection}
              variant="outline"
              className="af-add-btn"
            >
              <Plus className="mr-1.5 size-4" /> Nova seção
            </Button>
          </div>
        </div>
      </TabCard>
    </AnamnesisEditorContext.Provider>
  )
}
