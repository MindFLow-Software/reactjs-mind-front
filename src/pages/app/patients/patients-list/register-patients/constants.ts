import { Venus, Mars, Users, Video, Home } from "lucide-react"

export const STEPS = [
    { id: 1 as const, label: "Dados básicos",      required: true  },
    { id: 2 as const, label: "Contato & endereço", required: false },
    { id: 3 as const, label: "Clínico",            required: false },
    { id: 4 as const, label: "Documentos",         required: false },
]

export type StepId = 1 | 2 | 3 | 4

export const GENDER_OPTIONS = [
    { value: "FEMININE",  label: "Feminino",                  icon: Venus, checkedCls: "border-pink-300 bg-pink-50 text-pink-700 dark:border-pink-800 dark:bg-pink-950/40 dark:text-pink-300"         },
    { value: "MASCULINE", label: "Masculino",                 icon: Mars,  checkedCls: "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300"         },
    { value: "OTHER",     label: "Outro / Prefiro não dizer", icon: Users, checkedCls: "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300" },
] as const

export const MODALITY_OPTIONS = [
    { value: "ONLINE",     label: "Online",     icon: Video },
    { value: "PRESENCIAL", label: "Presencial", icon: Home  },
    { value: "HIBRIDO",    label: "Híbrido",    icon: null  },
] as const

export const MAX_DOC_FILES = 6
export const MAX_DOC_SIZE  = 3 * 1024 * 1024
