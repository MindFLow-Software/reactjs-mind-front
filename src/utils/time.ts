import { ptBR } from 'date-fns/locale'
import { differenceInYears, format, isFuture, isValid, startOfDay } from 'date-fns'

export class Time {
  static now() {
    return startOfDay(new Date())
  }

  static toBrazilianFormat(date: Date) {
    if (!date || !isValid(date)) return
    return format(date, 'dd-MM-yyyy', { locale: ptBR })
  }

  static toAmericanFormat(date: Date | null | undefined) {
    if (!date || !isValid(date)) return
    return format(new Date(), 'yyyy-MM-dd')
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
    if (!date) return false
    return isFuture(date)
  }
}
