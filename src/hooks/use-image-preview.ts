import { api } from '@/lib/axios'
import { useState, useEffect, useRef, useCallback } from 'react'

interface UseImagePreviewReturn {
  previewUrl: string | null
  file: File | null
  isLoading: boolean
  onSetPreview: (file: File) => void
  clear: () => void
  loadFromUrl: (url?: string | null) => Promise<void>
}

export function useImagePreview(): UseImagePreviewReturn {
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
    async (url?: string | null): Promise<void> => {
      try {
        setIsLoading(true)
        const blob = await api.get(`/attachments/${url}`, { responseType: 'blob' })
        const objectUrl = URL.createObjectURL(blob.data)
        createdUrls.current.push(objectUrl)
        setPreviewUrl(objectUrl)
      } catch {
        setPreviewUrl(null)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return { previewUrl, file, isLoading, onSetPreview, clear, loadFromUrl }
}
