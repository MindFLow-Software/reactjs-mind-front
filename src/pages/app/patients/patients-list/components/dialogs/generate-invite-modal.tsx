"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Loader2, QrCode, Copy, Check, RefreshCw, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { generateRegistrationLink } from "@/api/generate-registration-link"
import { useInviteStore } from "@/utils/use-invite-store"

export function GenerateInviteModal() {
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const { inviteData, setInviteData } = useInviteStore()

    async function handleGenerate() {
        try {
            setLoading(true)
            const data = await generateRegistrationLink()
            setInviteData({ url: data.qrCodeLink, hash: data.hash })
        } catch (error) {
            toast.error("Não foi possível gerar o link de convite.")
        } finally {
            setLoading(false)
        }
    }

    function copyToClipboard() {
        if (inviteData) {
            navigator.clipboard.writeText(inviteData.url)
            setCopied(true)
            toast.success("Link copiado!")
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
            <div className="bg-primary/5 px-6 py-5 border-b border-border">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
                            <QrCode className="w-5 h-5" />
                        </div>
                        Convite via QR Code
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        O paciente será direcionado para o seu formulário de cadastro.
                    </DialogDescription>
                </DialogHeader>
            </div>

            <div className="p-6">
                {!inviteData ? (
                    <div className="flex flex-col items-center justify-center py-8 space-y-6">
                        <div className="flex items-center justify-center w-20 h-20 rounded-2xl">
                            <QrCode className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Clique no botão abaixo para gerar um novo link de convite
                            </p>
                        </div>
                        <Button
                            onClick={handleGenerate}
                            disabled={loading}
                            size="lg"
                            className="w-full max-w-xs cursor-pointer font-medium"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Gerar Link de Acesso
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-primary/10 rounded-2xl blur-sm group-hover:bg-primary/20 transition-colors" />
                            <div className="relative p-5 bg-background rounded-xl border border-border shadow-sm">
                                <QRCodeSVG
                                    value={inviteData.url}
                                    size={180}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>
                        </div>

                        <p className="text-xs text-muted-foreground text-center max-w-xs">
                            Aponte a câmera do celular para o QR Code ou copie o link abaixo
                        </p>

                        <div className="w-full space-y-3">
                            <div className="flex items-start w-full gap-2 p-3 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                <p className="flex-1 px-1 text-xs break-all text-muted-foreground font-mono select-all leading-relaxed">
                                    {inviteData.url}
                                </p>
                                <Button
                                    size="sm"
                                    variant={copied ? "default" : "secondary"}
                                    onClick={copyToClipboard}
                                    className="h-8 px-3 cursor-pointer shrink-0 font-medium"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-3.5 w-3.5 mr-1.5" />
                                            Copiado
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                                            Copiar
                                        </>
                                    )}
                                </Button>
                            </div>

                            <Button
                                variant="ghost"
                                onClick={() => setInviteData(null)}
                                className="w-full text-sm cursor-pointer text-muted-foreground hover:text-foreground"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Gerar novo link
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </DialogContent>
    )
}