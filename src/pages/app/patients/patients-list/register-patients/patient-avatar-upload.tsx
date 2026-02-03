"use client"

import { useRef, useState, useEffect } from "react"
import { Camera, Upload } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PatientAvatarUploadProps {
    defaultValue?: string | null
    onFileSelect: (file: File | null) => void
}

export function PatientAvatarUpload({
    defaultValue,
    onFileSelect
}: PatientAvatarUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(defaultValue || null)

    useEffect(() => {
        if (defaultValue) setPreviewImage(defaultValue)
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
                    <AvatarImage src={previewImage || ""} className="object-cover" />
                    <AvatarFallback className="bg-muted">
                        <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    </AvatarFallback>
                </Avatar>

                <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md group-hover:scale-110 transition-transform">
                    <Upload className="h-3 w-3" />
                </div>
            </div>

            <span className="text-xs text-muted-foreground">
                Clique para adicionar foto
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