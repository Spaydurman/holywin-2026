import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, LayoutDashboard, LogOut, Menu, Sparkles, UsersRound, X } from 'lucide-react'

export type AdminPage = 'dashboard' | 'registrations'

export const DASHBOARD_PATH = '/holywin/2026/admin/dashboard'
export const REGISTRATIONS_PATH = '/holywin/2026/admin/registrations'

const links = [
  { href: DASHBOARD_PATH, label: 'Dashboard', page: 'dashboard', icon: LayoutDashboard },
  { href: REGISTRATIONS_PATH, label: 'Registrations', page: 'registrations', icon: UsersRound },
] as const

export default function AdminSidebar({ page, onSignOut }: { page: AdminPage; onSignOut: () => void }) {
  const [open, setOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeButton.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open])

  return <>
    <header className="flex h-16 items-center justify-between border-b border-[#e4e4e7] bg-white px-5 md:hidden">
      <a href="/" className="flex items-center gap-2 text-base font-extrabold tracking-tight text-zinc-950"><Sparkles size={21} className="text-zinc-950" aria-hidden="true" />Holywin</a>
      <button ref={menuButton} type="button" onClick={() => setOpen(true)} aria-label="Open admin navigation" aria-expanded={open} aria-controls="admin-sidebar" className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"><Menu size={21} /></button>
    </header>
    {open && <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation" className="fixed inset-0 z-30 bg-zinc-950/40 md:hidden" />}
    <aside id="admin-sidebar" aria-label="Admin sidebar" className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-[#e4e4e7] bg-white transition-transform motion-reduce:transition-none md:relative md:inset-auto md:visible md:w-56 md:shrink-0 md:translate-x-0 ${open ? 'visible translate-x-0' : 'invisible -translate-x-full'}`}>
      <div className="flex h-[70px] items-center justify-between px-5">
        <a href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight text-zinc-950"><Sparkles size={23} className="text-zinc-950" aria-hidden="true" />Holywin</a>
        <button ref={closeButton} type="button" onClick={() => { setOpen(false); menuButton.current?.focus() }} aria-label="Close menu" className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 md:hidden"><X size={20} /></button>
      </div>

      <nav aria-label="Admin navigation" className="space-y-1 px-3 pt-4">
        {links.map(({ href, label, page: linkPage, icon: Icon }) => <a key={href} href={href} aria-current={page === linkPage ? 'page' : undefined} className={`relative flex min-h-11 items-center gap-3 rounded-xl px-4 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${page === linkPage ? 'bg-zinc-100 text-zinc-950 before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[3px] before:rounded-full before:bg-zinc-950' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950'}`}><Icon size={17} aria-hidden="true" />{label}</a>)}
      </nav>

      <div className="mx-5 mt-5 border-t border-[#e4e4e7]" />
      <p className="px-7 pt-5 text-[11px] font-semibold uppercase tracking-[.12em] text-zinc-400">Holywin 2026</p>
      <a href="/" className="mx-3 mt-2 flex min-h-11 items-center gap-3 rounded-xl px-4 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"><ArrowUpRight size={17} aria-hidden="true" />Visit website</a>

      <div className="mt-auto border-t border-[#e4e4e7] p-3">
        <button type="button" onClick={onSignOut} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"><LogOut size={17} aria-hidden="true" />Sign out</button>
      </div>
    </aside>
  </>
}
