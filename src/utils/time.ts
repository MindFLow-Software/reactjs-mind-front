import { ptBR } from 'date-fns/locale'
import {
  differenceInYears,
  format,
  formatDistanceToNow,
  isAfter,
  isFuture,
  isValid,
  startOfDay,
  subDays,
} from 'date-fns'
import { Normalizer } from './normalizer'

export class Time {
  static now() {
    return startOfDay(new Date())
  }

  static parse(value: Date | string | null | undefined) {
    if (!value) return null
    const date = typeof value === 'string' ? new Date(value) : value
    return isValid(date) ? date : null
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

  static toReadableDateTime(date: Date | null | undefined) {
    if (!date || !isValid(date)) return ''

    const dateFormatted = format(date, "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    })

    return dateFormatted
  }

  static toExtensiveReadableDateTime(date: Date | null | undefined) {
    if (!date || !isValid(date)) return ''

    const dateFormatted = format(date, "EEEE 'às' HH:mm", {
      locale: ptBR,
    })

    return dateFormatted
  }

  static toShortMonthDate(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "dd 'de' MMM. 'de' yyyy", { locale: ptBR })
  }

  static toDayShortMonth(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "d 'de' MMM", { locale: ptBR })
  }

  static toDayShortMonthYear(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "d 'de' MMM 'de' yyyy", { locale: ptBR })
  }

  static toDayShortMonthAtTime(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "d 'de' MMM 'às' HH:mm", { locale: ptBR })
  }

  static toDayMonthAbbrev(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, 'dd MMM', { locale: ptBR })
  }

  static toDayMonthLong(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "dd 'de' MMMM", { locale: ptBR })
  }

  static subtractDays(date: Date | string | null | undefined, days: number) {
    const parsed = Time.parse(date)
    if (!parsed) return null

    return subDays(parsed, days)
  }

  static toRelativeFromNow(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return formatDistanceToNow(parsed, { addSuffix: true, locale: ptBR })
  }

  static toRelativeFromNowShort(date: Date | string | null | undefined) {
    return Time.toRelativeFromNow(date).replace('há ', '').replace('em ', '')
  }

  static isFuture(date: Date | null | undefined) {
    if (!date) return false
    return isFuture(date)
  }

  static maskDateInput(value: string) {
    const digits = Normalizer.digits(value).slice(0, 8)

    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`

    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
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

    return format(date, 'dd/MM/yyyy')
  }
}
