import './upload-zone.css'
import { memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/utils/format-file-size'
import { MAX_DOC_FILES } from '../constants'

interface UploadZoneProps {
  selectedFiles: File[]
  onFilesChange: (incoming: File[]) => void
  onRemoveFile: (index: number) => void
}

export const UploadZone = memo(
  ({ selectedFiles, onFilesChange, onRemoveFile }: UploadZoneProps) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: onFilesChange,
      accept: { 'application/pdf': [], 'image/*': [] },
      multiple: true,
    })

    return (
      <div
        className="flex flex-col gap-[10px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          {...getRootProps()}
          className={cn(
            'rp-upload-zone',
            isDragActive ? 'rp-upload-zone--drag' : 'rp-upload-zone--idle',
          )}
        >
          <input {...getInputProps()} />
          <div className="rp-upload-zone__icon-box">
            <CloudUpload className="size-6" />
          </div>
          <div>
            <p className="rp-upload-zone__title">
              Arraste arquivos ou clique para anexar
            </p>
            <p className="rp-upload-zone__desc">
              PDFs ou imagens · máximo {MAX_DOC_FILES} arquivos · até 3 MB cada
            </p>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="rp-upload-file-list">
            {selectedFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="rp-upload-file-item">
                <FileText className="size-4 shrink-0 text-blue-600" />
                <span className="rp-upload-file-name">{file.name}</span>
                <span className="rp-upload-file-size">
                  {formatFileSize(file.size)}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemoveFile(i)
                  }}
                  className="rp-upload-file-remove"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  },
)

UploadZone.displayName = 'UploadZone'
