import { useEffect, useState, type ReactNode } from 'react'
import { ArrowRight, CalendarDays, CircleUserRound, Clock3, Download, Search, UserRoundCheck, UsersRound, type LucideIcon } from 'lucide-react'
import { getRegistrations, isAdmin, signOutAdmin, type AdminRegistration } from '../lib/adminAuth'
import { addDays, dateKey, eventTimeZone } from '../lib/adminDates'
import AdminSidebar, { REGISTRATIONS_PATH, type AdminPage } from './admin/AdminSidebar'
import RegistrationGraph, { WeeklyActivityGraph } from './admin/RegistrationGraph'
import RegistrationTable from './admin/RegistrationTable'

const LOGIN_PATH = '/holywin/2026/admin/login'

function AdminLayout({ page, status, error, query, children }: { page: AdminPage; status: 'loading' | 'ready' | 'error'; error: string; query: string; children: ReactNode }) {
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

function SummaryCard({ label, value, note, icon: Icon }: { label: string; value: number; note: string; icon: LucideIcon }) {
  return <section aria-label={label} className="min-w-0 rounded-2xl border border-[#e4e4e7] bg-white p-4 shadow-[0_4px_18px_rgba(24,24,27,.035)] sm:p-5">
    <div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-zinc-700">{label}</p><Icon size={16} className="text-zinc-950" aria-hidden="true" /></div>
    <p className="mt-5 text-[27px] font-extrabold leading-none tabular-nums tracking-tight text-zinc-950">{value.toLocaleString()}</p>
    <p className="mt-2 text-[11px] text-zinc-400">{note}</p>
  </section>
}

function TopInviters({ registrations }: { registrations: AdminRegistration[] }) {
  const counts = new Map<string, { name: string; count: number }>()
  for (const registration of registrations) {
    const name = registration.invited_by?.trim()
    if (!name) continue
    const key = name.toLocaleLowerCase()
    const existing = counts.get(key)
    counts.set(key, { name: existing?.name ?? name, count: (existing?.count ?? 0) + 1 })
  }
  const top = [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 4)
  const highest = top[0]?.count ?? 1

  return <section aria-labelledby="inviters-title" className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_4px_18px_rgba(24,24,27,.035)] sm:p-6">
    <h2 id="inviters-title" className="text-sm font-bold text-zinc-950">Top inviters</h2>
    <p className="mt-1 text-xs text-zinc-400">Who brought people to Holywin</p>
    {top.length ? <div className="mt-6 space-y-5">{top.map(({ name, count }) => <div key={name}><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="truncate font-medium text-zinc-700" title={name}>{name}</span><span className="font-semibold tabular-nums text-zinc-900">{count}</span></div><div className="h-1.5 rounded-full bg-[#e4e4e7]"><div className="h-full rounded-full bg-zinc-800" style={{ width: `${count / highest * 100}%` }} /></div></div>)}</div> : <p className="mt-6 text-sm text-zinc-500">No inviter details yet.</p>}
  </section>
}

