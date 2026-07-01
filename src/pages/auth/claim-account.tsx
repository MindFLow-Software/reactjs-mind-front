import { useMutation } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { Lock } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import {
  claimAccountSchema,
  type ClaimAccountData,
} from '@/validators/claim-account/form/claim-account-schema'

export function ClaimAccountPage() {
  const methods = useForm<ClaimAccountData>({
    resolver: zodResolver(claimAccountSchema),
    defaultValues: {
      email: '',
    },
  })

  const { control, handleSubmit } = methods

  const { mutateAsync, isPending: isSendingEmail } = useMutation({
    mutationKey: ['send-claim-account-email'],
    mutationFn: async (data: ClaimAccountData) => {
      console.log('data: ', data)
    },
  })

  const handleSendClaimAccountEmail = async (data: ClaimAccountData) => {
    await mutateAsync(data)
  }

  const isDisabled = isSendingEmail

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center p-2 rounded-md w-fit bg-gradient-to-br from-[#16306b] to-[#194ac5]">
            <Lock size={24} className="text-white" />
          </div>
          <CardTitle className="text-xl m-0">Finalizar Cadastro</CardTitle>
        </div>
        <CardDescription className="text-sm">
          Se você já foi cadastrado por um psicólogo anteriormente, podemos
          enviar um link para continuar seu cadastro com segurança.
        </CardDescription>
      </CardHeader>
      <Form {...methods}>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(handleSendClaimAccountEmail)}
        >
          <CardContent>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Field className="gap-1 ">
                      <FieldLabel>Email</FieldLabel>
                      <Input
                        {...field}
                        disabled={isDisabled}
                        placeholder="ex: seuEmail@mindflush.com"
                      />
                    </Field>
                  )}
                />
              </FieldGroup>
            </FieldSet>
          </CardContent>
          <CardFooter className="justify-end">
            <CardDescription></CardDescription>
            <Button type="submit" disabled={isDisabled}>
              Enviar Email
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
