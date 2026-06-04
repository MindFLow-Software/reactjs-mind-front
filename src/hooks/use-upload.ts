import { useCallback, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { uploadAttachment } from '@/api/attachments/attachments'

export type FileStatus = 'pending' | 'uploading' | 'done' | 'error'

export interface FileItem {
  id: string
  file: File
  status: FileStatus
  progress: number
  error?: string
}

export function useUpload() {
  const queryClient = useQueryClient()
  const [files, setFiles] = useState<FileItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const newItems: FileItem[] = Array.from(incoming).map((file) => ({
      id: crypto.randomUUID(),
      file,
      status: 'pending',
      progress: 0,
    }))
    setFiles((prev) => [...prev, ...newItems])
  }, [])

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const clearFiles = () => setFiles([])

  const reset = () => {
    setFiles([])
    setIsDragging(false)
    dragCounter.current = 0
  }

  const updateFile = (id: string, patch: Partial<FileItem>) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current++
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current--
    if (dragCounter.current === 0) setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
  }

  const startUpload = async (patientId: string) => {
    const pending = files.filter(
      (f) => f.status === 'pending' || f.status === 'error',
    )
    if (!pending.length) return { doneCount: 0, hasErrors: false }

    const results = new Map<string, 'done' | 'error'>()
    const chunks: FileItem[][] = []
    for (let i = 0; i < pending.length; i += 3)
      chunks.push(pending.slice(i, i + 3))

    for (const chunk of chunks) {
      await Promise.all(
        chunk.map(async (item) => {
          updateFile(item.id, {
            status: 'uploading',
            progress: 10,
            error: undefined,
          })
          try {
            await uploadAttachment(item.file, patientId)
            updateFile(item.id, { status: 'done', progress: 100 })
            results.set(item.id, 'done')
          } catch {
            updateFile(item.id, {
              status: 'error',
              progress: 0,
              error: 'Falha no envio',
            })
            results.set(item.id, 'error')
          }
        }),
      )
    }

    const doneCount = [...results.values()].filter((v) => v === 'done').length
    const hasErrors = [...results.values()].some((v) => v === 'error')

    if (doneCount > 0) {
      queryClient.invalidateQueries({ queryKey: ['all-attachments'] })
      queryClient.invalidateQueries({ queryKey: ['patients-with-attachments'] })
    }

    return { doneCount, hasErrors }
  }

  const isUploading = files.some((f) => f.status === 'uploading')
  const pendingCount = files.filter(
    (f) => f.status === 'pending' || f.status === 'error',
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
