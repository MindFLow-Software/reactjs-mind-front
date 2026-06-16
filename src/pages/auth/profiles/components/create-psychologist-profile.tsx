import { useCallback } from 'react'

import { Loader2 } from 'lucide-react'
import { useForm, type Resolver } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { z } from 'zod'
import axios from 'axios'
import { toast } from 'sonner'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'

import {
  Form,
  FormItem,
  FormLabel,
  FormField,
  FormMessage,
  FormControl,
} from '@/components/ui/form'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '@/components/ui/select'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

// import { createPracticeContext } from '@/api/auth/create-practice-context'
import { createPsychologistProfile } from '@/api/auth/create-psychologist-profile'
import { createPsychologistProfileSchema } from '@/validators/psychologist-profile'
import { CONTEXT_TYPE_OPTIONS, EXPERTISE_OPTIONS } from '../constants'

type IcreatePsychologistProfile = z.infer<
  typeof createPsychologistProfileSchema
>

interface createPsychologistProfileProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (contextId: string) => void
}

export function CreatePsychologistProfile({
  open,
  onOpenChange,
  // onCreated,
}: createPsychologistProfileProps) {
  const queryClient = useQueryClient()

  const form = useForm<IcreatePsychologistProfile>({
    resolver: zodResolver(
      createPsychologistProfileSchema,
    ) as Resolver<IcreatePsychologistProfile>,
    defaultValues: {
      crp: '',
      professionalBio: '',
      contextType: 'INDIVIDUAL',
      consultationFee: '',
      nickname: '',
      expertise: 'CLINICAL',
    },
  })

  const { control, setError, handleSubmit } = form

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: IcreatePsychologistProfile) => {
      await createPsychologistProfile({
        crp: data.crp,
        expertise: data.expertise,
        professionalBio: data.professionalBio || null,
      })
      // return createPracticeContext({
      //   contextType: data.contextType,
      //   consultationFee: data.consultationFee
      //     ? Math.round(Number(data.consultationFee) * 100)
      //     : null,
      //   nickname: data.nickname || null,
      // })
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['me'] })
      // onCreated(context.id)
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        if (
          error.apiCode === 'CRP_ALREADY_IN_USE' ||
          error.apiCode === 'CRP_ALREADY_EXISTS'
        ) {
          setError('crp', {
            type: 'server',
            message: 'CRP já cadastrado.',
          })
          return
        }
        toast.error(error.message || 'Erro ao criar perfil de psicólogo.')
        return
      }
      toast.error('Erro ao criar perfil de psicólogo.')
    },
  })

  const onSubmit = useCallback(
    async (data: IcreatePsychologistProfile) => {
      await mutateAsync(data)
    },
    [mutateAsync],
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
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={control}
              name="crp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRP</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="06/123456"
                      autoComplete="off"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="expertise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área de atuação</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
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
              control={control}
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
              control={control}
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
              control={control}
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
              control={control}
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
