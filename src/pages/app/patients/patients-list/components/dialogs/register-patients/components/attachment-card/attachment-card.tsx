import './attachment-card.css'
import { Download, Eye } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Files } from '@/utils/files'
import { Time } from '@/utils/time'
import type { IAttachmentPatientItem } from '@/types/attachment/attachment-patient-item'

import { DeleteActionButton } from '../delete-attachments-button/delete-attachments-button'

type IAttachmentCard = {
  file: IAttachmentPatientItem
  remove: { onRemove: (id: string) => Promise<unknown>; isRemoving: boolean }
}

export function AttachmentCard({ file, remove }: IAttachmentCard) {
  const kind = Files.kind(file.type ?? '')
  const fileStyle = Files.KIND_STYLES[kind]

  return (
    <div className="rp-att-card">
      <div className={cn('rp-att-badge', fileStyle.gradient)}>
        {fileStyle.label}
        <div className="rp-att-badge-fold" />
      </div>

      <div className="rp-att-info">
        <p className="rp-att-name">{file.filename}</p>
        <div className="rp-att-meta">
          <span>{Files.formatSize(file.size)}</span>
          <span className="rp-att-meta-dot" />
          <span>Enviado {Time.toBrazilianFormat(file.uploadedAt)}</span>
        </div>
      </div>

      <div className="rp-att-actions">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Visualizar"
          onClick={() => window.open(file.url, '_blank')}
          className="rp-att-action"
        >
          <Eye className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Baixar"
          onClick={() => Files.download(file.id, file.filename)}
          className="rp-att-action"
        >
          <Download className="size-3.5" />
        </Button>
        <DeleteActionButton
          onDelete={async () => {
            await remove.onRemove(file.id)
          }}
          itemName={file.filename}
          isLoading={remove.isRemoving}
        />
      </div>
    </div>
  )
}
