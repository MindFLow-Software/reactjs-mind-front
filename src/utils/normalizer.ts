export class Normalizer {
  static digits = (value: string | null | undefined): string => {
    if (!value || typeof value !== 'string') return ''
    return value.replace(/[^0-9]/g, '')
  }

  static letters = (value: string | null | undefined): string => {
    if (!value || typeof value !== 'string') return ''
    return value.replace(/[^a-zA-Z]/g, '')
  }

  static removeSpecialCharacters = (value: string | null | undefined): string => {
    if (!value || typeof value !== 'string') return ''
    return value.replace(/[*#@]/g, '')
  }

  static capitalize = (text: string | null | undefined): string => {
    if (!text) return ''
    return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
  }
}
