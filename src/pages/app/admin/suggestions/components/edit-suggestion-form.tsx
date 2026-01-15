"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Check, X, Loader2, Save, MessageSquare, Tag, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const editSchema = z.object({
    title: z.string().min(5, "Título muito curto"),
    category: z.string(),
    description: z.string().min(10, "Descrição muito curta"),
})

type EditSchema = z.infer<typeof editSchema>

interface EditSuggestionFormProps {
    item: any
    onUpdate: (data: any) => Promise<void>
    isUpdating: boolean
}

export function EditSuggestionForm({ item, onUpdate, isUpdating }: EditSuggestionFormProps) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditSchema>({
        resolver: zodResolver(editSchema),
        defaultValues: {
            title: item.title,
            category: item.category,
            description: item.description,
        }
    })

    const onSubmit = async (data: EditSchema) => {
        await onUpdate({ id: item.id, ...data })
    }

    const onApprove = async (data: EditSchema) => {
        await onUpdate({ id: item.id, ...data, status: "OPEN" })
    }

    return (
        <form className="flex flex-col gap-6">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <MessageSquare className="size-5 text-[#27187E]" />
                    Revisar Sugestão
                </DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
                {/* Título e Categoria */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                            <FileText className="size-3" /> Título
                        </Label>
                        <Input
                            {...register("title")}
                            className="border-slate-200 focus-visible:ring-[#27187E] font-medium"
                        />
                        {errors.title && <span className="text-[10px] text-red-500">{errors.title.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400 flex items-center gap-2">
                            <Tag className="size-3" /> Categoria
                        </Label>
                        <Select
                            defaultValue={item.category}
                            onValueChange={(v) => setValue("category", v)}
                        >
                            <SelectTrigger className="border-slate-200">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="UI_UX">Interface / UX</SelectItem>
                                <SelectItem value="SCHEDULING">Agendamentos</SelectItem>
                                <SelectItem value="REPORTS">Relatórios</SelectItem>
                                <SelectItem value="PRIVACY_LGPD">Privacidade</SelectItem>
                                <SelectItem value="INTEGRATIONS">Integrações</SelectItem>
                                <SelectItem value="OTHERS">Outros</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Descrição */}
                <div className="space-y-2">
                    <Label className="text-xs font-black uppercase text-slate-400">Conteúdo da Sugestão</Label>
                    <Textarea
                        {...register("description")}
                        className="w-full min-h-[140px] max-h-[240px] resize-none break-words"
                    />
                </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-dashed">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isUpdating}
                    className="flex-1 rounded-xl font-bold border-slate-200 hover:bg-slate-50 h-11"
                >
                    <Save className="size-4 mr-2" /> Salvar Edição
                </Button>

                <div className="flex flex-1 gap-2">
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={() => onUpdate({ id: item.id, status: "REJECTED" })}
                        disabled={isUpdating}
                        className="rounded-xl font-bold h-11"
                    >
                        <X className="size-4 mr-2" /> Rejeitar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit(onApprove)}
                        disabled={isUpdating}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11"
                    >
                        {isUpdating ? <Loader2 className="animate-spin size-4" /> : <Check className="size-4 mr-2" />}
                        Aprovar
                    </Button>
                </div>
            </DialogFooter>
        </form>
    )
}