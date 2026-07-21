import './avatar-upload-field.css'
import { useCallback, useEffect, useId, useRef, type ChangeEvent } from 'react'
import { Camera } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useImagePreview } from '@/hooks/use-image-preview'
import { UserAvatar } from '@/components/user-avatar/user-avatar'

type IAvatarUploadField = {
  identity: { name: string | null; defaultUrl?: string | null }
  copy: { label: string; description: string }
  onFileSelect: (file: File | null) => void
}

export function AvatarUploadField({
  identity,
  copy,
  onFileSelect,
}: IAvatarUploadField) {
  const { name, defaultUrl } = identity

  const inputRef = useRef<HTMLInputElement>(null)
  const avatarId = useId()
  const { previewUrl, onSetPreview, clear, loadFromUrl, isLoading } =
    useImagePreview()

  const handleFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      onSetPreview(file)
      onFileSelect(file)
    },
    [onSetPreview, onFileSelect],
  )

  const handleRemove = useCallback(() => {
    clear()
    onFileSelect(null)
    if (inputRef.current) inputRef.current.value = ''
  }, [clear, onFileSelect])

  const handlePick = useCallback(() => {
    if (!isLoading) inputRef.current?.click()
  }, [isLoading])

  useEffect(() => {
    loadFromUrl(defaultUrl)
  }, [defaultUrl, loadFromUrl])

  return (
    <div className="auf-wrap">
      <div
        className={cn('auf-circle group', !previewUrl && 'auf-circle--empty')}
        onClick={handlePick}
      >
        <UserAvatar
          identity={{ src: previewUrl, name, colorSeed: avatarId }}
          className="size-full"
        />
        <div className="auf-overlay group-hover:opacity-100">
          <Camera className="auf-overlay-icon" />
        </div>
      </div>

      <div className="auf-info">
        <span className="auf-label">{copy.label}</span>
        <span className="auf-desc">{copy.description}</span>
        <div className="auf-actions">
          <button type="button" className="auf-btn-upload" onClick={handlePick}>
            Enviar foto
          </button>
          {previewUrl && (
            <>
              <span className="auf-sep">·</span>
              <button
                type="button"
                onClick={handleRemove}
                className="auf-btn-remove"
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
