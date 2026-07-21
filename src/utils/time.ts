import { ptBR } from 'date-fns/locale'
import {
  addMinutes,
  differenceInYears,
  format,
  formatDistanceToNow,
  getHours,
  isAfter,
  isFuture,
  isValid,
  setHours,
  setMinutes,
  setSeconds,
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

  static toBrazilianFormat(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, 'dd/MM/yyyy', { locale: ptBR })
  }

  static toISODate(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, 'yyyy-MM-dd')
  }

  static toAmericanFormat(date: Date | null | undefined) {
    if (!date || !isValid(date)) return
    return format(new Date(), 'yyyy/MM/dd')
  }

  static calculateAge(date: Date | string | null | undefined) {
    const birth = Time.parse(date)
    if (!birth) return null

    const age = differenceInYears(new Date(), birth)
    const suffix = age === 1 ? 'ano' : 'anos'

    return `${age} ${suffix}`
  }

  static toReadableDateTime(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  static toExtensiveReadableDateTime(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "EEEE 'às' HH:mm", { locale: ptBR })
  }

  static toShortDateTime(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, 'dd/MM/yy HH:mm', { locale: ptBR })
  }

  static toFileStamp(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, 'dd-MM-yyyy')
  }

  static timestamp(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return 0

    return parsed.getTime()
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

  static toDayLongMonth(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "d 'de' MMMM", { locale: ptBR })
  }

  static toDayLongMonthYear(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "dd 'de' MMMM, yyyy", { locale: ptBR })
  }

  static toLongMonthYear(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, 'MMMM yyyy', { locale: ptBR })
  }

  static toHourCompact(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "HH'h'", { locale: ptBR })
  }

  static atTime(date: Date | string | null | undefined, time: string) {
    const parsed = Time.parse(date)
    if (!parsed || !time) return null

    const [hours, minutes] = time.split(':').map(Number)
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null

    return setSeconds(setMinutes(setHours(parsed, hours), minutes), 0)
  }

  static addMinutes(date: Date | string | null | undefined, minutes: number) {
    const parsed = Time.parse(date)
    if (!parsed) return null

    return addMinutes(parsed, minutes)
  }

  static toWeekdayLongDate(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  static toHourMinute(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, 'HH:mm', { locale: ptBR })
  }

  static currentHour() {
    return getHours(new Date())
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

  static toDayMonthYearAbbrev(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, 'dd MMM yyyy', { locale: ptBR })
  }

  static toShortDayMonth(date: Date | string | null | undefined) {
    const parsed = Time.parse(date)
    if (!parsed) return ''

    return format(parsed, 'dd/MM')
  }

  static toMonthYearUppercase(date: Date | string | null | undefined) {
    return Time.toLongMonthYear(date).toUpperCase()
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
