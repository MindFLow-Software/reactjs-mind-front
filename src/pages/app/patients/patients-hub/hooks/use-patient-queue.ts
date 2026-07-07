import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePatientQueueStore } from '@/store/use-patient-queue-store'

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
  const queue = usePatientQueueStore((state) => state.queue)

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
