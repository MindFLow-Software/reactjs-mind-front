"use client"

import { useRef, useState } from "react"
import { Camera, Upload, Loader2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/axios"
import { updatePsychologist } from "@/api/update-psychologist"
import { UserAvatar } from "@/components/user-avatar"
import type { GetProfileResponse } from "@/api/get-profile"

interface AvatarUploadProps {
    currentImage?: string | null
    fullName: string
}

export function PsychologistAvatarUpload({ currentImage, fullName }: AvatarUploadProps) {
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const { mutateAsync: uploadPhoto, isPending } = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData()
            formData.append("file", file)

            const response = await api.post<{ attachmentId: string }>("/attachments", formData)
            const newPhotoId = response.data.attachmentId

            await updatePsychologist({ profileImageUrl: newPhotoId })
            return newPhotoId
        },
        onSuccess: async (newPhotoId) => {
            const queryKey = ["psychologist-profile"]

            queryClient.setQueryData<GetProfileResponse>(queryKey, (oldData) => {
                if (!oldData) return oldData
                return { ...oldData, profileImageUrl: newPhotoId }
            })

            const storedUser = localStorage.getItem("user")
            if (storedUser) {
                const userData = JSON.parse(storedUser)
                userData.profileImageUrl = newPhotoId
                localStorage.setItem("user", JSON.stringify(userData))
            }

            await queryClient.invalidateQueries({ queryKey })

            toast.success("Foto de perfil atualizada!")
            setPreviewUrl(null)
        },
        onError: () => {
            toast.error("Erro ao atualizar a foto.")
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
            } catch { }
        }
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className="relative group cursor-pointer"
                onClick={() => !isPending && fileInputRef.current?.click()}
            >
                <UserAvatar
                    src={previewUrl || currentImage}
                    name={fullName}
                    className="h-28 w-28 border-4 border-background shadow-xl group-hover:border-primary/40 transition-all rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform z-10 border-2 border-background">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    {!isPending && <Upload className="h-8 w-8 text-white" />}
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {isPending && (
                <span className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest">
                    Processando imagem...
                </span>
            )}
        </div>
    )
}