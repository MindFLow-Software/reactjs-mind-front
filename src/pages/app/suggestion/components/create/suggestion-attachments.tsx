'use client'

import { useRef, memo } from 'react'
import {
  CloudUpload,
  FileText,
  Paperclip,
  X,
  ImageIcon,
  File as FileIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldSet } from '@/components/ui/field'
import './suggestion-attachments.css'

interface SuggestionAttachmentsProps {
  files: File[]
  onFileChange: (files: File[]) => void
}

const getFileIcon = (type: string) => {
  if (type.includes('image'))
    return <ImageIcon className="h-4 w-4 text-emerald-600" />
  if (type.includes('pdf')) return <FileText className="h-4 w-4 text-red-500" />
  return <FileIcon className="h-4 w-4 text-muted-foreground/70" />
}

export const SuggestionAttachments = memo(
  ({ files, onFileChange }: SuggestionAttachmentsProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const triggerFileInput = () => fileInputRef.current?.click()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files)
        onFileChange([...files, ...newFiles])
      }
      if (e.target) e.target.value = ''
    }

    const handleRemoveFile = (indexToRemove: number) => {
      onFileChange(files.filter((_, index) => index !== indexToRemove))
    }

    return (
      <div>
        {files.length > 0 && (
          <div className="flex justify-end mb-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={triggerFileInput}
              className="h-8 text-xs cursor-pointer"
            >
              <Paperclip className="w-3 h-3 mr-2" />
              Adicionar
            </Button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileSelect}
        />

        <FieldSet className="border-none p-0 shadow-none">
          {files.length === 0 ? (
            <div className="cs-dropzone" onClick={triggerFileInput}>
              <div className="cs-dropzone-icon">
                <CloudUpload className="size-6" />
              </div>
              <div>
                <p className="text-[13.5px] font-semibold text-foreground">
                  Arraste arquivos ou clique para anexar
                </p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                  Imagens ou PDFs que ilustrem sua ideia
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-1.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-muted">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="cs-file-row group"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="cs-file-icon">{getFileIcon(file.type)}</div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-medium text-foreground/80 truncate max-w-[180px]">
                        {file.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="cs-file-remove"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </FieldSet>
      </div>
    )
  },
)
