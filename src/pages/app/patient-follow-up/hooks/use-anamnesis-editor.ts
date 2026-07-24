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

import type { IAnamnesisBlock } from '../components/tabs/anamnesis/anamnesis-types'
import {
  buildContentFromBlocks,
  buildInitialBlocks,
  normalizeBlocks,
  toApiData,
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
  blocks: IAnamnesisBlock[]
  activeBlockId: string | null
  hydrated: boolean
  hasLocalDraft: boolean
}

type IAnamnesisEditorAction =
  | { type: 'HYDRATE'; blocks: IAnamnesisBlock[]; hasLocalDraft: boolean }
  | { type: 'SET_ACTIVE_BLOCK'; id: string | null }
  | { type: 'UPDATE_BLOCK'; id: string; updates: Partial<IAnamnesisBlock> }
  | { type: 'ADD_BLOCK'; block: IAnamnesisBlock }
  | { type: 'DELETE_BLOCK'; id: string }
  | { type: 'DISCARD_DRAFT'; blocks: IAnamnesisBlock[] }
  | { type: 'SET_HAS_LOCAL_DRAFT'; value: boolean }

const INITIAL_EDITOR_STATE: IAnamnesisEditorState = {
  blocks: [],
  activeBlockId: null,
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
        blocks: action.blocks,
        activeBlockId: action.blocks[0]?.id ?? null,
        hydrated: true,
        hasLocalDraft: action.hasLocalDraft,
      }
    case 'SET_ACTIVE_BLOCK':
      return { ...state, activeBlockId: action.id }
    case 'UPDATE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.map((b) =>
          b.id === action.id ? { ...b, ...action.updates } : b,
        ),
      }
    case 'ADD_BLOCK':
      return {
        ...state,
        blocks: [...state.blocks, action.block],
        activeBlockId: action.block.id,
      }
    case 'DELETE_BLOCK':
      return {
        ...state,
        blocks: state.blocks.filter((b) => b.id !== action.id),
      }
    case 'DISCARD_DRAFT':
      return { ...state, blocks: action.blocks, hasLocalDraft: false }
    case 'SET_HAS_LOCAL_DRAFT':
      return { ...state, hasLocalDraft: action.value }
  }
}

type IUseAnamnesisEditorOptions = {
  patientId: string
  patientName?: string
}

type IUseAnamnesisEditorReturn = {
  blocks: IAnamnesisBlock[]
  activeBlockId: string | null
  hasLocalDraft: boolean
  hydrated: boolean
  isPending: boolean
  copied: boolean
  isExporting: boolean
  pdfExportedSuccessfully: boolean
  content: string
  setActiveBlockId: (id: string | null) => void
  updateBlock: (id: string, updates: Partial<IAnamnesisBlock>) => void
  addBlock: () => void
  deleteBlock: (id: string) => void
  discardDraft: () => void
  onCopy: () => Promise<void>
  exportToPdf: () => Promise<void>
}

export function useAnamnesisEditor({
  patientId,
  patientName = '',
}: IUseAnamnesisEditorOptions): IUseAnamnesisEditorReturn {
  const { debounce } = useDebounce()
  const { read, write, clear } = useAnamnesisDraft()

  const [copied, setCopied] = useState(false)
  const [{ blocks, activeBlockId, hydrated, hasLocalDraft }, dispatch] =
    useReducer(editorReducer, INITIAL_EDITOR_STATE)

  const {
    isExporting,
    pdfExportedSuccessfully,
    exportToPdf: exportPdfDoc,
  } = usePdfExport({
    receivedFilename: `Anamnese-${Normalizer.toKebabCase(patientName) ?? patientId}.pdf`,
  })

  const lastPersistedHash = useRef('')
  const serverBlocksRef = useRef<IAnamnesisBlock[]>([])

  const { anamnesis } = useAnamnesis(patientId)

  const { mutate: save, isPending } = useSaveAnamnesis({
    patientId,
    onSaved: (vars) => {
      lastPersistedHash.current = JSON.stringify(vars)
      dispatch({ type: 'SET_HAS_LOCAL_DRAFT', value: false })
      clear(patientId)
    },
  })

  const normalizedBlocks = useMemo(() => normalizeBlocks(blocks), [blocks])
  const payload = useMemo(() => toApiData(normalizedBlocks), [normalizedBlocks])
  const payloadHash = JSON.stringify(payload)

  const content = useMemo(
    () => buildContentFromBlocks(normalizedBlocks),
    [normalizedBlocks],
  )

  // Data load + local draft recovery
  useEffect(() => {
    if (!anamnesis) {
      const block: IAnamnesisBlock = {
        id: crypto.randomUUID(),
        title: 'Nova Seção',
        content: '',
      }
      dispatch({
        type: 'HYDRATE',
        blocks: [block],
        hasLocalDraft: false,
      })
      return
    }

    const serverBlocks = normalizeBlocks(buildInitialBlocks(anamnesis))
    const serverHash = JSON.stringify(toApiData(serverBlocks))

    lastPersistedHash.current = serverHash
    serverBlocksRef.current = serverBlocks

    let initial = serverBlocks
    let hasLocalDraftValue = false

    const draftBlocks = read(patientId)

    if (draftBlocks.length > 0) {
      const draftHash = JSON.stringify(toApiData(draftBlocks))

      if (draftHash !== serverHash) {
        initial = normalizeBlocks(draftBlocks)
        hasLocalDraftValue = true
        toast.info('Rascunho local recuperado.')
      }
    }

    dispatch({
      type: 'HYDRATE',
      blocks: initial,
      hasLocalDraft: hasLocalDraftValue,
    })
  }, [anamnesis, patientId, read])

  // Auto-save debounce + local draft write
  useEffect(() => {
    if (!hydrated) return

    write(patientId, normalizedBlocks)

    if (payloadHash !== lastPersistedHash.current) {
      dispatch({ type: 'SET_HAS_LOCAL_DRAFT', value: true })
      debounce(() => save(payload), 1000)
    }
  }, [
    payloadHash,
    hydrated,
    save,
    payload,
    normalizedBlocks,
    patientId,
    debounce,
    write,
  ])

  const setActiveBlockId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_BLOCK', id })
  }, [])

  const updateBlock = useCallback(
    (id: string, updates: Partial<IAnamnesisBlock>) => {
      dispatch({ type: 'UPDATE_BLOCK', id, updates })
    },
    [],
  )

  const addBlock = useCallback(() => {
    const block: IAnamnesisBlock = {
      id: crypto.randomUUID(),
      title: 'Nova Seção',
      content: '',
    }
    dispatch({ type: 'ADD_BLOCK', block })
  }, [])

  const deleteBlock = useCallback((id: string) => {
    dispatch({ type: 'DELETE_BLOCK', id })
  }, [])

  const discardDraft = useCallback(() => {
    clear(patientId)
    dispatch({ type: 'DISCARD_DRAFT', blocks: serverBlocksRef.current })
  }, [patientId, clear])

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
    blocks: normalizedBlocks,
    activeBlockId,
    hasLocalDraft,
    hydrated,
    isPending,
    copied,
    isExporting,
    pdfExportedSuccessfully,
    content,
    setActiveBlockId,
    updateBlock,
    addBlock,
    deleteBlock,
    discardDraft,
    onCopy,
    exportToPdf,
  }
}
