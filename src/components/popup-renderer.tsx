import { markPopupAsViewed } from '@/api/popups/popups'
import type { IPopup } from '@/types/popup'
import { WelcomeModal } from './popups/welcome-modal'

interface PopupRendererProps {
  popup: IPopup
  onClose: () => void
}

export function PopupRenderer({ popup, onClose }: PopupRendererProps) {
  async function handleFinalClose(action: string = 'closed') {
    await markPopupAsViewed(popup.id, action)
    onClose()
  }

  if (popup.type === 'MODAL') {
    return <WelcomeModal popup={popup} onClose={handleFinalClose} />
  }

  return null
}
