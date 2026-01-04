import { markPopupAsViewed, type Popup } from '@/api/popups'
import { WelcomeModal } from './popups/welcome-modal'

interface PopupRendererProps {
    popup: Popup
    onClose: () => void
}

export function PopupRenderer({ popup, onClose }: PopupRendererProps) {
    async function handleFinalClose(action: string = 'closed') {
        await markPopupAsViewed(popup.id, action)
        onClose()
    }

    if (popup.type === 'MODAL') {
        return (
            <WelcomeModal
                popup={popup}
                onClose={handleFinalClose}
            />
        )
    }
    
    return null
}