import type { ReactNode } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  OctagonAlert,
  type LucideIcon,
} from 'lucide-react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { IconBox } from '@/components/icon-box/icon-box'

import './confirm-dialog.css'

export type IConfirmDialogVariant = 'destructive' | 'warning' | 'success'

type IConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant?: IConfirmDialogVariant
  icon?: LucideIcon
  title: string
  description?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  pending?: boolean
  onConfirm: () => void
}

const VARIANT_ICON: Record<IConfirmDialogVariant, LucideIcon> = {
  destructive: OctagonAlert,
  warning: AlertTriangle,
  success: CheckCircle2,
}

const VARIANT_ICON_BOX_TONE: Record<
  IConfirmDialogVariant,
  'destructive' | 'warning' | 'success'
> = {
  destructive: 'destructive',
  warning: 'warning',
  success: 'success',
}

const VARIANT_BUTTON: Record<IConfirmDialogVariant, 'destructive' | 'default'> =
  {
    destructive: 'destructive',
    warning: 'default',
    success: 'default',
  }

export function ConfirmDialog({
  open,
  onOpenChange,
  variant = 'destructive',
  icon,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  pending = false,
  onConfirm,
}: IConfirmDialogProps) {
  const Icon = icon ?? VARIANT_ICON[variant]

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader className="cd-header">
          <IconBox
            icon={Icon}
            variant={VARIANT_ICON_BOX_TONE[variant]}
            size="md"
          />
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>
            {cancelLabel}
          </AlertDialogCancel>
          <Button
            variant={VARIANT_BUTTON[variant]}
            disabled={pending}
            onClick={onConfirm}
          >
            {pending && (
              <Loader2 data-icon="inline-start" className="animate-spin" />
            )}
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
