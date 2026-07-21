import { useCallback, useState } from 'react'
import { getAttachmentBlob } from '@/api/attachments/get-attachment-blob'

type UseAttachmentBlobReturn = {
  isLoading: boolean
  fetchBlobUrl: (attachmentId: string) => Promise<string | null>
}

export function useAttachmentBlob(): UseAttachmentBlobReturn {
  const [isLoading, setIsLoading] = useState(false)

  const fetchBlobUrl = useCallback(
    async (attachmentId: string): Promise<string | null> => {
      try {
        setIsLoading(true)
        const blob = await getAttachmentBlob(attachmentId)
        const objectUrl = URL.createObjectURL(blob)
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
