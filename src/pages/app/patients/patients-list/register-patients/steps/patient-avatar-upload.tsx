import "./patient-avatar-upload.css"
import { useEffect, useRef } from "react"
import { Camera, Loader2 } from "lucide-react"
import { api } from "@/lib/axios"
import { useImagePreview } from "@/hooks/use-image-preview"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function fetchAvatarBlob(url: string): Promise<Blob> {
    return api.get(`/attachments/${url}`, { responseType: "blob" }).then(r => r.data as Blob)
}

interface PatientAvatarUploadProps {
    onFileSelect:  (f: File | null) => void
    defaultValue?: string | null
    initials?:     string
}

export function PatientAvatarUpload({ onFileSelect, defaultValue, initials }: PatientAvatarUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)
    const { previewUrl, onFileSelected, clear, loadFromUrl, isLoading } = useImagePreview({ fetchBlob: fetchAvatarBlob })

    useEffect(() => {
        if (!defaultValue) { clear(); return }
        if (!defaultValue.startsWith("data:") && !UUID_RE.test(defaultValue)) { clear(); return }
        void loadFromUrl(defaultValue)
    }, [defaultValue, clear, loadFromUrl])

    function handleFile(file: File) {
        onFileSelected(file)
        onFileSelect(file)
    }

    function handleRemove() {
        clear()
        onFileSelect(null)
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <div className="rp-avatar-wrap">
            <div
                className="rp-avatar-circle group"
                style={{ background: previewUrl ? undefined : "linear-gradient(135deg, #4e8ed3, #1858b0)" }}
                onClick={() => !isLoading && inputRef.current?.click()}
            >
                {isLoading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="size-5 animate-spin text-white" />
                    </div>
                ) : previewUrl ? (
                    <img src={previewUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="font-title text-[20px] font-bold text-white">{initials || "+"}</span>
                    </div>
                )}
                <div
                    className="rp-avatar-overlay group-hover:opacity-100"
                    style={{ background: "rgba(15,52,100,0.55)" }}
                >
                    <Camera className="size-[18px] text-white" />
                </div>
            </div>

            <div className="rp-avatar-info">
                <span className="rp-avatar-label">Foto do paciente</span>
                <span className="rp-avatar-desc">JPG ou PNG · até 2 MB · opcional</span>
                <div className="mt-0.5 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="rp-avatar-btn-upload"
                    >
                        Enviar foto
                    </button>
                    {previewUrl && (
                        <>
                            <span className="text-border">·</span>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="rp-avatar-btn-remove"
                            >
                                Remover
                            </button>
                        </>
                    )}
                </div>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
        </div>
    )
}
