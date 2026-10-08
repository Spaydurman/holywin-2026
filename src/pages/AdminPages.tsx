import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, Download, UserRoundCheck, UsersRound } from 'lucide-react'
import { getRegistrations, isAdmin, type AdminRegistration } from '../lib/adminAuth'
import { addDays, dateKey, eventTimeZone } from '../lib/adminDates'
import { REGISTRATIONS_PATH, type AdminPage } from '../components/admin/AdminSidebar'
import AdminLayout from '../components/admin/AdminLayout'
import TopInviters from '../components/admin/TopInviters'
import RegistrationGraph, { WeeklyActivityGraph } from '../components/admin/RegistrationGraph'
import RegistrationTable from '../components/admin/RegistrationTable'
import AdminSummaryCard from '../components/ui/AdminSummaryCard'

const LOGIN_PATH = '/holywin/2026/admin/login'

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
        <AdminSummaryCard label="Total registrations" value={registrations.length} note="All recorded signups" icon={UsersRound} />
        <AdminSummaryCard label="Today" value={todayCount} note="Since midnight in Taipei" icon={Clock3} />
        <AdminSummaryCard label="Last 7 days" value={weekCount} note="Including today" icon={CalendarDays} />
        <AdminSummaryCard label="Invited" value={invitedCount} note="With inviter details" icon={UserRoundCheck} />
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
