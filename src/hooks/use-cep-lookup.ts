import { useState, useRef, useCallback } from "react"
import type React from "react"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { getAddressByCep } from "@/api/address/get-address-by-cep"

type AddressKey = "logradouro" | "bairro" | "cidade" | "uf"

interface UseCepLookupOptions {
    setValue: (field: AddressKey, value: string) => void
}

interface UseCepLookupReturn {
    onCepBlur:    React.FocusEventHandler<HTMLInputElement>
    isCepLoading: boolean
}

export function useCepLookup({ setValue }: UseCepLookupOptions): UseCepLookupReturn {
    const [isCepLoading, setIsCepLoading] = useState(false)
    const abortRef = useRef<AbortController | null>(null)

    const onCepBlur = useCallback(async (e: React.FocusEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "")

        if (digits.length < 8) {
            toast.error("CEP inválido")
            return
        }

        abortRef.current?.abort()
        abortRef.current = new AbortController()

        try {
            setIsCepLoading(true)
            const address = await getAddressByCep(digits, { signal: abortRef.current.signal })
            setValue("logradouro", address.logradouro)
            setValue("bairro",     address.bairro)
            setValue("cidade",     address.cidade)
            setValue("uf",         address.uf)
        } catch (error) {
            if (error instanceof AxiosError && error.code === "ERR_CANCELED") return
            const status = error instanceof AxiosError ? error.response?.status : null
            if (status === 400 || status === 404) toast.error("CEP não encontrado")
            else                                  toast.error("Serviço de CEP indisponível. Preencha manualmente.")
        } finally {
            setIsCepLoading(false)
        }
    }, [setValue])

    return { onCepBlur, isCepLoading }
}
