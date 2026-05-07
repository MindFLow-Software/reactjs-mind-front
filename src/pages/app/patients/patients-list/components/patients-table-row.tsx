import { memo, useState, useCallback } from "react"
import {
    MoreVertical, Search, ClipboardList, Video,
    Pencil, UserX, UserCheck, Phone, Mail,
    CalendarDays, Mars, Venus, Users,
} from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

import { TableCell, TableRow } from "@/components/ui/table"
import { Dialog } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { PatientsDetails } from "./patients-details"
import { DeletePatientDialog } from "./delete-patient-dialog"
import { RegisterPatients } from "../register-patients/register-patients"
import { deletePatients } from "@/api/delete-patients"
import { UserAvatar } from "@/components/user-avatar"
import { formatPhone } from "@/utils/formatPhone"
import { formatCPF } from "@/utils/formatCPF"
import { formatAGE } from "@/utils/formatAGE"

import type { Patient } from "@/api/get-patients"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

const GENDER_CONFIG = {
    MASCULINE: { label: "Masculino", icon: Mars,  className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-0" },
    FEMININE:  { label: "Feminino",  icon: Venus, className: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-0" },
    OTHER:     { label: "Outro",     icon: Users, className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 border-0" },
} as const

interface PatientsTableRowProps {
    patient: Patient
}

export const PatientsTableRow = memo(function PatientsTableRow({ patient }: PatientsTableRowProps) {
    const navigate = useNavigate()
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [isEditOpen,    setIsEditOpen]    = useState(false)
    const [isDeleteOpen,  setIsDeleteOpen]  = useState(false)

    const queryClient = useQueryClient()

    const {
        id, firstName, lastName, email, cpf,
        phoneNumber, dateOfBirth, gender,
        profileImageUrl, isActive, lastSessionAt,
    } = patient

    const fullName = `${firstName} ${lastName}`.trim()

    const { mutateAsync: toggleStatusFn, isPending: isUpdating } = useMutation({
        mutationFn: () => deletePatients(id, !isActive),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["patients"] }),
                queryClient.invalidateQueries({ queryKey: ["patient-details", id] }),
            ])
        },
    })

    const handleOpenDetails = useCallback(() => setIsDetailsOpen(true), [])
    const handleOpenEdit    = useCallback(() => setIsEditOpen(true), [])
    const handleOpenDelete  = useCallback(() => setIsDeleteOpen(true), [])
    const handleNavigate    = useCallback(() => {
        sessionStorage.removeItem("active_patient_queue")
        sessionStorage.removeItem("active_patient_queue_source")
        navigate(`/patients/${id}/details`, { state: { from: "patients-list" } })
    }, [navigate, id])

    const isValidDate = dateOfBirth && !isNaN(new Date(dateOfBirth).getTime())
    const age = isValidDate ? formatAGE(dateOfBirth) : null
    const ageDisplay = age !== null ? `${age} ${age === 1 ? "ano" : "anos"}` : "—"

    const lastSessionRelative = lastSessionAt
        ? formatDistanceToNow(new Date(lastSessionAt), { addSuffix: true, locale: ptBR })
        : null
    const lastSessionExact = lastSessionAt
        ? format(new Date(lastSessionAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
        : null

    const genderCfg = GENDER_CONFIG[gender as keyof typeof GENDER_CONFIG] ?? GENDER_CONFIG.OTHER

    return (
        <TooltipProvider delayDuration={200}>
            <TableRow
                className={cn(
                    "group hover:bg-muted/40 transition-colors",
                    !isActive && "opacity-60 bg-muted/20"
                )}
            >
                {/* Checkbox */}
                <TableCell className="w-[44px] pl-4">
                    <Checkbox className="cursor-pointer" aria-label={`Selecionar ${fullName}`} />
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
                            <span className="text-[11px] text-muted-foreground font-mono tracking-tight">
                                {cpf ? formatCPF(cpf) : "—"}
                            </span>
                        </div>
                    </div>
                </TableCell>

                {/* Status */}
                <TableCell className="w-[110px]">
                    {isActive ? (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-0 gap-1.5 h-6 px-2.5 text-[11px] font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            Ativo
                        </Badge>
                    ) : (
                        <Badge className="bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 border-0 gap-1.5 h-6 px-2.5 text-[11px] font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 shrink-0" />
                            Inativo
                        </Badge>
                    )}
                </TableCell>

                {/* Contato: telefone + email */}
                <TableCell className="min-w-[200px]">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                            <Phone className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                            <span className="text-xs font-medium tabular-nums">
                                {phoneNumber ? formatPhone(phoneNumber) : "—"}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Mail className="h-3 w-3 text-muted-foreground shrink-0" aria-hidden="true" />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span className="text-xs text-muted-foreground truncate max-w-[160px] cursor-default">
                                        {email || "—"}
                                    </span>
                                </TooltipTrigger>
                                {email && <TooltipContent className="text-xs">{email}</TooltipContent>}
                            </Tooltip>
                        </div>
                    </div>
                </TableCell>

                {/* Última Sessão */}
                <TableCell className="w-[140px] hidden lg:table-cell">
                    {lastSessionRelative ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="text-xs font-medium cursor-default">{lastSessionRelative}</span>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">{lastSessionExact}</TooltipContent>
                        </Tooltip>
                    ) : (
                        <span className="text-xs text-muted-foreground">sem sessões</span>
                    )}
                </TableCell>

                {/* Idade */}
                <TableCell className="w-[110px] hidden xl:table-cell">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold tabular-nums">{ageDisplay}</span>
                        {isValidDate && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <CalendarDays className="h-2.5 w-2.5" aria-hidden="true" />
                                {format(new Date(dateOfBirth), "dd/MM/yyyy")}
                            </span>
                        )}
                    </div>
                </TableCell>

                {/* Gênero */}
                <TableCell className="w-[110px] hidden xl:table-cell">
                    <Badge className={cn("gap-1.5 h-6 px-2.5 text-[11px] font-semibold", genderCfg.className)}>
                        <genderCfg.icon className="h-3 w-3" aria-hidden="true" />
                        {genderCfg.label}
                    </Badge>
                </TableCell>

                {/* Ações */}
                <TableCell className="w-[110px] pr-3">
                    <div className="flex items-center justify-end gap-0.5">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost" size="icon"
                                    className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
                                    onClick={handleNavigate}
                                    aria-label="Prontuário completo"
                                >
                                    <ClipboardList className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">Prontuário</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost" size="icon"
                                    className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
                                    onClick={handleOpenDetails}
                                    aria-label="Ver sessões do paciente"
                                >
                                    <Video className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent className="text-xs">Sessões</TooltipContent>
                        </Tooltip>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost" size="icon"
                                    className="h-8 w-8 cursor-pointer text-muted-foreground hover:text-foreground"
                                    aria-label={`Mais ações — ${fullName}`}
                                >
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem onSelect={handleOpenDetails}>
                                    <Search className="mr-2 h-4 w-4" /> Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={handleOpenEdit}>
                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onSelect={handleOpenDelete}
                                    className="text-destructive focus:text-destructive"
                                >
                                    {isActive
                                        ? <><UserX className="mr-2 h-4 w-4" /> Inativar</>
                                        : <><UserCheck className="mr-2 h-4 w-4" /> Reativar</>
                                    }
                                </DropdownMenuItem>
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
                        <RegisterPatients patient={patient} onSuccess={() => setIsEditOpen(false)} />
                    )}
                </Dialog>

                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                    {isDeleteOpen && (
                        <DeletePatientDialog
                            fullName={fullName}
                            isActive={isActive}
                            isPending={isUpdating}
                            onClose={() => setIsDeleteOpen(false)}
                            onInactivate={async () => {
                                await toggleStatusFn()
                                setIsDeleteOpen(false)
                            }}
                        />
                    )}
                </Dialog>
            </TableRow>
        </TooltipProvider>
    )
})
