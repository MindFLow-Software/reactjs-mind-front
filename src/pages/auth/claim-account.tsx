import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
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
import { Button } from '@/components/ui/button'
import { EmailInput } from '@/components/form-fields/email-input/email-input'
import {
  claimAccountSchema,
  type ClaimAccountData,
} from '@/validators/claim-account/form/claim-account-schema'
import './claim-account.css'

export function ClaimAccountPage() {
  const methods = useForm<ClaimAccountData>({
    resolver: zodResolver(claimAccountSchema),
    defaultValues: {
      email: '',
    },
  })

  const { handleSubmit } = methods

  const { mutateAsync, isPending: isSendingEmail } = useMutation<
    void,
    Error,
    ClaimAccountData
  >({
    mutationKey: ['send-claim-account-email'],
    mutationFn: async () => {},
  })

  const handleSendClaimAccountEmail = async (data: ClaimAccountData) => {
    await mutateAsync(data)
  }

  const isDisabled = isSendingEmail

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="gap-3">
        <div className="flex items-center gap-2">
          <div className="claim-icon-badge bg-linear-to-br from-(--auth-navy-800) to-(--auth-navy-600)">
            <Lock size={24} className="text-white" />
          </div>
          <CardTitle className="m-0 text-xl">Finalizar Cadastro</CardTitle>
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
            <EmailInput<ClaimAccountData>
              name="email"
              label="Email"
              placeholder="ex: seuEmail@mindflush.com"
              disabled={isDisabled}
            />
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={isDisabled}>
              Enviar Email
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
