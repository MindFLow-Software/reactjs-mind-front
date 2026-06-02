import { useState, useRef, useCallback } from "react"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { getAddressByCep } from "@/api/address/get-address-by-cep"
import { Normalizer } from "@/utils/normalizer"

interface Iaddress {
    zipCode?: string
    street?: string
    number?: string
    neighborhood?: string
    complement?: string
    city?: string
    state?: string
}

interface UseCepLookupOptions {
    setValue: (field: keyof Iaddress, value?: string) => void
}

export interface UseCepLookupReturn {
    onCepChange: (cep: string) => Promise<void>
    isCepLoading: boolean
}

export function useCepLookup({ setValue }: UseCepLookupOptions): UseCepLookupReturn {
    const [isCepLoading, setIsCepLoading] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    const onCepChange = useCallback(async (cep: string) => {
        const digits = Normalizer.digits(cep)

        if (digits.length < 8) return

        abortRef.current?.abort()
        abortRef.current = new AbortController()

        try {
            setIsCepLoading(true)

            const address = await getAddressByCep(digits, { signal: abortRef.current.signal })

            setValue("street", address.street)
            setValue("neighborhood", address.neighborhood)
            setValue("city", address.city)
            setValue("state", address.state)
            setValue("number", address.number)
        } catch (error) {
            if (error instanceof AxiosError && error.code === "ERR_CANCELED") return
            const status = error instanceof AxiosError ? error.response?.status : null
            if (status === 400 || status === 404) toast.error("CEP não encontrado")
            else toast.error("Serviço de CEP indisponível. Preencha manualmente.")
        } finally {
            setIsCepLoading(false)
        }
    }, [setValue])

    return { onCepChange, isCepLoading }
}
