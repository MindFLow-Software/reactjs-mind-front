import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/confirm-dialog/confirm-dialog'

type IDeleteActionButton = {
  onDelete: () => Promise<void>
  itemName?: string
  isLoading?: boolean
}

export function DeleteActionButton({
  onDelete,
  itemName,
  isLoading = false,
}: IDeleteActionButton) {
  const [open, setOpen] = useState(false)

  async function handleConfirm() {
    try {
      await onDelete()
      setOpen(false)
    } catch {
      toast.error('Erro ao excluir o arquivo.')
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        disabled={isLoading}
        onClick={() => setOpen(true)}
      >
        {isLoading ? <Loader2 className="animate-spin" /> : <Trash2 />}
      </Button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        variant="destructive"
        title="Excluir arquivo?"
        description={
          <>
            A exclusão de <strong>{itemName}</strong> é permanente e não poderá
            ser desfeita.
          </>
        }
        confirmLabel="Sim, Excluir"
        pending={isLoading}
        onConfirm={handleConfirm}
      />
    </>
  )
}
