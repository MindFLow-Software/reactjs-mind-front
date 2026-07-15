import { STATUS_TOGGLE_DISABLED_REASON } from '../constants'
import type { IUsePatientStatusGuard } from '../patients-list.types'

export function usePatientStatusGuard(): IUsePatientStatusGuard {
  return {
    isToggleDisabled: true,
    disabledReason: STATUS_TOGGLE_DISABLED_REASON,
  }
}
