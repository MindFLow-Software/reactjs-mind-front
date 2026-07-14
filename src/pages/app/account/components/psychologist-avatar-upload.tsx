'use client'

import { useRef, useState } from 'react'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { uploadAvatar } from '@/api/attachments/upload-avatar'
import { UserAvatar } from '@/components/user-avatar'
import type { IgetMeResponse } from '@/api/auth/get-profile'
import { useSessionStore } from '@/store/use-session-store'

import './psychologist-avatar-upload.css'
interface AvatarUploadProps {
  currentImage?: string | null
  fullName: string
}

export function PsychologistAvatarUpload({
  currentImage,
  fullName,
}: AvatarUploadProps) {
  const queryClient = useQueryClient()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const user = useSessionStore((state) => state.user)
  const setSession = useSessionStore((state) => state.setSession)

  const { mutateAsync: uploadPhoto, isPending } = useMutation({
    mutationFn: async (file: File) => {
      const { url } = await uploadAvatar(file)
      return url
    },
    onSuccess: async (newPhotoUrl) => {
      const queryKey = ['psychologist-profile']

      queryClient.setQueryData<IgetMeResponse>(queryKey, (oldData) => {
        if (!oldData) return oldData
        return { ...oldData, profileImageUrl: newPhotoUrl }
      })

      if (user) setSession({ ...user, profileImageUrl: newPhotoUrl })

      await queryClient.invalidateQueries({ queryKey })

      toast.success('Foto de perfil atualizada!')
      setPreviewUrl(null)
    },
    onError: () => {
      toast.error('Erro ao atualizar a foto.')
      setPreviewUrl(null)
    },
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      try {
        await uploadPhoto(file)
      } catch {}
    }
  }

  return (
    <div className="acc-avatar-root">
      <div
        className="group acc-avatar-frame"
        onClick={() => !isPending && fileInputRef.current?.click()}
      >
        <UserAvatar
          src={previewUrl || currentImage}
          name={fullName}
          className="acc-avatar-image"
        />
        <div className="acc-avatar-badge">
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Camera className="size-4" />
          )}
        </div>
        <div className="acc-avatar-overlay">
          {!isPending && <Upload className="size-8 text-white" />}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      {isPending && (
        <span className="acc-avatar-processing">Processando imagem...</span>
      )}
    </div>
  )
}
