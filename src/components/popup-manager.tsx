import { useQuery } from '@tanstack/react-query'
import { fetchActivePopups } from '@/api/popups'
import { PopupRenderer } from './popup-renderer'
import { useState } from 'react'

export function PopupManager() {
    const [currentPopupIndex, setCurrentPopupIndex] = useState(0)

    const { data: popups, isLoading } = useQuery({
        queryKey: ['active-popups'],
        queryFn: fetchActivePopups,
        staleTime: Infinity,
    })

    if (isLoading || !popups || popups.length === 0) {
        return null
    }

    const currentPopup = popups[currentPopupIndex]

    if (!currentPopup) {
        return null
    }

    return (
        <PopupRenderer
            key={currentPopup.id}
            popup={currentPopup}
            onClose={() => setCurrentPopupIndex(prev => prev + 1)}
        />
    )
}