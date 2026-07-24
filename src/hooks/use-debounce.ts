import { useCallback, useEffect, useRef } from 'react'
import { debounce as lodashDebounce } from 'lodash-es'
import type { DebouncedFunc } from 'lodash-es'

type IDebounceCallback = () => void

type IUseDebounceReturn = {
  debounce: (callback: IDebounceCallback, ms: number) => void
}

export function useDebounce(): IUseDebounceReturn {
  const debouncedRef = useRef<DebouncedFunc<
    (cb: IDebounceCallback) => void
  > | null>(null)
  const msRef = useRef<number | null>(null)

  const debounce = useCallback((callback: IDebounceCallback, ms: number) => {
    if (msRef.current !== ms) {
      debouncedRef.current?.cancel()
      debouncedRef.current = lodashDebounce((cb: IDebounceCallback) => cb(), ms)
      msRef.current = ms
    }
    debouncedRef.current?.(callback)
  }, [])

  useEffect(() => () => debouncedRef.current?.cancel(), [])

  return { debounce }
}
