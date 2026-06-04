import './delete-attachments-button.css'
import { useState } from 'react'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

interface DeleteActionButtonProps {
  onDelete: () => Promise<void>
  itemName?: string
  isLoading?: boolean
  className?: string
}

export function DeleteActionButton({
  onDelete,
  itemName,
  isLoading = false,
  className,
}: DeleteActionButtonProps) {
  const [open, setOpen] = useState(false)

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await onDelete()
      setOpen(false)
    } catch {
      toast.error('Erro ao excluir o arquivo.')
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={isLoading}
          className={cn('rp-delete-btn', className)}
        >
          {isLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rp-delete-dialog">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="rp-delete-dialog__icon">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <AlertDialogTitle className="text-xl font-semibold tracking-tight text-foreground">
              Excluir arquivo?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
            A exclusão de{' '}
            <span className="font-semibold text-foreground break-all">
              {itemName}
            </span>{' '}
            é permanente e não poderá ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="rp-delete-dialog__footer">
          <AlertDialogCancel
            disabled={isLoading}
            className="rp-delete-dialog__cancel"
          >
            Cancelar
          </AlertDialogCancel>
          <Button onClick={handleConfirm} className="rp-delete-dialog__confirm">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Sim, Excluir'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
