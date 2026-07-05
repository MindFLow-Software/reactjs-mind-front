'use client'

import { X } from 'lucide-react'
import './suggestion-attachment-preview.css'

interface SuggestionAttachmentPreviewProps {
  preview: { url: string; name: string }
  onClose: () => void
}

export function SuggestionAttachmentPreview({
  preview,
  onClose,
}: SuggestionAttachmentPreviewProps) {
  return (
    <div className="sdm-preview">
      <div className="flex items-center gap-3 px-5 py-4 shrink-0">
        <p
          className="flex-1 min-w-0 text-sm font-semibold text-white truncate"
          title={preview.name}
        >
          {preview.name}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar visualização"
          className="sdm-preview-close"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="h-[3px] bg-blue-600 shrink-0" />
      <div className="flex-1 flex items-center justify-center overflow-hidden p-4">
        <img
          src={preview.url}
          alt={preview.name}
          className="max-w-full max-h-full object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      <div className="px-5 py-3 shrink-0 flex justify-start">
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] tracking-[0.1em] uppercase font-semibold text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}
