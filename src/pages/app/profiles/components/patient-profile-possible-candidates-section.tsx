import './patient-profile-possible-candidates-section.css'

import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Key, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { fetchClaimCandidates } from '@/api/patient-profiles/fetch-claim-candidates'

export function PatientProfilePossibleCandidatesSection() {
  const navigate = useNavigate()

  const { data } = useQuery({
    queryKey: ['claim-candidates'],
    queryFn: fetchClaimCandidates,
    staleTime: 1000 * 60 * 5,
  })

  const count = data?.candidates.length ?? 0

  return (
    <div className="vc-root">
      <div className="vc-body">
        <div className="vc-icon bg-blue-50 border border-blue-200 text-blue-600 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400">
          <Key size={22} />
        </div>
        <div className="vc-text">
          <h3 className="vc-title">Encontramos perfis que podem ser seus</h3>
          <p className="vc-desc">
            Há perfis de paciente cadastrados com o seu CPF que podem estar
            relacionados à sua conta. Você pode visualizá-los e solicitar
            vínculo, caso pertençam a você.
          </p>
        </div>
        <div className="vc-side">
          <span className="vc-count text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400">
            {count} perfis encontrados
          </span>
          <Button onClick={() => navigate('/profiles/claim-candidates')}>
            Visualizar possíveis vínculos
            <ArrowRight size={16} />
          </Button>
          <p className="vc-note">
            <ShieldCheck
              size={12}
              className="text-green-600 dark:text-green-400"
            />
            Identificação por CPF, sem ações automáticas.
          </p>
        </div>
      </div>
    </div>
  )
}
