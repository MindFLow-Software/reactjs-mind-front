import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { uploadAttachment } from '@/api/attachments/upload-attachment'
import { uploadAvatar } from '@/api/attachments/upload-avatar'

type IPatientAttachmentsUploadParams = {
  targetId: string
  avatarFile: File | null
  files: File[]
}

type IUsePatientAttachmentsUpload = {
  uploadAll: (params: IPatientAttachmentsUploadParams) => Promise<void>
  isUploading: boolean
}

export function usePatientAttachmentsUpload(): IUsePatientAttachmentsUpload {
  const queryClient = useQueryClient()
  const [isUploading, setIsUploading] = useState(false)

  const uploadAll = useCallback(
    async ({
      targetId,
      avatarFile,
      files,
    }: IPatientAttachmentsUploadParams) => {
      setIsUploading(true)

      try {
        if (avatarFile) {
          try {
            await uploadAvatar(avatarFile, targetId)
            await Promise.all([
              queryClient.invalidateQueries({ queryKey: ['patients'] }),
              queryClient.invalidateQueries({
                queryKey: ['patient', targetId],
              }),
            ])
          } catch {
            console.warn('Avatar upload failed — patient saved without avatar')
          }
        }

        for (const file of files) await uploadAttachment(file, targetId)
      } finally {
        setIsUploading(false)
      }
    },
    [queryClient],
  )

  return { uploadAll, isUploading }
}
