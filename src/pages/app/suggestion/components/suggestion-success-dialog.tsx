"use client"

import { CheckCircle2, Sparkles } from "lucide-react"
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SuggestionSuccessProps {
    onClose: () => void
}

export function SuggestionSuccess({ onClose }: SuggestionSuccessProps) {
    return (
        <DialogContent className="sm:max-w-[550px] rounded-3xl gap-0 p-0 overflow-hidden border-0 shadow-2xl">
            <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 pt-10 pb-8 px-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)]" />

                <DialogHeader className="relative flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                        <div className="relative size-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-in zoom-in duration-500">
                            <CheckCircle2 className="size-11 text-white" strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
                            Sugestão Enviada!
                            <Sparkles className="size-5 text-amber-500 fill-amber-400 animate-in spin-in duration-700 delay-300" />
                        </DialogTitle>
                        <DialogDescription className="text-slate-600 text-center text-base pt-1 text-balance mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                            Muito obrigado pelo seu feedback. Sua ideia é fundamental para evoluirmos a plataforma.
                        </DialogDescription>
                    </div>
                </DialogHeader>
            </div>

            <div className="p-8 space-y-6 bg-white">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/50 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
                    <div className="flex items-start gap-4">
                        <div className="space-y-1.5 flex-1">
                            <p className="text-sm font-semibold text-slate-900">Próximos passos</p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Nossa equipe analisará sua sugestão. Se aprovada, ela aparecerá no board em até{" "}
                                <span className="font-semibold text-blue-600">48 horas</span>.
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="animate-in fade-in slide-in-from-bottom duration-500 delay-400">
                    <Button
                        onClick={onClose}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 rounded-xl font-semibold h-12 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-white"
                    >
                        Entendido
                    </Button>
                </DialogFooter>
            </div>
        </DialogContent>
    )
}
