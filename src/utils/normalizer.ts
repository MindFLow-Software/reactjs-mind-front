export class Normalizer {
  static digits = (value: string | null | undefined): string => {
    if (!value || typeof value !== 'string') return ''
    return value.replace(/[^0-9]/g, '')
  }

  static letters = (value: string | null | undefined): string => {
    if (!value || typeof value !== 'string') return ''
    return value.replace(/[^a-zA-Z]/g, '')
  }

  static removeSpecialCharacters = (
    value: string | null | undefined,
  ): string => {
    if (!value || typeof value !== 'string') return ''
    return value.replace(/[*#@]/g, '')
  }

  static capitalize = (text: string | null | undefined): string => {
    if (!text || typeof text !== 'string') return ''

    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  static toSnakeCase = (value: string | null | undefined): string => {
    if (!value || typeof value !== 'string') return ''
    return value.replace(/\s/g, '_')
  }

  static toKebabCase = (value: string | null | undefined): string => {
    if (!value || typeof value !== 'string') return ''
    return value.replace(/\s+/g, '-')
  }

  static initials = (name: string | null | undefined): string => {
    if (!name || typeof name !== 'string') return ''
    return name
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0] ?? '')
      .join('')
      .toUpperCase()
  }

  static unmask = (value: string | null | undefined): string => {
    return Normalizer.digits(value)
  }

  static maskCpf = (value: string | null | undefined): string => {
    const digits = Normalizer.digits(value).slice(0, 11)

    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`
    if (digits.length <= 9) {
      return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
    }

    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  }

  static maskPhone = (value: string | null | undefined): string => {
    const digits = Normalizer.digits(value).slice(0, 11)

    if (digits.length <= 2) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`

    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }
}
