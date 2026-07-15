import { Link, type LinkProps, useLocation } from 'react-router-dom'

import './nav-link.css'

export type NavLinkProps = LinkProps

export function NavLink(props: NavLinkProps) {
  const { pathname } = useLocation()

  return (
    <Link data-current={pathname === props.to} className="nl-link" {...props} />
  )
}
