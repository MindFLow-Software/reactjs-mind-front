import { FilterX } from 'lucide-react'
import './records-empty-state.css'

export function RecordsEmptyState() {
  return (
    <div className="pr-empty">
      <FilterX className="pr-empty-icon" />
      <p className="pr-empty-text">Nenhum prontuario encontrado.</p>
    </div>
  )
}
