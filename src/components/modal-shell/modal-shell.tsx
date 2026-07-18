import type { ReactNode } from 'react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

import './modal-shell.css'

type IModalShellAs = 'dialog' | 'sheet'
type IModalShellSheetSide = 'top' | 'right' | 'bottom' | 'left'

type IModalShellProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  as?: IModalShellAs
  side?: IModalShellSheetSide
  title: string
  titleVisuallyHidden?: boolean
  description?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

type IModalShellVariantProps = Omit<IModalShellProps, 'as'>

function renderDialogShell({
  open,
  onOpenChange,
  title,
  titleVisuallyHidden,
  description,
  children,
  footer,
  className,
}: Omit<IModalShellVariantProps, 'side'>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn('ms-content', className)}>
        <DialogHeader>
          <DialogTitle className={cn(titleVisuallyHidden && 'sr-only')}>
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="ms-body">{children}</div>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}

function renderSheetShell({
  open,
  onOpenChange,
  side = 'right',
  title,
  titleVisuallyHidden,
  description,
  children,
  footer,
  className,
}: IModalShellVariantProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className={cn('ms-content', className)}>
        <SheetHeader>
          <SheetTitle className={cn(titleVisuallyHidden && 'sr-only')}>
            {title}
          </SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="ms-body">{children}</div>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  )
}

export function ModalShell({ as = 'dialog', ...props }: IModalShellProps) {
  if (as === 'sheet') {
    return renderSheetShell(props)
  }

  return renderDialogShell(props)
}
