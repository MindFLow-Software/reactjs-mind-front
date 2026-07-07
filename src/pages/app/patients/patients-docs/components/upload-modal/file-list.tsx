import { Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { formatFileSize } from '@/utils/format-file-size'
import type { FileItem } from '@/hooks/use-upload'
import { FileThumb } from './file-thumb'

interface FileListProps {
  files: FileItem[]
  onRemove: (id: string) => void
  onClear: () => void
}

export function FileList({ files, onRemove, onClear }: FileListProps) {
  if (files.length === 0) return null

  return (
    <div className="pd-up-list">
      <div className="pd-up-list-head">
        <p className="pd-up-list-count">
          {files.length} {files.length === 1 ? 'arquivo' : 'arquivos'}
        </p>
        <button type="button" onClick={onClear} className="pd-up-list-clear">
          Limpar tudo
        </button>
      </div>

      {files.map((item) => (
        <div key={item.id} className="pd-up-item">
          <FileThumb type={item.file.type} />

          <div className="pd-up-item-body">
            <p className="pd-up-item-name">{item.file.name}</p>
            <div className="pd-up-item-meta">
              <p className="pd-up-item-size">
                {formatFileSize(item.file.size)}
              </p>
              {item.status === 'error' && (
                <p className="pd-up-item-error">{item.error}</p>
              )}
            </div>

            {item.status === 'uploading' && (
              <div className="pd-up-progress">
                <div
                  className="pd-up-progress-bar"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}
            {item.status === 'done' && (
              <div className="pd-up-progress-done">
                <div className="pd-up-progress-done-bar" />
              </div>
            )}
            {item.status === 'error' && (
              <div className="pd-up-progress-error">
                <div className="pd-up-progress-error-bar" />
              </div>
            )}
          </div>

          <div className="shrink-0">
            {item.status === 'uploading' && (
              <Loader2 className="size-4 animate-spin text-primary" />
            )}
            {item.status === 'done' && (
              <CheckCircle2 className="size-4 text-green-600" />
            )}
            {item.status === 'error' && (
              <AlertCircle className="size-4 text-destructive" />
            )}
            {item.status === 'pending' && (
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="pd-up-item-remove"
              >
                <Trash2 className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
