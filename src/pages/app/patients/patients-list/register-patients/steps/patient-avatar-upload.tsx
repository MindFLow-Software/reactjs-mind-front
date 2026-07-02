import './patient-avatar-upload.css'
import { useEffect, useMemo, useRef, type ChangeEvent } from 'react'
import { Camera } from 'lucide-react'
import { useImagePreview } from '@/hooks/use-image-preview'
import { UserAvatar } from '@/components/user-avatar'

interface IPatientAvatarUpload {
  onFileSelect: (f: File | null) => void
  defaultUrl?: string | null
  fullName: string | null
}

export function PatientAvatarUpload({
  onFileSelect,
  defaultUrl,
  fullName,
}: IPatientAvatarUpload) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { previewUrl, onSetPreview, clear, loadFromUrl, isLoading } =
    useImagePreview()

  const displayUrl = previewUrl

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return

    const files = e.target.files
    const file = files?.[0]

    onSetPreview(file)
    onFileSelect(file)
  }

  function handleRemove() {
    clear()
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  useEffect(() => {
    (async () => await loadFromUrl(defaultUrl))()
  }, [defaultUrl, clear, loadFromUrl])

  const avatarId = useMemo(() => String(Math.random() * 1000), [])

  return (
    <div className="rp-avatar-wrap">
      <div
        className="rp-avatar-circle group"
        style={{
          background: displayUrl
            ? undefined
            : 'linear-gradient(135deg, #4e8ed3, #1858b0)',
        }}
        onClick={() => !isLoading && inputRef.current?.click()}
      >
        <UserAvatar
          src={displayUrl}
          name={fullName}
          colorSeed={avatarId}
          className="size-full"
        />
        <div
          className="rp-avatar-overlay group-hover:opacity-100 pointer-events-none"
          style={{ background: 'rgba(15,52,100,0.55)' }}
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
            className="rp-avatar-btn-upload"
            onClick={() => inputRef.current?.click()}
          >
            Enviar foto
          </button>
          {displayUrl && (
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
        className="hidden"
        onChange={handleFile}
        accept="image/jpeg,image/png"
      />
    </div>
  )
}
