import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { getAnamnesis } from '@/api/patient-profiles/get-anamnesis'
import { saveAnamnesis } from '@/api/patient-profiles/save-anamnesis'
import type { IAnamnesisContent } from '@/types/clinical/anamnesis-content'
import { AnamnesisPDFTemplate } from '@/templates/pdf/anamnesis-pdf-template'

import type { IAnamnesisBlock } from '../components/anamnesis/anamnesis-types'
import {
  buildContentFromBlocks,
  buildInitialBlocks,
  normalizeBlocks,
  toApiData,
} from '../components/anamnesis/anamnesis-utils'
import {
  clearAnamnesisDraft,
  readAnamnesisDraft,
  writeAnamnesisDraft,
} from '../components/anamnesis/anamnesis-draft-storage'
import { usePdfExport } from './use-pdf-export'
import { Clipboard } from '@/utils/clipboard'
import { Time } from '@/utils/time'

type EditorState = {
  blocks: IAnamnesisBlock[]
  activeBlockId: string | null
  hydrated: boolean
  hasLocalDraft: boolean
}

type EditorAction =
  | { type: 'HYDRATE'; blocks: IAnamnesisBlock[]; hasLocalDraft: boolean }
  | { type: 'SET_ACTIVE_BLOCK'; id: string | null }
  | { type: 'UPDATE_BLOCK'; id: string; updates: Partial<IAnamnesisBlock> }
  | { type: 'ADD_BLOCK'; block: IAnamnesisBlock }
  | { type: 'DELETE_BLOCK'; id: string }
  | { type: 'DISCARD_DRAFT'; blocks: IAnamnesisBlock[] }
  | { type: 'SET_HAS_LOCAL_DRAFT'; value: boolean }

const INITIAL_EDITOR_STATE: EditorState = {
  blocks: [],
  activeBlockId: null,
  hydrated: false,
  hasLocalDraft: false,
}

function editorReducer(state: EditorState, action: EditorAction): EditorState {
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

type UseAnamnesisEditorOptions = {
  patientId: string
  patientName?: string
}

type UseAnamnesisEditorReturn = {
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
}: UseAnamnesisEditorOptions): UseAnamnesisEditorReturn {
  const queryClient = useQueryClient()

  const [{ blocks, activeBlockId, hydrated, hasLocalDraft }, dispatch] =
    useReducer(editorReducer, INITIAL_EDITOR_STATE)
  const [copied, setCopied] = useState(false)

  const lastPersistedHash = useRef('')
  const serverBlocksRef = useRef<IAnamnesisBlock[]>([])

  const { data } = useQuery({
    queryKey: ['patient-hub', patientId, 'anamnesis'],
    queryFn: () => getAnamnesis(patientId),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (newData: IAnamnesisContent) =>
      saveAnamnesis(patientId, newData),
    onSuccess: async (_, vars) => {
      lastPersistedHash.current = JSON.stringify(vars)
      dispatch({ type: 'SET_HAS_LOCAL_DRAFT', value: false })
      clearAnamnesisDraft(patientId)
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['patient-hub', patientId, 'anamnesis'],
        }),
      ])
    },
    onError: () => toast.error('Erro ao sincronizar com o servidor.'),
  })

  const normalizedBlocks = useMemo(() => normalizeBlocks(blocks), [blocks])
  const payload = useMemo(() => toApiData(normalizedBlocks), [normalizedBlocks])
  const content = useMemo(
    () => buildContentFromBlocks(normalizedBlocks),
    [normalizedBlocks],
  )
  const payloadHash = JSON.stringify(payload)

  // Data load + local draft recovery
  useEffect(() => {
    if (!data) return

    const serverBlocks = normalizeBlocks(buildInitialBlocks(data))
    const serverHash = JSON.stringify(toApiData(serverBlocks))
    lastPersistedHash.current = serverHash
    serverBlocksRef.current = serverBlocks

    let initial = serverBlocks
    let hasLocalDraftValue = false

    const draftBlocks = readAnamnesisDraft(patientId)
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
  }, [data, patientId])

  // Auto-save debounce + local draft write
  useEffect(() => {
    if (!hydrated) return

    writeAnamnesisDraft(patientId, normalizedBlocks)

    if (payloadHash !== lastPersistedHash.current) {
      dispatch({ type: 'SET_HAS_LOCAL_DRAFT', value: true })
      const timer = setTimeout(() => mutate(payload), 1000)
      return () => clearTimeout(timer)
    }
  }, [payloadHash, hydrated, mutate, payload, normalizedBlocks, patientId])

  const {
    isExporting,
    pdfExportedSuccessfully,
    exportToPdf: exportPdfDoc,
  } = usePdfExport({
    receivedFilename: `Anamnese-${patientName?.replace(/\s+/g, '-') ?? patientId}.pdf`,
  })

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
    clearAnamnesisDraft(patientId)
    dispatch({ type: 'DISCARD_DRAFT', blocks: serverBlocksRef.current })
  }, [patientId])

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
