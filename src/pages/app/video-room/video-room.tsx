'use client'

import { useEffect, useState } from "react";
import { LiveKitRoom, ParticipantTile } from "@livekit/components-react";
import "@livekit/components-styles";

export function VideoRoom() {
    const [token, setToken] = useState<string | null>(null);

    // Configurações da sala e identidade do usuário
    const roomName = "sala-teste";
    const identity = `usuario_${Math.floor(Math.random() * 1000)}`;

    useEffect(() => {
        async function fetchToken() {
            try {
                // Busca o token gerado pelo backend
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL}/livekit/token?identity=${identity}&room=${roomName}`
                );

                if (!res.ok) throw new Error("Erro ao buscar token");

                const data = await res.json();
                setToken(data.token);
            } catch (err) {
                console.error("Erro ao buscar token LiveKit:", err);
            }
        }

        fetchToken();
    }, [identity]);

    if (!token) return <p>Conectando...</p>;

    return (
        <LiveKitRoom
            token={token}
            serverUrl={import.meta.env.VITE_LIVEKIT_URL!} // ex: wss://mindflow-33rj47op.livekit.cloud
            connect={true}
            audio={true}
            video={true}
            className="h-screen flex flex-wrap gap-2 p-2"
        >
            {/* ParticipantTile renderiza todos os participantes automaticamente */}
            <ParticipantTile />
        </LiveKitRoom>
    );
}
