import { useCallback, useState } from 'react'
import { uploadAttachment } from '@/api/attachments/upload-attachment'

type IPatientAttachmentsUploadParams = {
  targetId: string
  files: File[]
}

type IUsePatientAttachmentsUpload = {
  uploadAll: (params: IPatientAttachmentsUploadParams) => Promise<void>
  isUploading: boolean
}

export function usePatientAttachmentsUpload(): IUsePatientAttachmentsUpload {
  const [isUploading, setIsUploading] = useState(false)

  const uploadAll = useCallback(
    async ({ targetId, files }: IPatientAttachmentsUploadParams) => {
      if (files.length === 0) return

      setIsUploading(true)

      try {
        for (const file of files) await uploadAttachment(file, targetId)
      } finally {
        setIsUploading(false)
      }
    },
    [],
  )

  return { uploadAll, isUploading }
}
