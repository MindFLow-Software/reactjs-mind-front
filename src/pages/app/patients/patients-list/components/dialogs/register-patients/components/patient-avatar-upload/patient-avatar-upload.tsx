import './patient-avatar-upload.css'
import { useEffect, useId, useRef, type ChangeEvent } from 'react'
import { Camera } from 'lucide-react'
import { useImagePreview } from '@/hooks/use-image-preview'
import { UserAvatar } from '@/components/user-avatar/user-avatar'
import { cn } from '@/lib/utils'

type IPatientAvatarUpload = {
  onFileSelect: (file: File | null) => void
  defaultUrl?: string | null
  fullName: string | null
}

export function PatientAvatarUpload({
  onFileSelect,
  defaultUrl,
  fullName,
}: IPatientAvatarUpload) {
  const inputRef = useRef<HTMLInputElement>(null)
  const avatarId = useId()
  const { previewUrl, onSetPreview, clear, loadFromUrl, isLoading } =
    useImagePreview()

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return

    const file = event.target.files[0]

    onSetPreview(file)
    onFileSelect(file)
  }

  function handleRemove() {
    clear()
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  useEffect(() => {
    ;(async () => await loadFromUrl(defaultUrl))()
  }, [defaultUrl, clear, loadFromUrl])

  return (
    <div className="rp-avatar-wrap">
      <div
        className={cn(
          'rp-avatar-circle group',
          !previewUrl && 'rp-avatar-circle--empty',
        )}
        onClick={() => !isLoading && inputRef.current?.click()}
      >
        <UserAvatar
          identity={{ src: previewUrl, name: fullName, colorSeed: avatarId }}
          className="size-full"
        />
        <div className="rp-avatar-overlay group-hover:opacity-100">
          <Camera className="rp-avatar-overlay-icon" />
        </div>
      </div>

      <div className="rp-avatar-info">
        <span className="rp-avatar-label">Foto do paciente</span>
        <span className="rp-avatar-desc">JPG ou PNG · até 2 MB · opcional</span>
        <div className="rp-avatar-actions">
          <button
            type="button"
            className="rp-avatar-btn-upload"
            onClick={() => inputRef.current?.click()}
          >
            Enviar foto
          </button>
          {previewUrl && (
            <>
              <span className="rp-avatar-sep">·</span>
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
