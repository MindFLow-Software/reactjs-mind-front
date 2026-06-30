export class Currency {
  static toBRL(cents: number | null): string | null {
    if (cents == null) return null
    return (cents / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }
}
