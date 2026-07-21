import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Pencil, Target } from 'lucide-react'
import type { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconBadge, IconBadgeTone } from '@/components/icon-badge/icon-badge'
import { cn } from '@/lib/utils'

import {
  updateGoalsSchema,
  type UpdateGoalsFormData,
} from '@/validators/dashboard/form/update-goals-schema'
import { useUpdatePsychologistGoals } from '../../hooks/use-update-psychologist-goals'

import './edit-goals-dialog.css'

export type IEditGoalsDialogCurrent = {
  sessions: number
  hours: number
  activePatients: number
}

type IEditGoalsDialog = {
  current: IEditGoalsDialogCurrent
}

function buildDefaultValues(
  current: IEditGoalsDialogCurrent,
): UpdateGoalsFormData {
  return {
    monthlySessionsTarget: current.sessions,
    monthlyHoursTarget: current.hours,
    activePatientsTarget: current.activePatients,
  }
}

export function EditGoalsDialog({ current }: IEditGoalsDialog) {
  const [open, setOpen] = useState(false)

  const form = useForm<
    z.input<typeof updateGoalsSchema>,
    unknown,
    z.output<typeof updateGoalsSchema>
  >({
    resolver: zodResolver(updateGoalsSchema),
    mode: 'onTouched',
    defaultValues: buildDefaultValues(current),
  })

  const {
    control,
    reset,
    handleSubmit,
    formState: { isDirty, isValid },
  } = form

  const { mutateAsync: updateGoalsFn, isPending } = useUpdatePsychologistGoals()

  useEffect(() => {
    if (!open) return
    reset(buildDefaultValues(current))
  }, [open, current, reset])

  async function onSubmit(data: UpdateGoalsFormData) {
    await updateGoalsFn(data)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="eg-trigger-btn">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="eg-content">
        <DialogHeader className="eg-header">
          <IconBadge tone={IconBadgeTone.BLUE}>
            <Target className="size-5" />
          </IconBadge>
          <div className="flex flex-col">
            <DialogTitle className="eg-title">Editar metas do mês</DialogTitle>
            <DialogDescription className="eg-subtitle">
              Defina os novos alvos mensais de sessões, horas e pacientes
              ativos.
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="eg-form">
            <FormField
              control={control}
              name="monthlySessionsTarget"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Meta de sessões</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value as number}
                      type="number"
                      min={0}
                      className={cn(
                        'eg-input',
                        fieldState.invalid &&
                          'border-destructive focus-visible:ring-destructive/20',
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="monthlyHoursTarget"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Meta de horas</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value as number}
                      type="number"
                      min={0}
                      className={cn(
                        'eg-input',
                        fieldState.invalid &&
                          'border-destructive focus-visible:ring-destructive/20',
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="activePatientsTarget"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Meta de pacientes ativos</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value as number}
                      type="number"
                      min={0}
                      className={cn(
                        'eg-input',
                        fieldState.invalid &&
                          'border-destructive focus-visible:ring-destructive/20',
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="eg-footer">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="eg-submit-btn"
                disabled={isPending || !isDirty || !isValid}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar metas'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
