"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, User, Mail, Phone, Briefcase } from "lucide-react"
import { toast } from "sonner"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { formatPhone } from "@/utils/formatPhone"
import { updatePsychologist, type UpdatePsychologistBody } from "@/api/update-psychologist"
import { EXPERTISE_TRANSLATIONS } from "@/utils/mappers"
import { cn } from "@/lib/utils"

interface EditPsychologistProfileProps {
    psychologist: {
        firstName: string
        lastName: string
        email: string
        phoneNumber: string
        crp: string | null
        expertise: UpdatePsychologistBody['expertise']
    }
    onClose?: () => void
}

export function EditPsychologistProfile({ psychologist, onClose }: EditPsychologistProfileProps) {
    const queryClient = useQueryClient()
    const [phone, setPhone] = useState(formatPhone(psychologist.phoneNumber))
    const [expertise, setExpertise] = useState(psychologist.expertise)
    const [errors, setErrors] = useState<{ firstName?: boolean; lastName?: boolean }>({})

    const { mutateAsync: updateProfileFn, isPending } = useMutation({
        mutationFn: updatePsychologist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["psychologist-profile"] })
            toast.success("Perfil atualizado!")
            onClose?.()
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Erro ao atualizar perfil."),
    })

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const firstName = fd.get("firstName") as string
        const lastName = fd.get("lastName") as string

        if (!firstName || !lastName) {
            setErrors({ firstName: !firstName, lastName: !lastName })
            return toast.error("Preencha os campos obrigatórios.")
        }

        try {
            await updateProfileFn({
                firstName,
                lastName,
                email: fd.get("email") as string,
                phoneNumber: phone.replace(/\D/g, ""),
                crp: (fd.get("crp") as string) || undefined,
                expertise: expertise as any,
            })
        } catch (error) { console.error(error) }
    }

    return (
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-2xl border-none shadow-2xl">
            <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2 text-blue-600"><User className="h-5 w-5" />Editar Meu Perfil</DialogTitle>
                <DialogDescription>Altere suas informações profissionais e de contato.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="grid gap-6 py-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 text-muted-foreground"><User className="h-4 w-4" /><h3 className="text-[11px] font-bold uppercase tracking-widest">Informações Básicas</h3></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className={cn(errors.firstName && "text-red-500")}>Nome *</Label>
                            <Input name="firstName" defaultValue={psychologist.firstName} className={cn("bg-secondary/30", errors.firstName && "border-red-500")} />
                        </div>
                        <div className="space-y-2">
                            <Label className={cn(errors.lastName && "text-red-500")}>Sobrenome *</Label>
                            <Input name="lastName" defaultValue={psychologist.lastName} className={cn("bg-secondary/30", errors.lastName && "border-red-500")} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-t border-muted/40 pt-4">
                    <div className="flex items-center gap-2 px-1 text-muted-foreground"><Briefcase className="h-4 w-4" /><h3 className="text-[11px] font-bold uppercase tracking-widest">Atuação Profissional</h3></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* <div className="space-y-2">
                            <Label htmlFor="crp">CRP</Label>
                            <div className="relative"><Award className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input name="crp" defaultValue={psychologist.crp ?? ""} className="pl-9 bg-secondary/30" placeholder="Ex: 06/123456" />
                            </div>
                        </div> */}
                        <div className="space-y-2">
                            <Label>Especialidade Principal</Label>
                            <Select value={expertise} onValueChange={(val) => setExpertise(val as any)}>
                                <SelectTrigger className="bg-secondary/30"><SelectValue placeholder="Selecione sua área" /></SelectTrigger>
                                <SelectContent>{Object.entries(EXPERTISE_TRANSLATIONS).map(([key, label]) => (<SelectItem key={key} value={key}>{label}</SelectItem>))}</SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 border-t border-muted/40 pt-4">
                    <div className="flex items-center gap-2 px-1 text-muted-foreground"><Mail className="h-4 w-4" /><h3 className="text-[11px] font-bold uppercase tracking-widest">Contato</h3></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Email Profissional</Label>
                            <div className="relative"><Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input name="email" type="email" defaultValue={psychologist.email} className="pl-9 bg-secondary/30" /></div>
                        </div>
                        <div className="space-y-2">
                            <Label>Telefone / WhatsApp</Label>
                            <div className="relative"><Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input value={phone} maxLength={15} onChange={(e) => setPhone(formatPhone(e.target.value))} className="pl-9 bg-secondary/30" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-muted/40">
                    <Button className="cursor-pointer" type="button" variant="ghost" onClick={onClose} disabled={isPending}>Cancelar</Button>
                    <Button type="submit" disabled={isPending} className="cursor-pointer bg-blue-600 hover:bg-blue-700 shadow-md px-8">
                        {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Salvando...</> : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    )
}