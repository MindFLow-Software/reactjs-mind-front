import './upload-zone.css'
import { memo } from 'react'
import { useDropzone } from 'react-dropzone'
import { CloudUpload, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Files } from '@/utils/files'
import { MAX_DOC_FILES } from '../../constants'

type IUploadZone = {
  selectedFiles: File[]
  onFilesChange: (incoming: File[]) => void
  onRemoveFile: (index: number) => void
}

export const UploadZone = memo(function UploadZone({
  selectedFiles,
  onFilesChange,
  onRemoveFile,
}: IUploadZone) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesChange,
    accept: { 'application/pdf': [], 'image/*': [] },
    multiple: true,
  })

  return (
    <div className="rp-upload-root" onClick={(e) => e.stopPropagation()}>
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
          {selectedFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="rp-upload-file-item">
              <FileText className="size-4 shrink-0 text-blue-600" />
              <span className="rp-upload-file-name">{file.name}</span>
              <span className="rp-upload-file-size">
                {Files.formatSize(file.size)}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onRemoveFile(index)
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
})