function downloadCsv(registrations: AdminRegistration[]) {
  const cell = (value: string) => {
    const safe = /^[=+\-@]/.test(value) ? `'${value}` : value
    return `"${safe.replace(/"/g, '""')}"`
  }
  const rows = [
    ['Name', 'Email', 'Invited by', 'Registered at'],
    ...registrations.map(row => [row.full_name, row.email, row.invited_by ?? '', row.created_at]),
  ]
  const csv = rows.map(row => row.map(cell).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'holywin-registrations.csv'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function AdminPageContent({ page }: { page: AdminPage }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([])
  const [error, setError] = useState('')
  const query = new URLSearchParams(window.location.search).get('q')?.trim() ?? ''

  useEffect(() => {
    document.title = `${page === 'dashboard' ? 'Dashboard' : 'Registrations'} — Holywin Admin`
    let active = true
    async function load() {
      try {
        if (!(await isAdmin())) {
          window.location.replace(LOGIN_PATH)
          return
        }
        const rows = await getRegistrations()
        if (active) { setRegistrations(rows); setStatus('ready') }
      } catch (cause) {
        if (active) { setError(cause instanceof Error ? cause.message : 'Could not load the admin page.'); setStatus('error') }
      }
    }
    void load()
    return () => { active = false }
  }, [page])

  const today = dateKey(new Date())
  const todayCount = registrations.filter(row => dateKey(row.created_at) === today).length
  const weekStart = addDays(today, -6)
  const weekCount = registrations.filter(row => dateKey(row.created_at) >= weekStart).length
  const invitedCount = registrations.filter(row => row.invited_by?.trim()).length
  const filtered = page === 'registrations' && query
    ? registrations.filter(row => [row.full_name, row.email, row.invited_by ?? ''].some(value => value.toLocaleLowerCase().includes(query.toLocaleLowerCase())))
    : registrations
  const displayDate = new Date().toLocaleDateString('en-US', { timeZone: eventTimeZone, month: 'short', day: 'numeric', year: 'numeric' })

  return <AdminLayout page={page} status={status} error={error} query={query}>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
      <div><p className="text-[11px] font-medium text-zinc-400">Holywin 2026 / Admin</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 sm:text-[28px]">{page === 'dashboard' ? 'Dashboard' : 'Registrations'}</h1></div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#e4e4e7] bg-white px-3 text-xs font-medium text-zinc-600"><CalendarDays size={14} aria-hidden="true" />{displayDate}</span>
        {page === 'dashboard' ? <a href={REGISTRATIONS_PATH} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-zinc-950 px-3 text-xs font-semibold text-white! hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950">View registrations <ArrowRight size={14} aria-hidden="true" /></a> : <button type="button" onClick={() => downloadCsv(filtered)} className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-zinc-950 px-3 text-xs font-semibold text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"><Download size={14} aria-hidden="true" />Export CSV</button>}
      </div>
    </div>

    {page === 'dashboard' ? <>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Total registrations" value={registrations.length} note="All recorded signups" icon={UsersRound} />
        <SummaryCard label="Today" value={todayCount} note="Since midnight in Taipei" icon={Clock3} />
        <SummaryCard label="Last 7 days" value={weekCount} note="Including today" icon={CalendarDays} />
        <SummaryCard label="Invited" value={invitedCount} note="With inviter details" icon={UserRoundCheck} />
      </div>
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
        <div className="min-w-0 space-y-4">
          <RegistrationGraph registrations={registrations} />
          <section aria-labelledby="recent-registrations-title">
            <div className="mb-3 flex items-center justify-between gap-3"><h2 id="recent-registrations-title" className="text-sm font-bold text-zinc-950">Recent registrations</h2><a href={REGISTRATIONS_PATH} className="inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-zinc-950 hover:underline">View all <ArrowRight size={13} aria-hidden="true" /></a></div>
            {registrations.length ? <RegistrationTable registrations={registrations.slice(0, 5)} caption="Five most recent registrations" /> : <p className="rounded-2xl border border-[#e4e4e7] bg-white p-6 text-sm text-zinc-500">No registrations yet.</p>}
          </section>
        </div>
        <div className="min-w-0 space-y-4"><WeeklyActivityGraph registrations={registrations} /><TopInviters registrations={registrations} /></div>
      </div>
    </> : <section aria-label="All registrations">
      <p className="mb-4 text-xs text-zinc-500">{query ? `${filtered.length} match${filtered.length === 1 ? '' : 'es'} for “${query}”` : `${registrations.length} total registration${registrations.length === 1 ? '' : 's'}`}</p>
      {filtered.length ? <RegistrationTable registrations={filtered} caption="All Holywin registrations" /> : <p className="rounded-2xl border border-[#e4e4e7] bg-white p-6 text-sm text-zinc-500">{query ? 'No matching registrations.' : 'No registrations yet.'}</p>}
    </section>}
  </AdminLayout>
}

export function AdminDashboard() { return <AdminPageContent page="dashboard" /> }
export function AdminRegistrations() { return <AdminPageContent page="registrations" /> }
