import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

import { DialogClose } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ModalShell } from '@/components/modal-shell/modal-shell'

type IFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  titleVisuallyHidden?: boolean
  description?: ReactNode
  children: ReactNode
  submitLabel?: string
  cancelLabel?: string
  pending?: boolean
  onSubmit: () => void
  className?: string
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  titleVisuallyHidden,
  description,
  children,
  submitLabel = 'Salvar',
  cancelLabel = 'Cancelar',
  pending = false,
  onSubmit,
  className,
}: IFormDialogProps) {
  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      titleVisuallyHidden={titleVisuallyHidden}
      description={description}
      className={className}
      footer={
        <>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={pending}>
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button type="button" disabled={pending} onClick={onSubmit}>
            {pending && (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            )}
            {submitLabel}
          </Button>
        </>
      }
    >
      {children}
    </ModalShell>
  )
}
