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
          'shrink-0 flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-all duration-150',
          isDragging
            ? 'border-primary bg-blue-50 dark:bg-blue-950/20'
            : 'border-border bg-muted/40 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-950/10',
        )}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-blue-100 bg-card dark:border-blue-900">
          <CloudUpload className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-[13.5px] font-semibold text-foreground">
            {isDragging
              ? 'Solte para enviar'
              : 'Arraste arquivos aqui ou clique para selecionar'}
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
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
