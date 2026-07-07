import { useRef } from 'react'
import { CloudUpload } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DropZoneProps {
  isDragging: boolean
  onDragEnter: React.DragEventHandler
  onDragLeave: React.DragEventHandler
  onDrop: React.DragEventHandler
  onFilesSelected: (files: FileList) => void
}

export function DropZone({
  isDragging,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFilesSelected,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <div
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'pd-up-dropzone',
          isDragging ? 'pd-up-dropzone-active' : 'pd-up-dropzone-idle',
        )}
      >
        <div className="pd-up-dropzone-icon">
          <CloudUpload className="size-5 text-primary" />
        </div>
        <div>
          <p className="pd-up-dropzone-title">
            {isDragging
              ? 'Solte para enviar'
              : 'Arraste arquivos aqui ou clique para selecionar'}
          </p>
          <p className="pd-up-dropzone-sub">
            PDF, JPG, PNG, DOCX — até 20 MB cada
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onFilesSelected(e.target.files)
          e.target.value = ''
        }}
      />
    </>
  )
}
