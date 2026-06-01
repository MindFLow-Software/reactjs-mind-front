import "./patient-avatar-upload.css"
import { useState, useRef, useEffect } from "react"
import { Camera, Loader2 } from "lucide-react"
import { api } from "@/lib/axios"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface PatientAvatarUploadProps {
    onFileSelect:  (f: File | null) => void
    defaultValue?: string | null
    initials?:     string
}

export function PatientAvatarUpload({ onFileSelect, defaultValue, initials }: PatientAvatarUploadProps) {
    const inputRef            = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!defaultValue) { setPreview(null); return }
        if (defaultValue.startsWith("data:")) { setPreview(defaultValue); return }
        if (!UUID_RE.test(defaultValue)) { setPreview(null); return }

        let obj: string | null = null
        setLoading(true)
        api.get(`/attachments/${defaultValue}`, { responseType: "blob" })
            .then((r) => { obj = URL.createObjectURL(r.data); setPreview(obj) })
            .catch(() => setPreview(null))
            .finally(() => setLoading(false))
        return () => { if (obj) URL.revokeObjectURL(obj) }
    }, [defaultValue])

    function handleFile(file: File) {
        setPreview(URL.createObjectURL(file))
        onFileSelect(file)
    }

    function handleRemove() {
        setPreview(null)
        onFileSelect(null)
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <div className="rp-avatar-wrap">
            <div
                className="rp-avatar-circle group"
                style={{ background: preview ? undefined : "linear-gradient(135deg, #4e8ed3, #1858b0)" }}
                onClick={() => !loading && inputRef.current?.click()}
            >
                {loading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2 className="size-5 animate-spin text-white" />
                    </div>
                ) : preview ? (
                    <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
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
                    {preview && (
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
