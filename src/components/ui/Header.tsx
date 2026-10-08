import { useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Logo } from './Brand'
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const links = [
    { href: '#details', label: 'The details' },
    { href: '#about', label: 'About' },
    { href: '#moments', label: 'Past moments' },
  ]
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Logo />
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
          {links.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
          <a className="nav-register" href="#register" onClick={() => setMenuOpen(false)}>Join the fun <ArrowRight size={17} strokeWidth={2.5} /></a>
        </nav>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>
  )
}
