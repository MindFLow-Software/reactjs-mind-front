import { Navigate, useParams } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from '@/components/ui/card'

import { RegistrationLinkProfessional } from './components/registration-link-professional/registration-link-professional'
import { RegisterPatientViaRegistrationLinkForm } from './components/register-patient-via-registration-link-form/register-patient-via-registration-link-form'
import { useRegistrationLink } from './hooks/use-registration-link'
import type { IRegistrationLinkRouteParams } from '../../shared/registration-link-route-params'

import './register-patient-via-registration-link-page.css'

export function RegisterPatientViaRegistrationLinkPage() {
  const { hash } = useParams<IRegistrationLinkRouteParams>()

  const { registrationLink, isRegistrationLinkInvalid } =
    useRegistrationLink(hash)

  if (isRegistrationLinkInvalid) {
    return <Navigate to="/sign-in" replace />
  }

  return (
    <Card className="rprlp-card">
      <CardHeader className="rprlp-header">
        <div className="rprlp-intro">
          <CardTitle className="rprlp-title">
            Crie sua conta para iniciar seu acompanhamento
          </CardTitle>
          <CardDescription className="rprlp-description">
            Preencha seus dados para criar sua conta. Ao finalizar, seu perfil
            será vinculado automaticamente ao profissional responsável pelo
            convite.
          </CardDescription>
        </div>

        <RegistrationLinkProfessional registrationLink={registrationLink} />
      </CardHeader>

      <CardContent className="rprlp-content">
        <RegisterPatientViaRegistrationLinkForm hash={hash} />
      </CardContent>

      <CardFooter className="rprlp-footer">
        <ShieldCheck size={16} className="text-success" />
        <p className="rprlp-notice">
          Seus dados serão utilizados apenas para criar sua conta e organizar
          seu acompanhamento profissional.
        </p>
      </CardFooter>
    </Card>
  )
}
