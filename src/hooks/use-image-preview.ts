import { useState, useEffect, useRef, useCallback } from 'react'

interface UseImagePreviewOptions {
  fetchBlob?: (url: string) => Promise<Blob>
}

interface UseImagePreviewReturn {
  previewUrl: string | null
  file: File | null
  isLoading: boolean
  onFileSelected: (file: File) => void
  clear: () => void
  loadFromUrl: (url: string) => Promise<void>
}

export function useImagePreview(
  options?: UseImagePreviewOptions,
): UseImagePreviewReturn {
  const { fetchBlob } = options ?? {}
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const createdUrls = useRef<string[]>([])

  useEffect(() => {
    const urls = createdUrls.current
    return () => {
      urls.forEach(URL.revokeObjectURL)
    }
  }, [])

  const onFileSelected = useCallback((f: File) => {
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
    async (url: string): Promise<void> => {
      if (url.startsWith('data:')) {
        setPreviewUrl(url)
        return
      }
      if (!fetchBlob) {
        setPreviewUrl(url)
        return
      }
      try {
        setIsLoading(true)
        const blob = await fetchBlob(url)
        const objectUrl = URL.createObjectURL(blob)
        createdUrls.current.push(objectUrl)
        setPreviewUrl(objectUrl)
      } catch {
        setPreviewUrl(null)
      } finally {
        setIsLoading(false)
      }
    },
    [fetchBlob],
  )

  return { previewUrl, file, isLoading, onFileSelected, clear, loadFromUrl }
}
