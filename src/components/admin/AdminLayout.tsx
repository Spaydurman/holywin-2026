import type { ReactNode } from 'react'
import { CircleUserRound, Search } from 'lucide-react'
import { signOutAdmin } from '../../lib/adminAuth'
import AdminSidebar, { REGISTRATIONS_PATH, type AdminPage } from './AdminSidebar'

const LOGIN_PATH = '/holywin/2026/admin/login'

export default function AdminLayout({ page, status, error, query, children }: { page: AdminPage; status: 'loading' | 'ready' | 'error'; error: string; query: string; children: ReactNode }) {
  async function signOut() {
    await signOutAdmin()
    window.location.assign(LOGIN_PATH)
  }

  return <div className="min-h-dvh bg-[#f6f6f7] text-zinc-900">
    <a href="#admin-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-zinc-950 focus:px-4 focus:py-2 focus:text-white">Skip to main content</a>
    <div className="min-h-dvh bg-white md:flex">
      <AdminSidebar page={page} onSignOut={signOut} />
      <div className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-[#e4e4e7] bg-white px-5 sm:px-7 lg:px-8">
          <form action={REGISTRATIONS_PATH} method="get" role="search" className="flex h-9 w-full max-w-72 items-center gap-2 rounded-full border border-[#f4f4f5] bg-[#fafafa] px-3 text-zinc-400 focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-200">
            <Search size={15} aria-hidden="true" />
            <input name="q" defaultValue={page === 'registrations' ? query : ''} aria-label="Search registrations" placeholder="Search registrations..." className="min-w-0 flex-1 bg-transparent text-xs text-zinc-700 outline-none placeholder:text-zinc-400" />
          </form>
          <div className="flex shrink-0 items-center gap-2 text-zinc-500"><span className="hidden text-xs font-medium sm:inline">Admin</span><CircleUserRound size={25} className="text-zinc-600" aria-label="Admin account" /></div>
        </header>
        <main id="admin-main" className="min-h-[calc(100dvh-4rem)] bg-[#f6f6f7] px-5 py-6 sm:px-7 sm:py-8 lg:px-8">
          <div>
            {status === 'loading' && <p role="status" className="text-sm text-zinc-500">Loading admin page…</p>}
            {status === 'error' && <p role="alert" className="rounded-xl border border-zinc-400 bg-zinc-100 p-4 text-sm font-medium text-zinc-950">{error}</p>}
            {status === 'ready' && children}
          </div>
        </main>
      </div>
    </div>
  </div>
}

