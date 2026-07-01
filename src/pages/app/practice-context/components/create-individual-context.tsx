import { Form } from '@/components/ui/form'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { Briefcase, CircleCheck, Repeat2 } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  ContextType,
  SessionFormat,
  translatedSessionFormat,
  type CreatePracticeContextBody,
} from '@/types/psychologist'

import {
  Field,
  FieldSet,
  FieldLabel,
  FieldGroup,
  FieldDescription,
  FieldError,
} from '@/components/ui/field'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import {
  createPsychologistPracticeContextSchema,
  type CreatePsychologistPracticeContextData,
} from '@/validators/psychologists/form/create-practice-context-schema'
import { TitleIcon } from '@/components/title-icon'

type IcreateIndividualContext = {
  onGoBack: () => void
  onCreatPracticeContext: (data: CreatePracticeContextBody) => void
}

export function CreateIndividualContext({
  onGoBack,
  onCreatPracticeContext,
}: IcreateIndividualContext) {
  const methods = useForm<CreatePsychologistPracticeContextData>({
    resolver: zodResolver(
      createPsychologistPracticeContextSchema,
    ) as Resolver<CreatePsychologistPracticeContextData>,
    defaultValues: {
      nickname: '',
      contextType: ContextType.INDIVIDUAL,
      sessionFormat: SessionFormat.ONLINE,
      consultationFee: 0,
      openFrom: undefined,
      closeAt: undefined,
    },
  })

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = methods

  const selectedSessionFormat = watch('sessionFormat')

  return (
    <div className="w-full max-w-xl mx-auto">
      <Button
        onClick={onGoBack}
        className="text-black bg-transparent border-none hover:bg-transparent gap-1"
      >
        <Repeat2 size={16} />
        Trocar contexto
      </Button>
      <Card className="p-4">
        <CardHeader className="p-0">
          <div className="flex items-center gap-2">
            <TitleIcon variant="primary">
              <Briefcase />
            </TitleIcon>
            <div>
              <h2 className="text-lg">Contexto Individual</h2>
              <p className="text-xs">
                Configure seu espaço de trabalho independente.
              </p>
            </div>
          </div>
        </CardHeader>
        <Form {...methods}>
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onCreatPracticeContext)}
          >
            <CardContent className="p-0">
              <FieldSet className="flex flex-col gap-4">
                <FieldGroup className="flex flex-row items-start gap-2">
                  <Controller
                    name="nickname"
                    control={control}
                    render={({ field }) => (
                      <Field className="gap-1 flex-1">
                        <FieldLabel htmlFor="nickname">Apelido</FieldLabel>
                        <Input
                          {...field}
                          id="nickname"
                          placeholder="Digite seu apelido"
                        />
                        {errors.nickname && (
                          <FieldError>{errors.nickname.message}</FieldError>
                        )}
                        <FieldDescription className="text-xs">
                          Apresentado aos seus pacientes.
                        </FieldDescription>
                      </Field>
                    )}
                  />
                  <Controller
                    name="consultationFee"
                    control={control}
                    render={({ field }) => (
                      <Field className="max-w-40 gap-1">
                        <FieldLabel htmlFor="consultationFee">
                          Valor da consulta (BRL)
                        </FieldLabel>
                        <InputGroup className="max-w-xs">
                          <InputGroupInput
                            {...field}
                            className="pl-8"
                            id="consultationFee"
                            placeholder="Valor da consulta"
                          />
                          <InputGroupAddon>R$</InputGroupAddon>
                        </InputGroup>
                        {errors.consultationFee && (
                          <FieldError>
                            {errors.consultationFee.message}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup>
                  <Controller
                    name="sessionFormat"
                    control={control}
                    render={({ field }) => (
                      <Field className="gap-1">
                        <FieldLabel>Formato da sessão</FieldLabel>
                        <div className="flex gap-2">
                          {Object.values(SessionFormat).map((format) => {
                            return (
                              <Badge
                                key={format}
                                variant="outline"
                                onClick={() => {
                                  field.onChange(format)
                                }}
                                className={`
                                flex-1 py-3 cursor-pointer rounded-sm
                                ${selectedSessionFormat === format && 'bg-violet-200 border border-violet-500 text-violet-500'}
                              `}
                              >
                                {translatedSessionFormat[format]}
                              </Badge>
                            )
                          })}
                        </div>
                        {errors.sessionFormat && (
                          <FieldError>
                            {errors.sessionFormat.message}
                          </FieldError>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <FieldGroup className="flex flex-row items-start gap-4">
                  <Controller
                    name="openFrom"
                    control={control}
                    render={({ field }) => (
                      <Field className="gap-1">
                        <FieldLabel>Horário de abertura</FieldLabel>
                        <Input {...field} type="time" defaultValue="08:00" />
                        {errors.openFrom && (
                          <FieldError>{errors.openFrom.message}</FieldError>
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="closeAt"
                    control={control}
                    render={({ field }) => (
                      <Field className="gap-1">
                        <FieldLabel>Horário de fechamento</FieldLabel>
                        <Input {...field} type="time" defaultValue="18:00" />
                        {errors.closeAt && (
                          <FieldError>{errors.closeAt.message}</FieldError>
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>
              </FieldSet>
            </CardContent>
            <CardFooter className="justify-end p-0">
              <Button
                type="submit"
                variant="outline"
                className="items-center gap-2"
              >
                Finalizar
                <CircleCheck size={16} className="text-green-600" />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
