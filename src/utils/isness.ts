class Is {
  static nullish = (value: unknown): value is null | undefined => {
    return value == null
  }

  static truly = (value: unknown): value is true => {
    return value === true || value === 'true'
  }

  static falsely = (value: unknown): value is false => {
    return value === false || value === 'false' || value === 0 || value === '0'
  }

  static date = (value: unknown): value is Date => {
    if (
      typeof value !== 'string' &&
      typeof value !== 'number' &&
      !(value instanceof Date)
    ) {
      return false
    }
    return !isNaN(new Date(value).getTime())
  }

  static emptyString = (value: unknown): boolean => {
    return typeof value === 'string' && /^(""|''|)$/.test(value)
  }

  static cpf = (value: string): boolean => {
    const cleanCPF = value.replace(/\D/g, '')

    if (cleanCPF.length !== 11) return false

    if (/^(\d)\1{10}$/.test(cleanCPF)) return false

    let sum = 0
    let remainder

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false

    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
    }

    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false

    return true
  }
}

export const is = Is
