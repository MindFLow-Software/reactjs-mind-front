import { Clock } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { translatedHonorific } from '@/constants/translated-honorific'
import type { IClaimCandidate } from '@/types/claim/claim-candidate'

import './claim-candidate-card.css'

type ClaimCandidateCardProps = {
  candidate: IClaimCandidate
  isDisabled: boolean
  onRequestClaim: (patientProfileId: string) => void
}

type CandidateFieldProps = {
  label: string
  value: string
}

function CandidateField({ label, value }: CandidateFieldProps) {
  return (
    <div>
      <p className="cc-card-field-label">{label}</p>
      <p className="cc-card-field-value">{value}</p>
    </div>
  )
}

export function ClaimCandidateCard({
  candidate,
  isDisabled,
  onRequestClaim,
}: ClaimCandidateCardProps) {
  const initialLetters = candidate.patientFirstName
    ?.slice(0, 1)
    .concat(candidate.patientLastName?.slice(0, 1))
    .toLocaleUpperCase()

  const honorific = translatedHonorific[candidate.psychologistHonorific]

  const createdAt = format(candidate.createdAt, "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <Card className="cc-card">
      <CardHeader className="cc-card-header">
        <div className="flex items-start gap-2">
          <div className="cc-card-avatar">{initialLetters}</div>
          <div>
            <p className="text-sm font-medium capitalize">
              {honorific} {candidate.psychologistDisplayName}
            </p>
            <p className="text-xs">{candidate.psychologistCrp}</p>
          </div>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Clock size={16} />
          <p>Aguardando Confirmação</p>
        </Badge>
      </CardHeader>
      <CardContent className="cc-card-body">
        <CandidateField label="PERFIL CRIADO EM" value={createdAt} />
        <CandidateField
          label="NOME CADASTRADO"
          value={candidate.patientFirstName}
        />
        <CandidateField label="DOCUMENTO" value={candidate.patientCpf} />
        <CandidateField
          label="NASCIMENTO"
          value={candidate.patientDateOfBirth}
        />
      </CardContent>
      <CardFooter className="cc-card-footer">
        <p className="text-xs">
          Informações sensíveis ficam ocultas até a confirmação.
        </p>
        <Button
          size="xs"
          disabled={isDisabled}
          className="p-2 text-xs"
          onClick={() => onRequestClaim(candidate.patientProfileId)}
        >
          Solicitar vínculo
        </Button>
      </CardFooter>
    </Card>
  )
}
