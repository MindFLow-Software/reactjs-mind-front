// api/livekit.ts
export async function fetchLivekitToken(identity: string, room: string) {
    const res = await fetch(
        `/api/livekit/token?identity=${identity}&room=${room}`
    )

    if (!res.ok) throw new Error('Erro ao gerar token LiveKit')

    const data = await res.json()
    return data.token
}
