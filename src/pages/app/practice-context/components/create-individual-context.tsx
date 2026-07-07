import './create-individual-context.css'

import { useForm, type Resolver } from 'react-hook-form'
import { Briefcase, CircleCheck, Repeat2 } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  ContextType,
  SessionFormat,
  translatedSessionFormat,
  type CreatePracticeContextBody,
} from '@/types/psychologist'

import {
  Form,
  FormControl,
  FormDescription,
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

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import {
  createPsychologistPracticeContextSchema,
  type ICreatePsychologistPracticeContext,
} from '@/validators/psychologist-context'
import { TitleIcon } from '@/components/title-icon'
import { PracticeContextHeader } from './practice-context-header'
import { SessionFormatToggle } from './session-format-toggle'

const SESSION_FORMAT_OPTIONS = [
  { value: SessionFormat.ONLINE, label: translatedSessionFormat.ONLINE },
  { value: SessionFormat.HYBRID, label: translatedSessionFormat.HYBRID },
  { value: SessionFormat.IN_PERSON, label: translatedSessionFormat.IN_PERSON },
] as const

type ICreateIndividualContext = {
  onGoBack: () => void
  onCreatPracticeContext: (data: CreatePracticeContextBody) => void
}

export function CreateIndividualContext({
  onGoBack,
  onCreatPracticeContext,
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

      <button type="button" onClick={onGoBack} className="pc-switch">
        <Repeat2 size={15} />
        Trocar contexto
      </button>

      <Card className="pc-cfg-card">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCreatPracticeContext)}>
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
                <FormField
                  control={form.control}
                  name="nickname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apelido</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite seu apelido"
                          className="pc-input"
                        />
                      </FormControl>
                      <FormDescription className="pc-field-hint">
                        Apresentado aos seus pacientes.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
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
                <FormField
                  control={form.control}
                  name="openFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de abertura</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" className="pc-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="closeAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de fechamento</FormLabel>
                      <FormControl>
                        <Input {...field} type="time" className="pc-input" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="pc-cfg-foot">
              <Button
                type="submit"
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Finalizar
                <CircleCheck size={16} />
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  )
}
