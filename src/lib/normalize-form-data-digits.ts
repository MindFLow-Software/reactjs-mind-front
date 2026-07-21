import { Normalizer } from '@/utils/normalizer'

export function normalizeFormDataDigits(
  formData: FormData,
  keys: string[],
): void {
  for (const key of keys) {
    const value = formData.get(key)
    if (typeof value !== 'string' || !value) continue

    formData.set(key, Normalizer.digits(value))
  }
}
