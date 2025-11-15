"use client"

import { useState } from "react"
import { Search, Trash2, UserPen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { PatientsDetails } from "./patients-details"
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { EditPatient } from "./edit-patient-dialog"
import { deletePatients } from "@/api/delete-patients"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { UpdatePatientData } from "@/api/upadate-patient"

interface PatientsTableRowProps {
    patient: {
        id: string
        cpf: string
        firstName: string
        lastName: string
        dateOfBirth: string
        phoneNumber: string
        gender: string
        status?: string
        email?: string
    }
}

export function PatientsTableRow({ patient }: PatientsTableRowProps) {
    const { id, cpf, email, firstName, lastName, dateOfBirth, phoneNumber, gender, status } = patient

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const queryClient = useQueryClient()

    const { mutateAsync: deletePatientFn, isPending: isDeleting, error: deleteError } = useMutation({
        mutationFn: deletePatients,
        onSuccess: () => {
            toast.success("Paciente excluído com sucesso!")
            setIsDeleteDialogOpen(false)
            queryClient.invalidateQueries({ queryKey: ["patients"] }) 
        },
        onError: (error) => {
            const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao excluir."
            toast.error(errorMessage)
        }
    })

    async function handleDelete() {
        await deletePatientFn(id) 
    }

    const genderLabel =
        {
            MASCULINE: "Masculino",
            FEMININE: "Feminino",
            OTHER: "Outro",
        }[gender as "MASCULINE" | "FEMININE" | "OTHER"] || "Não informado"

    return (
        <TableRow>
            <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="xs">
                            <Search className="h-3 w-3" />
                            <span className="sr-only">Detalhes do paciente</span>
                        </Button>
                    </DialogTrigger>
                    <PatientsDetails /> 
                </Dialog>
            </TableCell>

            <TableCell className="font-medium">{cpf}</TableCell>
            <TableCell className="font-medium">
                {firstName} {lastName}
            </TableCell>
            <TableCell className="text-muted-foreground">{phoneNumber}</TableCell>
            <TableCell className="text-muted-foreground">{new Date(dateOfBirth).toLocaleDateString("pt-BR")}</TableCell>
            <TableCell className="text-muted-foreground">{email}</TableCell>

            <TableCell className="text-muted-foreground">{genderLabel}</TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${status === "Ativo" ? "bg-green-500" : "bg-slate-400"}`} />
                    <span className="font-medium text-muted-foreground">{status || "Em acompanhamento"}</span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="cursor-pointer h-7 w-7 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                    >
                                        <UserPen className="h-4 w-4" />
                                        <span className="sr-only">Editar paciente</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                                    <EditPatient
                                        patient={{ ...patient, isActive: true } as UpdatePatientData} 
                                        onClose={() => setIsEditDialogOpen(false)}
                                    />
                                </DialogContent>
                            </Dialog>
                            <TooltipContent side="top">Editar paciente</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="cursor-pointer h-7 w-7 hover:bg-red-100 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Excluir paciente</span>
                                    </Button>
                                </DialogTrigger>
                                
                                <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-semibold">Excluir paciente</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Tem certeza que deseja excluir{" "}
                                            <strong>
                                                {firstName} {lastName}
                                            </strong>
                                            ? Essa ação é irreversível.
                                        </p>

                                        {deleteError && <p className="text-red-500 text-sm">{deleteError.message}</p>} 

                                        <div className="flex justify-end gap-3 pt-2">
                                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
                                                Cancelar
                                            </Button>
                                            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                                {isDeleting ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                )}
                                                {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
                                            </Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <TooltipContent side="top">Excluir paciente</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>
            
        </TableRow>
    )
}