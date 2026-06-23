import { useMutation, useQueryClient } from '@tanstack/react-query'
import { differenceInYears, format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Archive,
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  Mail,
  MoreVertical,
  Pencil,
  Phone,
  RotateCcw,
  Search,
  Video,
} from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { togglePatientProfileStatus } from '@/api/patient-profiles/toggle-patient-profile-status'
import type { IgetPatientProfilesResponse } from '@/api/patient-profiles/fetch-patient-profiles'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { UserAvatar } from '@/components/user-avatar'
import { cn } from '@/lib/utils'
import { formatCPF } from '@/utils/formatCPF'
import { formatPhone } from '@/utils/formatPhone'

import { RegisterPatients } from '../../register-patients/register-patients'
import { DeletePatientDialog } from '../dialogs/delete-patient-dialog'
import { PatientsDetails } from '../details/patients-details'
import { PatientStatusDialog } from '@/components/patient-status-dialog'

import { GENDER_CONFIG } from '@/utils/gender-config'
import type { IpatientProfile } from '@/types/patient-profile'

interface PatientsTableRowProps {
  patient: IpatientProfile
}

export const PatientsTableRow = memo(function PatientsTableRow({
  patient,
}: PatientsTableRowProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isReactivateOpen, setIsReactivateOpen] = useState(false)

  const handleOpenDetails = useCallback(() => setIsDetailsOpen(true), [])
  const handleOpenEdit = useCallback(() => setIsEditOpen(true), [])
  const handleOpenDelete = useCallback(() => setIsDeleteOpen(true), [])
  const handleOpenReactivate = useCallback(() => setIsReactivateOpen(true), [])

  const {
    id,
    firstName,
    lastName,
    email,
    cpf,
    phoneNumber,
    dateOfBirth,
    gender,
    profileImageUrl,
    lastSessionAt,
    isActive,
  } = patient

  const fullName = `${firstName} ${lastName}`

  const { mutateAsync: toggleStatusFn, isPending: isUpdating } = useMutation({
    mutationFn: () => togglePatientProfileStatus(id),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['patients'] })
      const snapshot = queryClient.getQueriesData<IgetPatientProfilesResponse>({
        queryKey: ['patients'],
        exact: false,
      })
      queryClient.setQueriesData<IgetPatientProfilesResponse>(
        { queryKey: ['patients'], exact: false },
        (old) => {
          if (!old) return old

          return {
            ...old,
            patients: old.patients.map((p) =>
              p.id === id ? { ...p, isActive: false } : p,
            ),
          }
        },
      )
      return { snapshot }
    },
    onError: (_err, _vars, context) => {
      if (context?.snapshot) {
        context.snapshot.forEach(([key, data]) => {
          queryClient.setQueryData(key, data)
        })
      }
    },
    onSettled: () => {
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['patients'] }),
        queryClient.invalidateQueries({ queryKey: ['patient', id] }),
        queryClient.invalidateQueries({ queryKey: ['patient-details', id] }),
        queryClient.invalidateQueries({ queryKey: ['patients-metrics'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
  })

  const handleNavigate = useCallback(() => {
    sessionStorage.removeItem('active_patient_queue')
    sessionStorage.removeItem('active_patient_queue_source')

    navigate(`/patients/${id}/details`, { state: { from: 'patients-list' } })
  }, [navigate, id])

  const handleScheduleSession = useCallback(() => {
    navigate(`/appointment?patientId=${id}`)
  }, [navigate, id])

  const now = new Date()
  const age = dateOfBirth ? differenceInYears(now, dateOfBirth) : null
  const ageDisplay = age ? `${age} ${age === 1 ? 'ano' : 'anos'}` : '—'

  const lastSessionRelative = lastSessionAt
    ? formatDistanceToNow(new Date(lastSessionAt), {
      addSuffix: true,
      locale: ptBR,
    })
    : null

  const lastSessionExact = lastSessionAt
    ? format(new Date(lastSessionAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    : null

  const genderCfg =
    GENDER_CONFIG[gender as keyof typeof GENDER_CONFIG] ?? GENDER_CONFIG.OTHER

  return (
    <TooltipProvider delayDuration={200}>
      <TableRow className="group hover:bg-muted/40 transition-colors">
        {/* Checkbox */}
        <TableCell className="w-[44px] pl-4">
          <Checkbox
            className="cursor-pointer"
            aria-label={`Selecionar ${fullName}`}
          />
        </TableCell>

        {/* Paciente: avatar + nome + CPF */}
        <TableCell className="min-w-[180px]">
          <div className="flex items-center gap-3">
            <UserAvatar
              src={profileImageUrl}
              name={fullName}
              size="md"
              colorSeed={id}
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold text-sm leading-tight text-nowrap">
                {fullName}
              </span>
              <span className="text-[13px] font-mono tracking-tight">
                {cpf ? formatCPF(cpf) : '—'}
              </span>
            </div>
          </div>
        </TableCell>

        {/* Status */}
        <TableCell className="w-[120px]">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11px] font-semibold',
              isActive
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            )}
          >
            {isActive ? 'Ativo' : 'Arquivado'}
          </span>
        </TableCell>

        {/* Contato: telefone + email */}
        <TableCell className="min-w-[200px]">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <Phone
                className="size-3 text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs font-medium">
                {phoneNumber ? formatPhone(phoneNumber) : '—'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail
                className="size-3 text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <span className="text-xs font-medium">{email || '—'}</span>
            </div>
          </div>
        </TableCell>

        {/* Última Sessão */}
        <TableCell className="w-[140px] hidden lg:table-cell">
          {lastSessionRelative ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-xs font-medium cursor-default">
                  {lastSessionRelative}
                </span>
              </TooltipTrigger>
              <TooltipContent className="text-xs">
                {lastSessionExact}
              </TooltipContent>
            </Tooltip>
          ) : (
            <span className="text-xs text-muted-foreground">sem sessões</span>
          )}
        </TableCell>

        {/* Idade */}
        <TableCell className="w-[110px] hidden xl:table-cell">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold tabular-nums">{ageDisplay}</span>
            {dateOfBirth && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <CalendarDays className="size-2.5" aria-hidden="true" />
                {format(new Date(dateOfBirth), 'dd/MM/yyyy')}
              </span>
            )}
          </div>
        </TableCell>

        {/* Gênero */}
        <TableCell className="w-[110px] hidden xl:table-cell">
          <Badge
            className={cn(
              'gap-1.5 h-6 px-2.5 text-[11px] font-semibold',
              genderCfg.className,
            )}
          >
            <genderCfg.icon className="size-3" aria-hidden="true" />
            {genderCfg.label}
          </Badge>
        </TableCell>

        {/* Ações */}
        <TableCell className="w-[110px] pr-3">
          <div className="flex items-center justify-end gap-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={handleNavigate}
                  aria-label="Prontuário completo"
                >
                  <ClipboardList className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Prontuário</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={handleOpenDetails}
                  aria-label="Ver sessões do paciente"
                >
                  <Video className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Sessões</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
                  aria-label={`Mais ações — ${fullName}`}
                >
                  <MoreVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={handleOpenDetails}
                >
                  <Search className="mr-2 size-4" /> Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={handleScheduleSession}
                >
                  <CalendarPlus className="mr-2 size-4" /> Agendar sessão
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={handleOpenEdit}
                >
                  <Pencil className="mr-2 size-4" /> Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isActive ? (
                  <DropdownMenuItem
                    onSelect={handleOpenDelete}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Archive className="mr-2 size-4" /> Arquivar paciente
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onSelect={handleOpenReactivate}
                    className="cursor-pointer text-emerald-700 dark:text-emerald-400 focus:text-emerald-700 dark:focus:text-emerald-400"
                  >
                    <RotateCcw className="mr-2 size-4" /> Reativar paciente
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>

        {/* Modais */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          {isDetailsOpen && <PatientsDetails patientId={id} />}
        </Dialog>

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          {isEditOpen && (
            <RegisterPatients
              patientId={patient.id}
              isEditing
              onSuccess={() => setIsEditOpen(false)}
            />
          )}
        </Dialog>

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          {isDeleteOpen && (
            <DeletePatientDialog
              fullName={fullName}
              isPending={isUpdating}
              onClose={() => setIsDeleteOpen(false)}
              onConfirm={async () => {
                await toggleStatusFn()
              }}
            />
          )}
        </Dialog>

        <Dialog open={isReactivateOpen} onOpenChange={setIsReactivateOpen}>
          {isReactivateOpen && (
            <PatientStatusDialog
              mode="reactivate"
              fullName={fullName}
              isPending={isUpdating}
              onClose={() => setIsReactivateOpen(false)}
              onConfirm={async () => {
                await toggleStatusFn()
              }}
            />
          )}
        </Dialog>
      </TableRow>
    </TooltipProvider>
  )
})
