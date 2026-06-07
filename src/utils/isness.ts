/* eslint-disable @typescript-eslint/no-explicit-any */
class Is {
  static nullish = (value: any): value is null | undefined => {
    return value == null
  }

  static truly = (value: any): value is true => {
    return Boolean(['true', true].includes(value))
  }

  static falsely = (value: any): value is false => {
    return Boolean(['false', false, 0, '0'].includes(value))
  }

  static date = (value: any): value is Date => {
    const date = new Date(value)
    return !isNaN(date.getTime())
  }

  static emptyString = (value: any): boolean => {
    return /^(""|''|)$/.test(value)
  }
}

export const is = Is
