import { useState, useEffect, useRef, useCallback } from 'react'
import { useAttachmentBlob } from '@/hooks/use-attachment-blob'

interface UseImagePreviewReturn {
  previewUrl: string | null
  file: File | null
  isLoading: boolean
  onSetPreview: (file: File) => void
  clear: () => void
  loadFromUrl: (attachmentId?: string | null) => Promise<void>
}

export function useImagePreview(): UseImagePreviewReturn {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const createdUrls = useRef<string[]>([])
  const { isLoading, fetchBlobUrl } = useAttachmentBlob()

  useEffect(() => {
    const urls = createdUrls.current
    return () => {
      urls.forEach(URL.revokeObjectURL)
    }
  }, [])

  const onSetPreview = useCallback((f: File) => {
    const url = URL.createObjectURL(f)
    createdUrls.current.push(url)
    setPreviewUrl(url)
    setFile(f)
  }, [])

  const clear = useCallback(() => {
    setPreviewUrl(null)
    setFile(null)
  }, [])

  const loadFromUrl = useCallback(
    async (attachmentId?: string | null): Promise<void> => {
      if (!attachmentId) {
        setPreviewUrl(null)
        return
      }
      const objectUrl = await fetchBlobUrl(attachmentId)
      if (objectUrl) createdUrls.current.push(objectUrl)
      setPreviewUrl(objectUrl)
    },
    [fetchBlobUrl],
  )

  return { previewUrl, file, isLoading, onSetPreview, clear, loadFromUrl }
}
