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
}

export const is = Is
