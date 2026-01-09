"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getProfile, type GetProfileResponse } from "@/api/get-profile"
import { PsychologistAvatarUpload } from "./psychologist-avatar-upload"
import { Skeleton } from "@/components/ui/skeleton"
import { Mail, Phone, FileText, Award, ChevronRight, Calendar, UserRoundPen } from "lucide-react"
import { formatPhone } from "@/utils/formatPhone"
import { formatCPF } from "@/utils/formatCPF"
import { ROLE_TRANSLATIONS, EXPERTISE_TRANSLATIONS } from "@/utils/mappers"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { EditPsychologistProfile } from "./edit-psychologist-dialog"

interface PsychologistProfileCardProps {
    psychologist?: GetProfileResponse
}

export function PsychologistProfileCard({ psychologist: initialData }: PsychologistProfileCardProps = {}) {
    const [isEditOpen, setIsEditOpen] = useState(false)

    const { data: profile, isLoading } = useQuery<GetProfileResponse>({
        queryKey: ["psychologist-profile"],
        queryFn: getProfile,
        initialData: initialData,
        staleTime: Number.POSITIVE_INFINITY,
    })

    if (isLoading && !profile) {
        return (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="h-24 bg-muted animate-pulse" />
                <div className="px-6 pb-6">
                    <div className="-mt-12 flex flex-col md:flex-row items-center gap-6">
                        <Skeleton className="h-24 w-24 rounded-full ring-4 ring-card" />
                        <div className="flex-1 space-y-3 w-full pt-8">
                            <Skeleton className="h-7 w-1/3" />
                            <Skeleton className="h-5 w-1/4" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (!profile) return null

    const fullName = `${profile.firstName} ${profile.lastName}`

    const translatedRole = (() => {
        const gender = String(profile.gender).toUpperCase()
        const isFemale = gender === "FEMALE"
        const suffix = isFemale ? "a" : "o"

        if (profile.role === "PSYCHOLOGIST") {
            return `Psicólog${suffix}`
        }

        return ROLE_TRANSLATIONS[profile.role] || profile.role
    })()

    const translatedExpertise = EXPERTISE_TRANSLATIONS[profile.expertise] || profile.expertise

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="h-34 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 relative"></div>

            <div className="px-6 pb-6">
                <div className="-mt-12 flex flex-col md:flex-row items-center md:items-end gap-5">
                    <div className="ring-4 ring-card rounded-full bg-card shadow-lg">
                        <PsychologistAvatarUpload currentImage={profile.profileImageUrl} fullName={fullName} />
                    </div>

                    <div className="flex-1 text-center md:text-left pt-2 md:pb-1">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">{fullName}</h2>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                {translatedExpertise}
                            </span>
                            <span className="h-1 w-1 rounded-full bg-muted-foreground/30 hidden md:block" />
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {translatedRole}
                            </span>
                        </div>
                    </div>

                    <div className="hidden lg:flex items-center gap-2 mb-1">
                        <div className="flex -space-x-2">
                            <div className="h-8 w-8 rounded-full border-2 border-card bg-blue-100 flex items-center justify-center">
                                <UserRoundPen className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="h-8 w-8 rounded-full border-2 border-card bg-purple-100 flex items-center justify-center">
                                <Calendar className="h-3 w-3 text-purple-600" />
                            </div>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground ml-2">Conta Verificada</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <div className="flex items-center gap-4 p-4 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl">
                        <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-md">
                            <Mail className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600/70 dark:text-blue-400/70 block">E-mail</span>
                            <span className="text-sm font-semibold truncate block">{profile.email}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-2xl transition-colors">
                        <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-md">
                            <Phone className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/70 dark:text-indigo-400/70 block">Telefone</span>
                            <span className="text-sm font-semibold truncate block">
                                {formatPhone(profile.phoneNumber)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 rounded-2xl transition-colors">
                        <div className="p-2.5 bg-purple-600 text-white rounded-xl shadow-md">
                            <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-600/70 dark:text-purple-400/70 block">CPF</span>
                            <span className="text-sm font-semibold truncate block">
                                {formatCPF(profile.cpf)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-900/20 rounded-2xl transition-colors">
                        <div className="p-2.5 bg-slate-700 text-white rounded-xl shadow-md">
                            <Award className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600/70 dark:text-slate-400/70 block">CRP</span>
                            <span className="text-sm font-semibold truncate block">{profile.crp || "Não informado"}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 mt-8 pt-6 border-t border-border/50">
                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogTrigger asChild>
                            <button className="flex items-center justify-between p-4 bg-white dark:bg-muted/20 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-border hover:border-blue-200 dark:hover:border-blue-800 rounded-2xl transition-all group cursor-pointer text-left">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                        <UserRoundPen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-sm text-foreground block">Editar Perfil</span>
                                        <span className="text-[10px] text-muted-foreground uppercase font-medium">Informações básicas</span>
                                    </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </button>
                        </DialogTrigger>
                        <EditPsychologistProfile
                            psychologist={profile}
                            onClose={() => setIsEditOpen(false)}
                        />
                    </Dialog>
                </div>
            </div>
        </div>
    )
}