import { CloudUpload, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'

import { IconBox } from '@/components/icon-box/icon-box'
import { uploadAttachment } from '@/api/attachments/upload-attachment'
import { uploadFileSchema } from '@/validators/attachments/form/upload-attachment-schema'
import { cn } from '@/lib/utils'
import { patientAttachmentsQueryKey } from '../../hooks/use-patient-files'

import './file-upload-zone.css'

const DROPZONE_ACCEPT = {
  'image/jpeg': [],
  'image/png': [],
  'application/pdf': [],
} satisfies Record<string, string[]>

type FileUploadZoneProps = {
  patientId: string
}

export function FileUploadZone({ patientId }: FileUploadZoneProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: upload, isPending } = useMutation({
    mutationFn: (file: File) => uploadAttachment(file, patientId),
    onSuccess: () => {
      toast.success('Arquivo enviado!')
      queryClient.invalidateQueries({
        queryKey: patientAttachmentsQueryKey(patientId),
      })
    },
    onError: () => toast.error('Erro ao enviar arquivo.'),
  })

  async function handleFileUpload(file: File) {
    const result = uploadFileSchema.safeParse(file)

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? 'Arquivo inválido.')
      return
    }

    await upload(file)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: DROPZONE_ACCEPT,
    multiple: false,
    disabled: isPending,
    onDrop(files) {
      if (files[0]) handleFileUpload(files[0])
    },
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'ph-file-upload-zone',
        isDragActive && 'ph-file-upload-zone--active',
        isPending && 'ph-file-upload-zone--pending',
      )}
    >
      <input {...getInputProps()} />

      {isPending ? (
        <div className="ph-file-upload-zone__icon">
          <Loader2 className="ph-file-upload-zone__loader" />
        </div>
      ) : (
        <IconBox icon={CloudUpload} variant="primary" size="md" />
      )}

      <div>
        <p className="ph-file-upload-zone__label">
          {isPending
            ? 'Enviando arquivo...'
            : 'Arraste arquivos ou clique para anexar'}
        </p>
        <p className="ph-file-upload-zone__hint">
          PDFs, imagens ou áudios · até 5 MB cada · vinculados a este paciente
        </p>
      </div>
    </div>
  )
}
