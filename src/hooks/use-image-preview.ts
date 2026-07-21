import { useState, useCallback } from 'react'
import { useAttachmentBlob } from '@/hooks/use-attachment-blob'

type UseImagePreviewReturn = {
  previewUrl: string | null
  file: File | null
  isLoading: boolean
  onSetPreview: (file: File) => void
  clear: () => void
  loadFromUrl: (attachmentId?: string | null) => Promise<void>
  loadFromAttachmentId: (attachmentId?: string | null) => Promise<void>
}

export function useImagePreview(): UseImagePreviewReturn {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const { isLoading, fetchBlobUrl } = useAttachmentBlob()

  const onSetPreview = useCallback((f: File) => {
    const url = URL.createObjectURL(f)
    setPreviewUrl(url)
    setFile(f)
  }, [])

  const clear = useCallback(() => {
    setPreviewUrl(null)
    setFile(null)
  }, [])

  const loadFromUrl = useCallback(
    async (url?: string | null): Promise<void> => {
      if (!url) {
        setPreviewUrl(null)
        return
      }

      setPreviewUrl(url)
    },
    []
  )

  const loadFromAttachmentId = useCallback(
    async (attachmentId?: string | null): Promise<void> => {
      if (!attachmentId) {
        setPreviewUrl(null)
        return
      }
      const objectUrl = await fetchBlobUrl(attachmentId)
      setPreviewUrl(objectUrl)
    },
    [fetchBlobUrl],
  )

  return { previewUrl, file, isLoading, onSetPreview, clear, loadFromUrl, loadFromAttachmentId }
}
