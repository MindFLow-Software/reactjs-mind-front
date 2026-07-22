import { useEffect, useId, useRef, type ChangeEvent } from 'react'
import { Camera } from 'lucide-react'

import { useImagePreview } from '@/hooks/use-image-preview'
import { UserAvatar } from '@/components/user-avatar/user-avatar'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import './avatar-upload-field.css'

type IAvatarUploadFieldProps = {
  avatar: {
    name: string | null
    defaultUrl?: string | null
    onFileSelect: (file: File | null) => void
  }
  label?: string
  description?: string
  accept?: string
  className?: string
}

export function AvatarUploadField({
  avatar,
  label = 'Foto',
  description,
  accept = 'image/jpeg,image/png',
  className,
}: IAvatarUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const seedId = useId()
  const { previewUrl, onSetPreview, clear, loadFromUrl, isLoading } =
    useImagePreview()

  useEffect(() => {
    ;(async () => await loadFromUrl(avatar.defaultUrl))()
  }, [avatar.defaultUrl, loadFromUrl])

  function openPicker() {
    inputRef.current?.click()
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    onSetPreview(file)
    avatar.onFileSelect(file)
  }

  function handleRemove() {
    clear()
    avatar.onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={cn('auf-root', className)}>
      <Button
        type="button"
        variant="ghost"
        className="auf-avatar group"
        onClick={openPicker}
        disabled={isLoading}
        aria-label="Selecionar foto"
      >
        <UserAvatar
          className="size-16 shrink-0"
          identity={{ src: previewUrl, name: avatar.name, colorSeed: seedId }}
        />
        <span className="auf-overlay">
          <Camera className="size-5" />
        </span>
      </Button>

      <div className="auf-info">
        <span className="auf-label">{label}</span>
        {description && <span className="auf-desc">{description}</span>}
        <div className="auf-actions">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0"
            onClick={openPicker}
          >
            Enviar foto
          </Button>
          {previewUrl && (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto p-0 text-destructive"
              onClick={handleRemove}
            >
              Remover
            </Button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFile}
        accept={accept}
      />
    </div>
  )
}
