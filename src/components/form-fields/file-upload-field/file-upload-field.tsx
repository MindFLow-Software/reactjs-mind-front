import { CloudUpload, FileText, X } from 'lucide-react'
import { useDropzone, type Accept } from 'react-dropzone'

import { Button } from '@/components/ui/button'
import { IconBox } from '@/components/icon-box/icon-box'
import { cn } from '@/lib/utils'
import { Files } from '@/utils/files'

import './file-upload-field.css'

type IFileUploadFieldProps = {
  upload: {
    files: File[]
    onAddFiles: (files: File[]) => void
    onRemoveFile: (index: number) => void
  }
  accept?: Accept
  multiple?: boolean
  title?: string
  description?: string
  className?: string
}

export function FileUploadField({
  upload,
  accept,
  multiple = true,
  title = 'Arraste arquivos ou clique para anexar',
  description,
  className,
}: IFileUploadFieldProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: upload.onAddFiles,
    accept,
    multiple,
  })

  return (
    <div className={cn('fuf-root', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'fuf-zone',
          isDragActive ? 'fuf-zone--drag' : 'fuf-zone--idle',
        )}
      >
        <input {...getInputProps()} />
        <IconBox icon={CloudUpload} variant="primary" size="md" />
        <div className="fuf-copy">
          <p className="fuf-title">{title}</p>
          {description && <p className="fuf-desc">{description}</p>}
        </div>
      </div>

      {upload.files.length > 0 && (
        <ul className="fuf-list">
          {upload.files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="fuf-item">
              <FileText className="fuf-item-icon" />
              <span className="fuf-item-name">{file.name}</span>
              <span className="fuf-item-size">
                {Files.formatSize(file.size)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="fuf-item-remove"
                aria-label={`Remover ${file.name}`}
                onClick={() => upload.onRemoveFile(index)}
              >
                <X />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
