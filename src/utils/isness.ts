import { Normalizer } from './normalizer'

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
    const cpf = Normalizer.digits(value)

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false

    const checkDigit = (length: number): number => {
      let sum = 0
      for (let i = 0; i < length; i++) {
        sum += parseInt(cpf.charAt(i)) * (length + 1 - i)
      }
      const rest = (sum * 10) % 11
      return rest === 10 || rest === 11 ? 0 : rest
    }
    console.log('1. ', checkDigit(9) === parseInt(cpf.charAt(9)))
    console.log('2. ', checkDigit(10) === parseInt(cpf.charAt(10)))

    return (
      checkDigit(9) === parseInt(cpf.charAt(9)) &&
      checkDigit(10) === parseInt(cpf.charAt(10))
    )
  }
}

export const is = Is
