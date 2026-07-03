'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, User, Mail, Phone, Briefcase } from 'lucide-react'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { formatPhone } from '@/utils/formatPhone'
import type { UpdatePsychologistBody } from '@/api/psychologists/update-psychologist'
import {
  updatePsychologistSchema,
  type UpdatePsychologistData,
} from '@/validators/psychologists/form/update-psychologist-schema'
import { EXPERTISE_TRANSLATIONS } from '@/utils/mappers'
import { cn } from '@/lib/utils'
import { useUpdatePsychologist } from '../hooks/use-update-psychologist'
import './edit-psychologist-dialog.css'

interface EditPsychologistProfileProps {
  psychologist: {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    crp: string | null
    expertise: UpdatePsychologistBody['expertise']
  }
  onClose?: () => void
}

function buildDefaultValues(
  psychologist: EditPsychologistProfileProps['psychologist'],
): UpdatePsychologistData {
  return {
    firstName: psychologist.firstName,
    lastName: psychologist.lastName,
    email: psychologist.email,
    phoneNumber: formatPhone(psychologist.phoneNumber),
    expertise: psychologist.expertise,
  }
}

export function EditPsychologistProfile({
  psychologist,
  onClose,
}: EditPsychologistProfileProps) {
  const form = useForm<UpdatePsychologistData>({
    resolver: zodResolver(updatePsychologistSchema),
    mode: 'onTouched',
    defaultValues: buildDefaultValues(psychologist),
  })

  const {
    control,
    handleSubmit,
    formState: { isDirty, isValid },
  } = form

  const { mutateAsync: updateProfileFn, isPending } = useUpdatePsychologist()

  async function onSubmit(data: UpdatePsychologistData) {
    await updateProfileFn(data)
    onClose?.()
  }

  return (
    <DialogContent className="acc-edit-content">
      <DialogHeader>
        <DialogTitle className="acc-edit-title">
          <User className="h-5 w-5" />
          Editar Meu Perfil
        </DialogTitle>
        <DialogDescription>
          Altere suas informações profissionais e de contato.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="acc-edit-section-heading">
              <User className="h-4 w-4" />
              <h3 className="acc-edit-section-title">Informações Básicas</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="firstName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(
                          'acc-edit-input',
                          fieldState.invalid &&
                            'border-red-600 focus-visible:ring-red-600/20',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="lastName"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Sobrenome *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={cn(
                          'acc-edit-input',
                          fieldState.invalid &&
                            'border-red-600 focus-visible:ring-red-600/20',
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="acc-edit-section">
            <div className="acc-edit-section-heading">
              <Briefcase className="h-4 w-4" />
              <h3 className="acc-edit-section-title">Atuação Profissional</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="expertise"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Especialidade Principal</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="acc-edit-input">
                          <SelectValue placeholder="Selecione sua área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(EXPERTISE_TRANSLATIONS).map(
                          ([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="acc-edit-section">
            <div className="acc-edit-section-heading">
              <Mail className="h-4 w-4" />
              <h3 className="acc-edit-section-title">Contato</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Profissional</FormLabel>
                    <div className="relative">
                      <Mail className="acc-edit-input-icon" />
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className={cn('acc-edit-input', 'pl-9')}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone / WhatsApp</FormLabel>
                    <div className="relative">
                      <Phone className="acc-edit-input-icon" />
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={15}
                          onChange={(e) =>
                            field.onChange(formatPhone(e.target.value))
                          }
                          className={cn('acc-edit-input', 'pl-9')}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="acc-edit-footer">
            <Button
              className="cursor-pointer"
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !isDirty || !isValid}
              className="acc-edit-submit-btn"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
