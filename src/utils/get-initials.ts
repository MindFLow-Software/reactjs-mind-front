export function getInitials(name: string | null | undefined): string {
  return (name ?? '')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}
