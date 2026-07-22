import { useParams } from 'react-router-dom'

import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
} from '@/components/ui/card'

import { RegisterViaPatientInviteForm } from './components/register-via-patient-invite-form/register-via-patient-invite-form'
import type { IInviteRouteParams } from '../../shared/invite-route-params'

import './register-via-patient-invite-page.css'

export function RegisterViaPatientInvitePage() {
  const { token } = useParams<IInviteRouteParams>()

  return (
    <Card className="rvpip-card">
      <CardHeader>
        <CardTitle>Finalizar Cadastro</CardTitle>
        <CardDescription>
          Precisamos de algumas informações para criar sua conta e confirmar com
          segurança o vínculo com seu psicólogo.
        </CardDescription>
      </CardHeader>

      <RegisterViaPatientInviteForm token={token} />
    </Card>
  )
}
