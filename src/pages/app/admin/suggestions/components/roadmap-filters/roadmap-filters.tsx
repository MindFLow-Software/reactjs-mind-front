import { useState } from 'react'
import {
  Filter,
  XCircle,
  LayoutGrid,
  Palette,
  CalendarDays,
  BarChart3,
  ShieldCheck,
  Share2,
  HelpCircle,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import { SearchInput } from '@/components/form-fields/search-input/search-input'
import { SuggestionCategory } from '@/types/suggestion/suggestion-category'
import './roadmap-filters.css'

type RoadmapFiltersProps = {
  search: string
  category: string
  onFiltersChange: (filters: { search?: string; category?: string }) => void
  onClearFilters: () => void
}

const CATEGORIES = [
  {
    value: 'all',
    label: 'Todas Categorias',
    icon: LayoutGrid,
    color: 'text-muted-foreground',
  },
  {
    value: SuggestionCategory.UI_UX,
    label: 'Interface / UX',
    icon: Palette,
    color: 'text-pink-500',
  },
  {
    value: SuggestionCategory.SCHEDULING,
    label: 'Agendamentos',
    icon: CalendarDays,
    color: 'text-blue-500',
  },
  {
    value: SuggestionCategory.REPORTS,
    label: 'Relatórios',
    icon: BarChart3,
    color: 'text-amber-500',
  },
  {
    value: SuggestionCategory.PRIVACY_LGPD,
    label: 'Privacidade',
    icon: ShieldCheck,
    color: 'text-emerald-500',
  },
  {
    value: SuggestionCategory.INTEGRATIONS,
    label: 'Integrações',
    icon: Share2,
    color: 'text-indigo-500',
  },
  {
    value: SuggestionCategory.OTHERS,
    label: 'Outros',
    icon: HelpCircle,
    color: 'text-muted-foreground',
  },
]

export function RoadmapFilters({
  search,
  category,
  onFiltersChange,
  onClearFilters,
}: RoadmapFiltersProps) {
  const [searchValue, setSearchValue] = useState(search)

  function handleClearFilters() {
    onClearFilters()
    setSearchValue('')
  }

  return (
    <div className="ads-filters-root">
      <div className="ads-filters-group">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          onDebouncedChange={(value) => onFiltersChange({ search: value })}
          placeholder="Buscar sugestão..."
          className="ads-filters-search-input"
        />

        <Select
          value={category}
          onValueChange={(value) => onFiltersChange({ category: value })}
        >
          <SelectTrigger className="ads-filters-select-trigger">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <SelectValue placeholder="Categoria" />
            </div>
          </SelectTrigger>

          <SelectContent className="min-w-[220px]">
            <SelectGroup>
              {CATEGORIES.map((item) => {
                const Icon = item.icon
                return (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="cursor-pointer py-2.5"
                  >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Icon className={`h-4 w-4 ${item.color}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>

        {(search || category !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={handleClearFilters}
            className="ads-filters-clear-btn"
          >
            <XCircle data-icon="inline-start" />
            Limpar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
