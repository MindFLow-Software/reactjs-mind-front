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
        <div className="mb-4 flex items-center gap-3.5 rounded-[8px] border border-slate-100 bg-slate-50 p-3">
            <div
                className="group relative size-[60px] shrink-0 cursor-pointer overflow-hidden rounded-full border-2 border-white shadow-sm"
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
                    className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: "rgba(15,52,100,0.55)" }}
                >
                    <Camera className="size-[18px] text-white" />
                </div>
            </div>

            <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-slate-800">Foto do paciente</span>
                <span className="text-[11.5px] text-slate-500">JPG ou PNG · até 2 MB · opcional</span>
                <div className="mt-0.5 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="cursor-pointer rounded px-2 py-1 text-[11.5px] font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                    >
                        Enviar foto
                    </button>
                    {preview && (
                        <>
                            <span className="text-slate-300">·</span>
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="cursor-pointer rounded px-2 py-1 text-[11.5px] font-semibold text-slate-500 transition-colors hover:text-slate-700"
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
