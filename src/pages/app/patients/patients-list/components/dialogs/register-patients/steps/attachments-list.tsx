import './attachments-list.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Eye, Download, FileText, Loader2 } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { getPatientAttachments } from '@/api/attachments/get-patient-attachments'
import { deleteAttachment } from '@/api/attachments/delete-attachment'
import { handleFileDownload } from '@/utils/handle-file-download'
import { formatFileSize } from '@/utils/format-file-size'
import { getFileKind, FILE_KIND_STYLES } from '@/utils/file-helpers'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DeleteActionButton } from './delete-attachments-button'
import type { AttachmentPatientItem } from '@/types/attachment'

interface AttachmentsBodyProps {
  isLoading: boolean
  attachments: AttachmentPatientItem[] | undefined
  isRemoving: boolean
  onRemove: (id: string) => Promise<unknown>
}

function AttachmentsBody({
  isLoading,
  attachments,
  isRemoving,
  onRemove,
}: AttachmentsBodyProps) {
  if (isLoading)
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-5 animate-spin text-blue-500/50" />
      </div>
    )
  if (!attachments || attachments.length === 0)
    return <p className="rp-att-empty">Nenhum documento enviado ainda.</p>
  return (
    <div className="rp-att-grid">
      {attachments.map((file) => {
        const kind = getFileKind(file.type ?? '')
        const fileStyle = FILE_KIND_STYLES[kind]
        const uploadDate = format(parseISO(file.uploadedAt), 'dd/MM/yyyy', {
          locale: ptBR,
        })
        return (
          <div key={file.id} className="rp-att-card">
            <div className={cn('rp-att-badge', fileStyle.gradient)}>
              {fileStyle.label}
              <div
                className="absolute right-0 top-0"
                style={{
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: '9px 9px 0 0',
                  borderColor: 'white white transparent transparent',
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="rp-att-name">{file.filename}</p>
              <div className="rp-att-meta">
                <span>{formatFileSize(file.size)}</span>
                <span className="size-1.5 shrink-0 rounded-full bg-border" />
                <span>Enviado {uploadDate}</span>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Visualizar"
                onClick={() => window.open(file.url, '_blank')}
                className="h-[28px] w-[28px] rounded-[5px]"
              >
                <Eye className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Baixar"
                onClick={() => handleFileDownload(file.id, file.filename)}
                className="h-[28px] w-[28px] rounded-[5px]"
              >
                <Download className="size-3.5" />
              </Button>
              <DeleteActionButton
                onDelete={async () => {
                  await onRemove(file.id)
                }}
                itemName={file.filename}
                isLoading={isRemoving}
                className="h-[28px] w-[28px] rounded-[5px]"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface AttachmentsListProps {
  patientId: string | null
}

export function AttachmentsList({ patientId }: AttachmentsListProps) {
  const queryClient = useQueryClient()

  const { data: attachments, isLoading } = useQuery({
    queryKey: ['attachments', patientId],
    queryFn: () => getPatientAttachments(patientId!),
    enabled: Boolean(patientId),
  })

  const { mutateAsync: removeFn, isPending: isRemoving } = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['attachments', patientId],
      })
      toast.success('Documento removido.')
    },
    onError: () => {
      toast.error('Erro ao excluir o arquivo.')
    },
  })

  return (
    <div>
      <div className="rp-section-title">
        <FileText className="rp-section-title__icon" />
        <span className="rp-section-title__label">Documentos enviados</span>
        {attachments && attachments.length > 0 && (
          <span className="ml-0.5 rounded-[10px] bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
            {attachments.length}
          </span>
        )}
      </div>

      <AttachmentsBody
        isLoading={isLoading}
        attachments={attachments}
        isRemoving={isRemoving}
        onRemove={removeFn}
      />
    </div>
  )
}
