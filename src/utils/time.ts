import { ptBR } from 'date-fns/locale'
import {
  differenceInYears,
  format,
  isAfter,
  isFuture,
  isValid,
  startOfDay,
} from 'date-fns'
import { Normalizer } from './normalizer'

export class Time {
  static now() {
    return startOfDay(new Date())
  }

  static today = new Date()

  static minDate = new Date(
    this.today.getFullYear() - 120,
    this.today.getMonth(),
    this.today.getDate(),
  )

  static toBrazilianFormat(date: Date) {
    // if (!date || !isValid(date)) return
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  }

  static toAmericanFormat(date: Date | null | undefined) {
    if (!date || !isValid(date)) return
    return format(new Date(), 'yyyy/MM/dd')
  }

  static calculateAge(date: Date | null | undefined) {
    if (!date || !isValid(date)) return null

    const now = new Date()
    const birth = new Date(date)

    const age = differenceInYears(now, birth)
    const suffix = age > 1 ? 'anos' : 'ano'

    return `${age} ${suffix}`
  }

  static toReadableDateTime(date: Date) {
    if (!date || !isValid(date)) return ''

    const dateFormatted = format(date, "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    })

    return dateFormatted
  }

  static isFuture(date: Date | null | undefined) {
    console.log('date: ', date)
    if (!date) return false
    return isFuture(date)
  }

  static textToDate(value: string) {
    const digits = Normalizer.digits(value).slice(0, 8)
    let inputValue = digits

    if (digits.length > 2) {
      inputValue = `${digits.slice(0, 2)}/${digits.slice(2)}`
    }

    if (digits.length > 4) {
      inputValue = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
    }

    if (inputValue.length !== 10) {
      return { inputValue, date: null }
    }

    const [day, month, year] = inputValue.split('/').map(Number)

    const date = new Date(year, month - 1, day)

    const isValidDate =
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day

    const isAfterMinDate = isAfter(date, this.minDate)

    if (!isValidDate || !isAfterMinDate) {
      return { inputValue: '', date: null }
    }

    return { inputValue, date }
  }

  static dateToText(date: Date | undefined) {
    if (!date) return ''
    if (!isValid(date)) return ''

    const year = date.getFullYear()
    if (year <= this.minDate.getFullYear()) return ''
    if (year <= this.minDate.getFullYear()) return ''

    return format(date, 'dd/MM/yyyy')
  }
}
