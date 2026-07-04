import { useCallback, useEffect, useRef, useState } from 'react'
import { getAttachmentBlob } from '@/api/attachments/get-attachment-blob'

interface UseAttachmentBlobReturn {
  isLoading: boolean
  fetchBlobUrl: (attachmentId: string) => Promise<string | null>
}

export function useAttachmentBlob(): UseAttachmentBlobReturn {
  const [isLoading, setIsLoading] = useState(false)
  const createdUrls = useRef<string[]>([])

  useEffect(() => {
    const urls = createdUrls.current
    return () => {
      urls.forEach(URL.revokeObjectURL)
    }
  }, [])

  const fetchBlobUrl = useCallback(
    async (attachmentId: string): Promise<string | null> => {
      try {
        setIsLoading(true)
        const blob = await getAttachmentBlob(attachmentId)
        const objectUrl = URL.createObjectURL(blob)
        createdUrls.current.push(objectUrl)
        return objectUrl
      } catch {
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  return { isLoading, fetchBlobUrl }
}
