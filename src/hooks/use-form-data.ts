import { Time } from '@/utils/time'

export type ITypedFormData<T> = FormData & { readonly __brand?: T }

export function useFormData<T extends object = Record<string, never>>() {
  function transform(data: T): ITypedFormData<T> {
    const formData = new FormData()
    const keys = Object.keys(data)

    for (const key of keys) {
      const value = data[key as keyof typeof data]

      if (!value || value === '') continue

      if (value instanceof File) {
        formData.append(key, value)
      } else if (value instanceof Date) {
        formData.append(key, Time.toISODate(value))
      } else if (Array.isArray(value)) {
        for (const item of value) formData.append(key, String(item))
      } else {
        formData.append(key, value?.toString())
      }
    }

    return formData as ITypedFormData<T>
  }

  return { transform }
}
