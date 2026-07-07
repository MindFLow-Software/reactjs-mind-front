const STATUS_TOGGLE_DISABLED_REASON =
  'Alterar status de pacientes está temporariamente indisponível.'

export interface UsePatientStatusGuardReturn {
  isToggleDisabled: boolean
  disabledReason: string
}

export function usePatientStatusGuard(): UsePatientStatusGuardReturn {
  return {
    isToggleDisabled: true,
    disabledReason: STATUS_TOGGLE_DISABLED_REASON,
  }
}
