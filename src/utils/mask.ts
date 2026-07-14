import { Normalizer } from './normalizer'

export class Mask {
  static cpf = (raw: string | null | undefined): string => {
    if (!raw) return ''

    const cleaned = Normalizer.digits(raw).slice(0, 11)

    return cleaned
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  static phone = (raw: string | null | undefined): string => {
    if (!raw) return ''

    const cleaned = Normalizer.digits(raw).slice(0, 11)
    const len = cleaned.length

    if (len <= 10) {
      return cleaned
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
    }

    return cleaned
      .replace(/^(\d{2})(\d)/g, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
  }

  static cep = (raw: string | null | undefined): string => {
    if (!raw) return ''

    const cleaned = Normalizer.digits(raw)

    if (/^\d{8}$/.test(cleaned)) {
      return cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2')
    }

    return cleaned
  }
}
