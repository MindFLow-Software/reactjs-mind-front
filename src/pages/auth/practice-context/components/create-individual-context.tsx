import { Form } from '@/components/ui/form'
import { Controller, useForm, type Resolver } from 'react-hook-form'
import { Briefcase, CircleCheck, Repeat2 } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  ContextType,
  SessionFormat,
  translatedSessionFormat,
} from '@/types/psychologist'

import {
  Field,
  FieldSet,
  FieldLabel,
  FieldGroup,
  FieldDescription,
} from '@/components/ui/field'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import {
  createPsychologistPracticeContextSchema,
  type IcreatePsychologistPracticeContext,
} from '@/validators/psychologist-context'

type IcreateIndividualContext = {
  onGoBack: () => void
}

export function CreateIndividualContext({
  onGoBack,
}: IcreateIndividualContext) {
  const methods = useForm<IcreatePsychologistPracticeContext>({
    resolver: zodResolver(
      createPsychologistPracticeContextSchema,
    ) as Resolver<IcreatePsychologistPracticeContext>,
    defaultValues: {
      nickname: '',
      contextType: ContextType.INDIVIDUAL,
      sessionFormat: SessionFormat.ONLINE,
      consultationFee: 0,
    },
  })

  const { watch, control } = methods

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
            <div className="flex items-center justify-center p-3 w-fit rounded-md text-white bg-emerald-500/75">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-lg">Contexto Individual</h2>
              <p className="text-xs">
                Configure seu espaço de trabalho independente.
              </p>
            </div>
          </div>
        </CardHeader>
        <Form {...methods}>
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
                      <div className="relative">
                        <span className="absolute top-[9px] left-2 text-sm">
                          R$
                        </span>
                        <Input
                          {...field}
                          className="pl-8"
                          id="consultationFee"
                          placeholder="Valor da consulta"
                        />
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>

              <FieldGroup>
                <Controller
                  name="sessionFormat"
                  control={control}
                  render={({ field }) => (
                    <Field>
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
        </Form>
      </Card>
    </div>
  )
}
