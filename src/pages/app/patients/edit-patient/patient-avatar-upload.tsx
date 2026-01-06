"use client"

import { useRef, useState, useEffect } from "react"
import { Camera, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/lib/axios"

interface PatientAvatarUploadProps {
    defaultValue?: string | null
    onFileSelect: (file: File | null) => void
}

export function PatientAvatarUpload({
    defaultValue,
    onFileSelect
}: PatientAvatarUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)

    // Função auxiliar para montar a URL do R2 (Proxy)
    const getFullUrl = (path: string | null | undefined) => {
        if (!path) return null
        // Se já for um blob (preview local), retorna ele mesmo
        if (path.startsWith('blob:')) return path
        // Se for o nome do arquivo vindo do banco, adiciona o caminho do proxy
        return `${api.defaults.baseURL}/attachments/${path}`
    }

    useEffect(() => {
        if (defaultValue) {
            setPreviewImage(getFullUrl(defaultValue))
        }
    }, [defaultValue])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]

        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setPreviewImage(imageUrl)
            onFileSelect(file)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="flex flex-col items-center justify-center gap-2">
            <div
                className="relative group cursor-pointer"
                onClick={triggerFileInput}
            >
                <Avatar className="h-24 w-24 border-2 border-dashed border-muted-foreground/30 group-hover:border-primary transition-colors">
                    <AvatarImage
                        src={previewImage || ""}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-muted">
                        <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </AvatarFallback>
                </Avatar>

                <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md group-hover:scale-110 transition-transform">
                    <Upload className="h-3 w-3" />
                </div>
            </div>

            <span className="text-xs text-muted-foreground">
                {previewImage ? "Clique para alterar foto" : "Clique para adicionar foto"}
            </span>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    )
}