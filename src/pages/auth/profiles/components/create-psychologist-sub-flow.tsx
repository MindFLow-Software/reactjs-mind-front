import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { createPracticeContext } from '@/api/auth/create-practice-context'
import { createPsychologistProfile } from '@/api/auth/create-psychologist-profile'
import { CONTEXT_TYPE_OPTIONS, EXPERTISE_OPTIONS } from '../constants'

const subFlowSchema = z.object({
  crp: z.string().min(1, 'Obrigatório'),
  expertise: z.enum([
    'CLINICAL',
    'PSYCHOTHERAPIST',
    'NEUROPSYCHOLOGY',
    'INFANT',
    'SOCIAL',
    'JURIDICAL',
    'EDUCATIONAL',
    'ORGANIZATIONAL',
    'OTHER',
  ]),
  professionalBio: z.string().optional(),
  contextType: z.enum(['INDIVIDUAL', 'CLINIC']),
  consultationFee: z
    .string()
    .optional()
    .refine((v) => !v || (!Number.isNaN(Number(v)) && Number(v) > 0), {
      message: 'Valor inválido',
    }),
  nickname: z.string().optional(),
})

type SubFlowData = z.infer<typeof subFlowSchema>

interface CreatePsychologistSubFlowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (contextId: string) => void
}

export function CreatePsychologistSubFlow({
  open,
  onOpenChange,
  onCreated,
}: CreatePsychologistSubFlowProps) {
  const queryClient = useQueryClient()

  const form = useForm<SubFlowData>({
    resolver: zodResolver(subFlowSchema),
    mode: 'onTouched',
    defaultValues: {
      crp: '',
      professionalBio: '',
      contextType: 'INDIVIDUAL',
      consultationFee: '',
      nickname: '',
    },
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: SubFlowData) => {
      await createPsychologistProfile({
        crp: data.crp,
        expertise: data.expertise,
        professionalBio: data.professionalBio?.trim() || null,
      })
      return createPracticeContext({
        contextType: data.contextType,
        consultationFee: data.consultationFee
          ? Math.round(Number(data.consultationFee) * 100)
          : null,
        nickname: data.nickname?.trim() || null,
      })
    },
  })

  const onSubmit = useCallback(
    async (data: SubFlowData) => {
      try {
        const context = await mutateAsync(data)
        await queryClient.invalidateQueries({ queryKey: ['me'] })
        onCreated(context.id)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
            error.apiCode === 'CRP_ALREADY_IN_USE' ||
            error.apiCode === 'CRP_ALREADY_EXISTS'
          ) {
            form.setError('crp', {
              type: 'server',
              message: 'CRP já cadastrado.',
            })
            return
          }
          toast.error(error.message || 'Erro ao criar perfil de psicólogo.')
          return
        }
        toast.error('Erro ao criar perfil de psicólogo.')
      }
    },
    [mutateAsync, queryClient, onCreated, form],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar perfil de psicólogo</DialogTitle>
          <DialogDescription>
            Informe seus dados profissionais e configure seu primeiro contexto
            de atendimento.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="crp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRP</FormLabel>
                  <FormControl>
                    <Input placeholder="06/123456" autoComplete="off" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área de atuação</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPERTISE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="professionalBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio profissional (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Conte um pouco sobre sua atuação"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contextType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de atendimento</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CONTEXT_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consultationFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor da sessão (R$, opcional)</FormLabel>
                  <FormControl>
                    <Input
                      inputMode="decimal"
                      placeholder="150.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apelido do contexto (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Consultório centro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 font-medium text-white hover:bg-blue-700"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" /> Criando…
                  </>
                ) : (
                  'Criar e acessar'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
