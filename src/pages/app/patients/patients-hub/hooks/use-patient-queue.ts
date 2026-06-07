import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATIENT_QUEUE_STORAGE_KEY } from '../constants'

interface UsePatientQueueReturn {
  queue: string[]
  currentIndex: number
  hasPrev: boolean
  hasNext: boolean
  navigatePrev: () => void
  navigateNext: () => void
}

export function usePatientQueue(
  currentPatientId: string,
): UsePatientQueueReturn {
  const navigate = useNavigate()

  const queue = useMemo<string[]>(() => {
    try {
      const raw = sessionStorage.getItem(PATIENT_QUEUE_STORAGE_KEY)
      if (!raw) return []
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string')
      }
      return []
    } catch {
      return []
    }
  }, [])

  const currentIndex = useMemo(() => {
    if (!currentPatientId || queue.length === 0) return -1
    return queue.indexOf(currentPatientId)
  }, [queue, currentPatientId])

  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < queue.length - 1

  const navigatePrev = useCallback(() => {
    if (!hasPrev) return
    navigate(`/patients/${queue[currentIndex - 1]}/details`)
  }, [hasPrev, navigate, queue, currentIndex])

  const navigateNext = useCallback(() => {
    if (!hasNext) return
    navigate(`/patients/${queue[currentIndex + 1]}/details`)
  }, [hasNext, navigate, queue, currentIndex])

  return { queue, currentIndex, hasPrev, hasNext, navigatePrev, navigateNext }
}
