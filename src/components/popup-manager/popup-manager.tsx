'use client'

import { useCallback } from 'react'

import { PopupType } from '@/types/popup/popup-type'
import { useUnseenPopups } from '@/components/popups/hooks/use-unseen-popups'
import { useMarkPopupViewed } from '@/components/popups/hooks/use-mark-popup-viewed'
import { WelcomeModal } from '@/components/popups/welcome-modal/welcome-modal'
import { AchievementToast } from '@/components/popups/achievement-toast/achievement-toast'

export function PopupManager() {
  const { data: popups } = useUnseenPopups()
  const { mutate: registerView } = useMarkPopupViewed()

  const currentPopup = popups?.[0] ?? null

  const handleClose = useCallback(
    (action: string) => {
      if (!currentPopup) return
      registerView({ id: currentPopup.id, action })
    },
    [currentPopup, registerView],
  )

  if (!currentPopup) return null

  if (currentPopup.type === PopupType.TOAST) {
    return (
      <AchievementToast
        key={currentPopup.id}
        popup={currentPopup}
        onClose={handleClose}
      />
    )
  }

  return (
    <WelcomeModal
      key={currentPopup.id}
      popup={currentPopup}
      onClose={handleClose}
    />
  )
}
