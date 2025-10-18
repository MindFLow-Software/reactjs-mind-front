import { Brain, Home, Users } from 'lucide-react'

import { NavLink } from './nav-link'
import { Separator } from './ui/separator'
import { ThemeToggle } from './theme/theme-toggle'
import { AccountMenu } from './account-menu'

export function Header() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <Brain className="h-6 w-6 text-blue-500" />

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center space-x-4 lg:space-x-6">
          <NavLink to="/">
            <Home className="h-4 w-4" />
            Início
          </NavLink>
          <NavLink to="/patients">
            <Users className="h-4 w-4" />
            Pacientes
          </NavLink>
        </nav>
        <div className='ml-auto flex items-center gap-2'>
          <ThemeToggle />
          <AccountMenu/>
        </div>
      </div>
    </div>
  )
}