import { useCallback, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { uploadAttachment } from '@/api/attachments/upload-attachment'

export enum FileStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  DONE = 'done',
  ERROR = 'error',
}

export type IFileItem = {
  id: string
  file: File
  status: FileStatus
  progress: number
  error?: string
}

export type IUseUploadReturn = {
  files: IFileItem[]
  addFiles: (incoming: FileList | File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  reset: () => void
  startUpload: (
    patientId: string,
  ) => Promise<{ doneCount: number; hasErrors: boolean }>
  isDragging: boolean
  handleDragEnter: React.DragEventHandler
  handleDragLeave: React.DragEventHandler
  handleDrop: React.DragEventHandler
  isUploading: boolean
  pendingCount: number
  canUpload: boolean
}

export function useUpload(): IUseUploadReturn {
  const queryClient = useQueryClient()
  const [files, setFiles] = useState<IFileItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const newItems: IFileItem[] = Array.from(incoming).map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: FileStatus.PENDING,
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newItems])
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const clearFiles = useCallback(() => setFiles([]), [])

  const reset = useCallback(() => {
    setFiles([])
    setIsDragging(false)
    dragCounter.current = 0
  }, [])

  const updateFile = useCallback((id: string, patch: Partial<IFileItem>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      dragCounter.current = 0
      setIsDragging(false)
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
    },
    [addFiles],
  )

  const startUpload = useCallback(
    async (patientId: string) => {
      const pending = files.filter(
        (f) => f.status === FileStatus.PENDING || f.status === FileStatus.ERROR,
      )
      if (!pending.length) return { doneCount: 0, hasErrors: false }

      const results = new Map<string, FileStatus.DONE | FileStatus.ERROR>()
      const chunks: IFileItem[][] = []
      for (let i = 0; i < pending.length; i += 3)
        chunks.push(pending.slice(i, i + 3))

      for (const chunk of chunks) {
        await Promise.all(
          chunk.map(async (item) => {
            updateFile(item.id, {
              status: FileStatus.UPLOADING,
              progress: 10,
              error: undefined,
            })
            try {
              await uploadAttachment(item.file, patientId)
              updateFile(item.id, { status: FileStatus.DONE, progress: 100 })
              results.set(item.id, FileStatus.DONE)
            } catch {
              updateFile(item.id, {
                status: FileStatus.ERROR,
                progress: 0,
                error: 'Falha no envio',
              })
              results.set(item.id, FileStatus.ERROR)
            }
          }),
        )
      }

      const doneCount = [...results.values()].filter(
        (v) => v === FileStatus.DONE,
      ).length
      const hasErrors = [...results.values()].some(
        (v) => v === FileStatus.ERROR,
      )

      if (doneCount > 0) {
        queryClient.invalidateQueries({ queryKey: ['all-attachments'] })
        queryClient.invalidateQueries({
          queryKey: ['patients-with-attachments'],
        })
      }

      return { doneCount, hasErrors }
    },
    [files, queryClient, updateFile],
  )

  const isUploading = files.some((f) => f.status === FileStatus.UPLOADING)
  const pendingCount = files.filter(
    (f) => f.status === FileStatus.PENDING || f.status === FileStatus.ERROR,
  ).length
  const canUpload = pendingCount > 0 && !isUploading

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    reset,
    startUpload,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    isUploading,
    pendingCount,
    canUpload,
  }
}
