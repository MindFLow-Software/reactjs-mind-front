import './attachments-list.css'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { getPatientAttachments } from '@/api/attachments/get-patient-attachments'
import { deleteAttachment } from '@/api/attachments/delete-attachment'

import { SectionTitle } from '../section-title/section-title'
import { AttachmentCard } from '../attachment-card/attachment-card'

type IAttachmentsList = {
  patientId: string | null
}

export function AttachmentsList({ patientId }: IAttachmentsList) {
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

  function renderBody() {
    if (isLoading) {
      return (
        <div className="rp-att-loading">
          <Loader2 className="size-5 animate-spin text-blue-500/50" />
        </div>
      )
    }

    if (!attachments || attachments.length === 0) {
      return <p className="rp-att-empty">Nenhum documento enviado ainda.</p>
    }

    return (
      <div className="rp-att-grid">
        {attachments.map((file) => (
          <AttachmentCard
            key={file.id}
            file={file}
            remove={{ onRemove: removeFn, isRemoving }}
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      <SectionTitle icon={FileText} label="Documentos enviados">
        {attachments && attachments.length > 0 && (
          <span className="rp-att-count">{attachments.length}</span>
        )}
      </SectionTitle>

      {renderBody()}
    </div>
  )
}
