import { useState, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAmountPatientsCard } from "@/api/get-amount-patients-card"
import type { AchievementVariant } from "@/components/achievement-toast"

interface ActiveAchievement {
  title: string
  description: string
  variant: AchievementVariant
}

export function usePatientAchievements() {
  const [achievement, setAchievement] = useState<ActiveAchievement | null>(null)

  const { data: metrics } = useQuery({
    queryKey: ['metrics', 'amount-patients-card'],
    queryFn: getAmountPatientsCard,
    staleTime: 1000 * 60 * 5,
  })

  const checkAchievement = useCallback(() => {
    const previousTotal = metrics?.total ?? 0
    const newTotal = previousTotal + 1 

    let newAchievement: ActiveAchievement | null = null

    if (newTotal === 1) {
      newAchievement = {
        title: "Começou! 🚀",
        description: "Primeiro paciente cadastrado com sucesso.",
        variant: 'bronze'
      }
    } else if (newTotal === 5) {
      newAchievement = {
        title: "Primeiros vínculos ⚡",
        description: "5 pessoas já iniciaram sua jornada com você.",
        variant: 'silver'
      }
    } else if (newTotal === 10) {
      newAchievement = {
        title: "Atuação reconhecida 👑",
        description: "10 pacientes cadastrados com responsabilidade clínica.",
        variant: 'gold'
      }
    } else if (newTotal === 20) {
      newAchievement = {
        title: "Impacto significativo 💎",
        description: "25 pacientes confiam no seu cuidado.",
        variant: 'platinum'
      }
    }

    if (newAchievement) {
        setAchievement(newAchievement)
    }
  }, [metrics])

  const clearAchievement = useCallback(() => {
    setAchievement(null)
  }, [])

  return { 
    achievement, 
    checkAchievement, 
    clearAchievement 
  }
}