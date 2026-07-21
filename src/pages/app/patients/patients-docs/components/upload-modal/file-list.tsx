import { Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Files } from '@/utils/files'
import { FileStatus, type IFileItem } from '../../hooks/use-upload'
import { FileThumb } from './file-thumb'
import './file-list.css'

type FileListProps = {
  files: IFileItem[]
  onRemove: (id: string) => void
  onClear: () => void
}

function FileItemStatusIcon({
  item,
  onRemove,
}: {
  item: IFileItem
  onRemove: (id: string) => void
}) {
  switch (item.status) {
    case FileStatus.UPLOADING:
      return <Loader2 className="size-4 animate-spin text-primary" />
    case FileStatus.DONE:
      return <CheckCircle2 className="size-4 text-success" />
    case FileStatus.ERROR:
      return <AlertCircle className="size-4 text-destructive" />
    case FileStatus.PENDING:
      return (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Remover arquivo"
          onClick={() => onRemove(item.id)}
          className="pd-up-item-remove"
        >
          <Trash2 className="size-3.5" />
        </Button>
      )
  }
}

function FileItemProgressBar({ item }: { item: IFileItem }) {
  switch (item.status) {
    case FileStatus.UPLOADING:
      return (
        <div className="pd-up-progress">
          <div
            className="pd-up-progress-bar"
            style={{ width: `${item.progress}%` }}
          />
        </div>
      )
    case FileStatus.DONE:
      return (
        <div className="pd-up-progress-done">
          <div className="pd-up-progress-done-bar" />
        </div>
      )
    case FileStatus.ERROR:
      return (
        <div className="pd-up-progress-error">
          <div className="pd-up-progress-error-bar" />
        </div>
      )
    case FileStatus.PENDING:
      return null
  }
}

export function FileList({ files, onRemove, onClear }: FileListProps) {
  if (files.length === 0) return null

  return (
    <div className="pd-up-list">
      <div className="pd-up-list-head">
        <p className="pd-up-list-count">
          {files.length} {files.length === 1 ? 'arquivo' : 'arquivos'}
        </p>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="pd-up-list-clear h-auto p-0"
          onClick={onClear}
        >
          Limpar tudo
        </Button>
      </div>

      {files.map((item) => (
        <div key={item.id} className="pd-up-item">
          <FileThumb type={item.file.type} />

          <div className="pd-up-item-body">
            <p className="pd-up-item-name">{item.file.name}</p>
            <div className="pd-up-item-meta">
              <p className="pd-up-item-size">
                {Files.formatSize(item.file.size)}
              </p>
              {item.status === FileStatus.ERROR && (
                <p className="pd-up-item-error">{item.error}</p>
              )}
            </div>

            <FileItemProgressBar item={item} />
          </div>

          <div className="shrink-0">
            <FileItemStatusIcon item={item} onRemove={onRemove} />
          </div>
        </div>
      ))}
    </div>
  )
}
