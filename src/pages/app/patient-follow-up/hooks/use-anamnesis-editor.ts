import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'

import { AnamnesisPDFTemplate } from '@/templates/pdf/anamnesis-pdf-template'
import type { IAnamnesisSection } from '@/types/clinical/anamnesis-section'
import { saveAnamnesisSchema } from '@/validators/clinical/http/save-anamnesis-schema'

import {
  buildSectionsFromAnamnesis,
  emptySection,
  fingerprintSections,
  toSaveBody,
} from '../components/tabs/anamnesis/anamnesis-utils'
import { usePdfExport } from './use-pdf-export'
import { useAnamnesisDraft } from './use-anamnesis-draft'
import { useAnamnesis } from './use-anamnesis'
import { useSaveAnamnesis } from './use-save-anamnesis'
import { useDebounce } from '@/hooks/use-debounce'
import { Clipboard } from '@/utils/clipboard'
import { Time } from '@/utils/time'
import { Normalizer } from '@/utils/normalizer'

type IAnamnesisEditorState = {
  sections: IAnamnesisSection[]
  activeSectionId: string | null
  isDraft: boolean
  hydrated: boolean
  hasLocalDraft: boolean
}

type IAnamnesisEditorAction =
  | {
      type: 'HYDRATE'
      sections: IAnamnesisSection[]
      isDraft: boolean
      hasLocalDraft: boolean
    }
  | { type: 'SET_ACTIVE_SECTION'; id: string | null }
  | { type: 'UPDATE_SECTION'; id: string; updates: Partial<IAnamnesisSection> }
  | { type: 'ADD_SECTION'; section: IAnamnesisSection }
  | { type: 'DELETE_SECTION'; id: string }
  | { type: 'REORDER_SECTIONS'; ids: string[] }
  | { type: 'RECONCILE_IDS'; serverSections: IAnamnesisSection[] }
  | { type: 'SET_IS_DRAFT'; value: boolean }
  | { type: 'DISCARD_DRAFT'; sections: IAnamnesisSection[] }
  | { type: 'SET_HAS_LOCAL_DRAFT'; value: boolean }

const INITIAL_EDITOR_STATE: IAnamnesisEditorState = {
  sections: [],
  activeSectionId: null,
  isDraft: true,
  hydrated: false,
  hasLocalDraft: false,
}

function editorReducer(
  state: IAnamnesisEditorState,
  action: IAnamnesisEditorAction,
): IAnamnesisEditorState {
  switch (action.type) {
    case 'HYDRATE':
      return {
        sections: action.sections,
        activeSectionId: action.sections[0]?.id ?? null,
        isDraft: action.isDraft,
        hydrated: true,
        hasLocalDraft: action.hasLocalDraft,
      }
    case 'SET_ACTIVE_SECTION':
      if (state.activeSectionId === action.id) return state
      return { ...state, activeSectionId: action.id }
    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.id
            ? { ...section, ...action.updates }
            : section,
        ),
      }
    case 'ADD_SECTION':
      return {
        ...state,
        sections: [...state.sections, action.section],
        activeSectionId: action.section.id,
      }
    case 'DELETE_SECTION':
      if (state.sections.length <= 1) return state
      return {
        ...state,
        sections: state.sections.filter((section) => section.id !== action.id),
      }
    case 'REORDER_SECTIONS': {
      const byId = new Map(
        state.sections.map((section) => [section.id, section]),
      )
      const sections = action.ids
        .map((id) => byId.get(id))
        .filter((section): section is IAnamnesisSection => Boolean(section))
      if (sections.length !== state.sections.length) return state
      return { ...state, sections }
    }
    case 'RECONCILE_IDS': {
      const idMap = new Map<string, string>()
      let changed = false
      const sections = state.sections.map((section, index) => {
        const serverId = action.serverSections[index]?.id
        if (serverId && serverId !== section.id) {
          idMap.set(section.id, serverId)
          changed = true
          return { ...section, id: serverId }
        }
        return section
      })
      if (!changed) return state
      const activeSectionId =
        state.activeSectionId && idMap.has(state.activeSectionId)
          ? idMap.get(state.activeSectionId)!
          : state.activeSectionId
      return { ...state, sections, activeSectionId }
    }
    case 'SET_IS_DRAFT':
      if (state.isDraft === action.value) return state
      return { ...state, isDraft: action.value }
    case 'DISCARD_DRAFT':
      return { ...state, sections: action.sections, hasLocalDraft: false }
    case 'SET_HAS_LOCAL_DRAFT':
      if (state.hasLocalDraft === action.value) return state
      return { ...state, hasLocalDraft: action.value }
  }
}

