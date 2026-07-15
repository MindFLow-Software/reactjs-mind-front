import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, SearchCheck } from 'lucide-react'

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { SecurityNotice } from '@/components/security-notice/security-notice'

import { ClaimCandidateCard } from './components/claim-candidate-card'
import { useClaimCandidates } from './hooks/use-claim-candidates'
import { useCreateClaimRequest } from './hooks/use-create-claim-request'

import './claim-candidates-page.css'

export function ClaimCandidatesPage() {
  const { data } = useClaimCandidates()
  const { mutate: createClaimRequest, isPending } = useCreateClaimRequest()

  const candidates = data?.candidates ?? []

  const handleCreateClaimRequest = useCallback(
    (patientProfileId: string) => {
      createClaimRequest(patientProfileId)
    },
    [createClaimRequest],
  )

  return (
    <div className="cc-shell">
      <main className="cc-main">
        <Link to="/profiles" className="cc-back-link">
          <ArrowLeft size={14} />
          Voltar aos espaços de trabalho
        </Link>
        <div className="cc-section-label">
          <SearchCheck size={16} />
          <p className="text-sm">Vínculos encontrados</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Encontramos possíveis vínculos
            </CardTitle>
            <CardDescription>
              Localizamos alguns perfis criados por profissionais que podem
              estar associados a você. Revise as informações antes de solicitar
              o vínculo.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <SecurityNotice
              className="w-fit"
              description="Por segurança, seus dados completos serão liberados somente após a aprovação do profissional."
            />
            <div className="cc-list">
              {candidates.map((candidate) => (
                <ClaimCandidateCard
                  key={candidate.patientProfileId}
                  candidate={candidate}
                  isDisabled={isPending}
                  onRequestClaim={handleCreateClaimRequest}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
