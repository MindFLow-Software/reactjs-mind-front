import './create-individual-context.css'
import '../practice-context-shared.css'

import { useForm, type Resolver } from 'react-hook-form'
import { Briefcase, CircleCheck, Repeat2 } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import { translatedSessionFormat } from '@/constants/translated-session-format'
import { ContextType } from '@/types/psychologist/context-type'
import { SessionFormat } from '@/types/psychologist/session-format'
import type { ICreatePracticeContextBody } from '@/types/psychologist/create-practice-context-body'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { TimeInput } from '@/components/form-fields/time-input/time-input'

import {
  createPsychologistPracticeContextSchema,
  type ICreatePsychologistPracticeContext,
} from '@/validators/psychologists/form/create-practice-context-schema'
import { TitleIcon } from '@/components/title-icon/title-icon'
import { PracticeContextHeader } from '../practice-context-header/practice-context-header'
import { SessionFormatToggle } from '../session-format-toggle/session-format-toggle'

const SESSION_FORMAT_OPTIONS = [
  {
    value: SessionFormat.ONLINE,
    label: translatedSessionFormat[SessionFormat.ONLINE],
  },
  {
    value: SessionFormat.HYBRID,
    label: translatedSessionFormat[SessionFormat.HYBRID],
  },
  {
    value: SessionFormat.IN_PERSON,
    label: translatedSessionFormat[SessionFormat.IN_PERSON],
  },
] as const

type ICreateIndividualContext = {
  onGoBack: () => void
  onCreatePracticeContext: (data: ICreatePracticeContextBody) => void
  isSubmitting?: boolean
}

export function CreateIndividualContext({
  onGoBack,
  onCreatePracticeContext,
  isSubmitting,
}: ICreateIndividualContext) {
  const form = useForm<ICreatePsychologistPracticeContext>({
    resolver: zodResolver(
      createPsychologistPracticeContextSchema,
    ) as Resolver<ICreatePsychologistPracticeContext>,
    defaultValues: {
      nickname: '',
      contextType: ContextType.INDIVIDUAL,
      sessionFormat: SessionFormat.ONLINE,
      consultationFee: 0,
      openFrom: '08:00',
      closeAt: '18:00',
    },
  })

  return (
    <>
      <PracticeContextHeader />

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onGoBack}
        className="pc-switch"
      >
        <Repeat2 data-icon="inline-start" />
        Trocar contexto
      </Button>

      <Card className="pc-cfg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCreatePracticeContext)}>
            <CardHeader className="pc-cfg-head">
              <TitleIcon variant="secondary">
                <Briefcase />
              </TitleIcon>
              <div>
                <h2 className="pc-cfg-title">Contexto Individual</h2>
                <p className="pc-cfg-subtitle">
                  Configure seu espaço de trabalho independente.
                </p>
              </div>
            </CardHeader>

            <CardContent className="pc-cfg-body">
              <div className="pc-row2">
                <TextInput<ICreatePsychologistPracticeContext>
                  name="nickname"
                  label="Apelido"
                  placeholder="Digite seu apelido"
                  description="Apresentado aos seus pacientes."
                />

                <FormField
                  control={form.control}
                  name="consultationFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor da consulta (BRL)</FormLabel>
                      <FormControl>
                        <InputGroup>
                          <InputGroupAddon>R$</InputGroupAddon>
                          <InputGroupInput {...field} className="pc-input" />
                        </InputGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="sessionFormat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Formato da sessão</FormLabel>
                    <FormControl>
                      <SessionFormatToggle
                        options={SESSION_FORMAT_OPTIONS}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pc-row2">
                <TimeInput<ICreatePsychologistPracticeContext>
                  name="openFrom"
                  label="Horário de abertura"
                />
                <TimeInput<ICreatePsychologistPracticeContext>
                  name="closeAt"
                  label="Horário de fechamento"
                />
              </div>
            </CardContent>

            <CardFooter className="pc-cfg-foot">
              <Button type="submit" disabled={isSubmitting}>
                Finalizar
                <CircleCheck data-icon="inline-end" />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  )
}