type IUseAnamnesisEditorOptions = {
  patientProfileId: string
  patientName?: string
}

type IUseAnamnesisEditorReturn = {
  sections: IAnamnesisSection[]
  activeSectionId: string | null
  hasLocalDraft: boolean
  hydrated: boolean
  isPending: boolean
  isDraft: boolean
  canPublish: boolean
  copied: boolean
  isExporting: boolean
  pdfExportedSuccessfully: boolean
  content: string
  setActiveSectionId: (id: string | null) => void
  updateSection: (id: string, updates: Partial<IAnamnesisSection>) => void
  addSection: () => void
  deleteSection: (id: string) => void
  reorderSections: (ids: string[]) => void
  discardDraft: () => void
  onPublish: () => void
  onCopy: () => Promise<void>
  exportToPdf: () => Promise<void>
}

export function useAnamnesisEditor({
  patientProfileId,
  patientName = '',
}: IUseAnamnesisEditorOptions): IUseAnamnesisEditorReturn {
  const { debounce, cancel } = useDebounce()
  const { read, write, clear } = useAnamnesisDraft()

  const [copied, setCopied] = useState(false)
  const [
    { sections, activeSectionId, isDraft, hydrated, hasLocalDraft },
    dispatch,
  ] = useReducer(editorReducer, INITIAL_EDITOR_STATE)

  const {
    isExporting,
    pdfExportedSuccessfully,
    exportToPdf: exportPdfDoc,
  } = usePdfExport({
    receivedFilename: `Anamnese-${Normalizer.toKebabCase(patientName) ?? patientProfileId}.pdf`,
  })

  const lastPersistedFingerprint = useRef('')
  const serverIdsRef = useRef<Set<string>>(new Set())
  const serverSectionsRef = useRef<IAnamnesisSection[]>([])
  const hydratedForRef = useRef<string | null>(null)

  const { anamnesis } = useAnamnesis(patientProfileId)

  const { mutate: save, isPending } = useSaveAnamnesis({
    patientProfileId,
    onSaved: (saved) => {
      const savedSections = buildSectionsFromAnamnesis(saved)
      serverIdsRef.current = new Set(savedSections.map((section) => section.id))
      serverSectionsRef.current = savedSections
      lastPersistedFingerprint.current = fingerprintSections(savedSections)
      dispatch({ type: 'RECONCILE_IDS', serverSections: savedSections })
      dispatch({ type: 'SET_IS_DRAFT', value: saved.isDraft })
      dispatch({ type: 'SET_HAS_LOCAL_DRAFT', value: false })
      clear(patientProfileId)
    },
  })

  const fingerprint = useMemo(() => fingerprintSections(sections), [sections])

  const content = useMemo(
    () =>
      sections
        .map((section) => {
          const title = section.title.trim()
          const body = section.content.trim()
          return body ? `## ${title}\n${body}` : `## ${title}`
        })
        .join('\n\n')
        .trim(),
    [sections],
  )

  const canPublish = useMemo(
    () =>
      sections.length > 0 &&
      sections.every((section) => section.title.trim().length > 0),
    [sections],
  )

  // Server load + local draft recovery (once per patient profile)
  useEffect(() => {
    if (anamnesis === undefined) return
    if (hydratedForRef.current === patientProfileId) return
    hydratedForRef.current = patientProfileId

    if (anamnesis === null) {
      const base = [emptySection(0)]
      serverIdsRef.current = new Set()
      serverSectionsRef.current = base
      lastPersistedFingerprint.current = fingerprintSections(base)
      dispatch({
        type: 'HYDRATE',
        sections: base,
        isDraft: true,
        hasLocalDraft: false,
      })
      return
    }

    const serverSections = buildSectionsFromAnamnesis(anamnesis)
    const base = serverSections.length > 0 ? serverSections : [emptySection(0)]
    const serverFingerprint = fingerprintSections(base)

    serverIdsRef.current = new Set(serverSections.map((section) => section.id))
    serverSectionsRef.current = base
    lastPersistedFingerprint.current = serverFingerprint

    let initial = base
    let hasLocalDraftValue = false

    const draftSections = read(patientProfileId)
    if (draftSections.length > 0) {
      const draftFingerprint = fingerprintSections(draftSections)
      if (draftFingerprint !== serverFingerprint) {
        initial = draftSections
        hasLocalDraftValue = true
        toast.info('Rascunho local recuperado.')
      }
    }

    dispatch({
      type: 'HYDRATE',
      sections: initial,
      isDraft: anamnesis.isDraft,
      hasLocalDraft: hasLocalDraftValue,
    })
  }, [anamnesis, patientProfileId, read])

  // Auto-save debounce + local draft write
  useEffect(() => {
    if (!hydrated) return

    write(patientProfileId, sections)

    if (fingerprint !== lastPersistedFingerprint.current) {
      dispatch({ type: 'SET_HAS_LOCAL_DRAFT', value: true })
      dispatch({ type: 'SET_IS_DRAFT', value: true })

      const body = toSaveBody(sections, serverIdsRef.current, true)
      const parsed = saveAnamnesisSchema.safeParse(body)
      if (parsed.success) {
        debounce(() => save(parsed.data), 1000)
      }
    }
  }, [fingerprint, hydrated, sections, patientProfileId, write, debounce, save])

  const setActiveSectionId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_SECTION', id })
  }, [])

  const updateSection = useCallback(
    (id: string, updates: Partial<IAnamnesisSection>) => {
      dispatch({ type: 'UPDATE_SECTION', id, updates })
    },
    [],
  )

  const addSection = useCallback(() => {
    dispatch({ type: 'ADD_SECTION', section: emptySection() })
  }, [])

  const deleteSection = useCallback((id: string) => {
    dispatch({ type: 'DELETE_SECTION', id })
  }, [])

  const reorderSections = useCallback((ids: string[]) => {
    dispatch({ type: 'REORDER_SECTIONS', ids })
  }, [])

  const discardDraft = useCallback(() => {
    clear(patientProfileId)
    dispatch({ type: 'DISCARD_DRAFT', sections: serverSectionsRef.current })
  }, [patientProfileId, clear])

  const onPublish = useCallback(() => {
    const body = toSaveBody(sections, serverIdsRef.current, false)
    const parsed = saveAnamnesisSchema.safeParse(body)
    if (!parsed.success) return
    cancel()
    save(parsed.data)
  }, [sections, cancel, save])

  const onCopy = useCallback(async () => {
    Clipboard.copy(content)
    setCopied(true)
  }, [content])

  const exportToPdf = useCallback(async () => {
    if (!content.trim()) return
    const generatedAt = Time.toReadableDateTime(new Date())
    await exportPdfDoc(
      createElement(AnamnesisPDFTemplate, {
        patientName,
        content,
        generatedAt,
      }),
    )
  }, [content, exportPdfDoc, patientName])

  return {
    sections,
    activeSectionId,
    hasLocalDraft,
    hydrated,
    isPending,
    isDraft,
    canPublish,
    copied,
    isExporting,
    pdfExportedSuccessfully,
    content,
    setActiveSectionId,
    updateSection,
    addSection,
    deleteSection,
    reorderSections,
    discardDraft,
    onPublish,
    onCopy,
    exportToPdf,
  }
}
