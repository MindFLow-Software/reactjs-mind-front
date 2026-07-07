import { useCallback, useEffect, useState } from 'react'

import { useAuth } from '@/hooks/use-auth'
import { useHeaderStore } from '@/store/use-header-store'
import { translatedHonorific } from '@/constants/translated-honorific'

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { Drawer } from '@/components/ui/drawer'
import { Card, CardContent } from '@/components/ui/card'
import { SecurityNotice } from '@/components/security-notice'

import { ClaimRequestRow } from './components/claim-request-row'
import { ReviewClaimRequestDrawer } from './components/review-claim-request-drawer'
import { useClaimProfileRequests } from './hooks/use-claim-profile-requests'

import './claim-profile-requests-page.css'

const TABLE_HEADS = [
  'SOLICITANTE',
  'PERFIL CADASTRADO',
  'CPF / NASCIMENTO',
  'SOLICITADO EM',
  'STATUS',
  'AÇÕES',
] as const

export function ClaimProfileRequestsPage() {
  const { profile } = useAuth()
  const { setTitle } = useHeaderStore()

  const [openClaimRequestId, setOpenClaimRequestId] = useState<string | null>(
    null,
  )

  const { data } = useClaimProfileRequests()

  const claimProfileRequests = data?.requests ?? []

  const honorific = profile?.psychologistProfile?.honorific
    ? translatedHonorific[profile.psychologistProfile.honorific]
    : ''

  const psychologistLabel = `por ${honorific} ${
    profile?.psychologistProfile?.professionalName ?? '--'
  }`

  const handleOpenReviewDrawer = useCallback((claimRequestId: string) => {
    setOpenClaimRequestId(claimRequestId)
  }, [])

  const handleCloseReviewDrawer = useCallback(() => {
    setOpenClaimRequestId(null)
  }, [])

  useEffect(() => {
    setTitle('solicitações de vínculo')
  }, [setTitle])

  return (
    <>
      <main className="cpr-shell">
        <header className="mb-4">
          <h1 className="text-xl">Solicitações de vínculo</h1>
          <p className="text-sm text-muted-foreground">
            Revise os pedidos de pacientes que desejam se conectar a perfis
            cadastrados por você.
          </p>
        </header>
        <SecurityNotice
          className="w-fit"
          description="Aprove apenas solicitações que você reconhece. Em caso de dúvida, recuse ou confirme os dados diretamente com o paciente."
        />
        <Card className="rounded-md">
          <CardContent>
            <Table className="cpr-table">
              <TableHeader>
                <TableRow>
                  {TABLE_HEADS.map((head) => (
                    <TableHead key={head} className="cpr-th">
                      {head}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {claimProfileRequests.map((request) => (
                  <ClaimRequestRow
                    key={request.id}
                    request={request}
                    psychologistLabel={psychologistLabel}
                    onReview={handleOpenReviewDrawer}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Drawer
        direction="right"
        open={!!openClaimRequestId}
        onOpenChange={handleCloseReviewDrawer}
      >
        <ReviewClaimRequestDrawer
          isOpen={!!openClaimRequestId}
          claimRequestId={openClaimRequestId}
          onClose={handleCloseReviewDrawer}
        />
      </Drawer>
    </>
  )
}
