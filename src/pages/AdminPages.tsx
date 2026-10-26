import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays, Clock3, Download, Plus, Search, UserRoundCheck, UsersRound, X } from 'lucide-react'
import { addRegistration, deleteRegistration, getRegistrations, isAdmin, setRegistrationAttendance, updateRegistration, type AdminRegistration, type RegistrationChanges } from '../lib/adminAuth'
import { addDays, dateKey, eventTimeZone } from '../lib/adminDates'
import { REGISTRATIONS_PATH, type AdminPage } from '../components/admin/AdminSidebar'
import AdminLayout from '../components/admin/AdminLayout'
import TopInviters from '../components/admin/TopInviters'
import RegistrationGraph, { WeeklyActivityGraph } from '../components/admin/RegistrationGraph'
import RegistrationTable from '../components/admin/RegistrationTable'
import RegistrationDialog from '../components/admin/RegistrationDialog'
import AdminSummaryCard from '../components/ui/AdminSummaryCard'

const LOGIN_PATH = '/holywin/2026/admin/login'

function downloadCsv(registrations: AdminRegistration[]) {
  const cell = (value: string) => {
    const safe = /^[=+\-@]/.test(value) ? `'${value}` : value
    return `"${safe.replace(/"/g, '""')}"`
  }
  const rows = [
    ['Name', 'Email', 'Invited by', 'Best in Costume', 'Character', 'Registered at', 'Attended'],
    ...registrations.map(row => [row.full_name, row.email, row.invited_by ?? '', row.best_in_costume ? 'Yes' : 'No', row.costume_character ?? '', row.created_at, row.is_attended ? 'Yes' : 'No']),
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
  const [authorized, setAuthorized] = useState(false)
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([])
  const [error, setError] = useState('')
  const [pendingAttendanceIds, setPendingAttendanceIds] = useState<Set<string>>(new Set())
  const [attendanceErrors, setAttendanceErrors] = useState<Record<string, string>>({})
  const [activeDialog, setActiveDialog] = useState<{ mode: 'add' } | { mode: 'edit' | 'delete'; registration: AdminRegistration } | null>(null)
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '')
  const query = search.trim()

  function updateSearch(value: string) {
    setSearch(value)
    const url = new URL(window.location.href)
    if (value.trim()) url.searchParams.set('q', value.trim())
    else url.searchParams.delete('q')
    window.history.replaceState(null, '', url)
  }

  async function changeAttendance(row: AdminRegistration) {
    if (pendingAttendanceIds.has(row.id)) return
    setPendingAttendanceIds(current => new Set(current).add(row.id))
    setAttendanceErrors(current => { const next = { ...current }; delete next[row.id]; return next })
    try {
      const isAttended = await setRegistrationAttendance(row.id, !row.is_attended)
      setRegistrations(current => current.map(item => item.id === row.id ? { ...item, is_attended: isAttended } : item))
    } catch (cause) {
      setAttendanceErrors(current => ({ ...current, [row.id]: cause instanceof Error ? cause.message : 'Could not update attendance.' }))
    } finally {
      setPendingAttendanceIds(current => { const next = new Set(current); next.delete(row.id); return next })
    }
  }

  async function saveChanges(id: string, changes: RegistrationChanges) {
    const updated = await updateRegistration(id, changes)
    setRegistrations(current => current.map(row => row.id === id ? updated : row))
  }

  async function createRegistration(changes: RegistrationChanges) {
    const created = await addRegistration(changes)
    setRegistrations(current => [created, ...current])
    updateSearch('')
  }

  async function removeRegistration(id: string) {
    await deleteRegistration(id)
    setRegistrations(current => current.filter(row => row.id !== id))
  }

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const admin = await isAdmin()
        if (!active) return
        if (!admin) {
          window.location.replace(LOGIN_PATH)
          return
        }
        setAuthorized(true)
        document.title = `${page === 'dashboard' ? 'Dashboard' : 'Registrations'} — Holywin Admin`
        const rows = await getRegistrations()
        if (active) {
          setRegistrations(rows)
          setStatus('ready')
        }
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
    ? registrations.filter(row => [row.full_name, row.email, row.invited_by ?? '', row.best_in_costume ? 'Best in Costume' : '', row.costume_character ?? '', new Date(row.created_at).toLocaleString('en-US', { timeZone: eventTimeZone, dateStyle: 'medium', timeStyle: 'short' })].some(value => value.toLocaleLowerCase().includes(query.toLocaleLowerCase())))
    : registrations
  const displayDate = new Date().toLocaleDateString('en-US', { timeZone: eventTimeZone, month: 'short', day: 'numeric', year: 'numeric' })

  if (!authorized) return status === 'error'
    ? <main className="grid min-h-dvh place-items-center bg-[#f6f6f7] px-5 text-sm text-zinc-600"><div role="alert" className="text-center"><p>Could not verify access. Please try signing in again.</p><a href={LOGIN_PATH} className="mt-3 inline-block font-semibold text-zinc-950 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950">Go to login</a></div></main>
    : <main aria-busy="true" className="min-h-dvh bg-[#f6f6f7]"><span role="status" className="sr-only">Verifying admin session…</span></main>

  return <AdminLayout page={page} status={status} error={error}>
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
            {registrations.length ? <RegistrationTable registrations={registrations.slice(0, 5)} caption="Five most recent registrations" onAttendanceChange={changeAttendance} pendingAttendanceIds={pendingAttendanceIds} attendanceErrors={attendanceErrors} onEdit={registration => setActiveDialog({ mode: 'edit', registration })} onDelete={registration => setActiveDialog({ mode: 'delete', registration })} /> : <p className="rounded-2xl border border-[#e4e4e7] bg-white p-6 text-sm text-zinc-500">No registrations yet.</p>}
          </section>
        </div>
        <div className="min-w-0 space-y-4"><WeeklyActivityGraph registrations={registrations} /><TopInviters registrations={registrations} /></div>
      </div>
    </> : <section aria-label="All registrations">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <p role="status" className="text-xs text-zinc-500">{query ? `${filtered.length} of ${registrations.length} registration${registrations.length === 1 ? '' : 's'}` : `${registrations.length} total registration${registrations.length === 1 ? '' : 's'}`}</p>
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
          <button type="button" onClick={() => setActiveDialog({ mode: 'add' })} className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"><Plus size={17} aria-hidden="true" />Add</button>
          <div role="search" className="relative w-full min-w-0 max-w-72 sm:w-72">
            <label htmlFor="registration-search" className="sr-only">Search registrations table</label>
            <Search size={15} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input id="registration-search" type="text" inputMode="search" autoComplete="off" value={search} onChange={event => updateSearch(event.target.value)} placeholder="Search registrations..." className="h-11 w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-9 text-sm text-zinc-900 shadow-sm outline-none placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200" />
            {search && <button type="button" onClick={() => updateSearch('')} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-zinc-950"><X size={14} aria-hidden="true" /></button>}
          </div>
        </div>
      </div>
      {filtered.length ? <RegistrationTable registrations={filtered} caption="All Holywin registrations" onAttendanceChange={changeAttendance} pendingAttendanceIds={pendingAttendanceIds} attendanceErrors={attendanceErrors} onEdit={registration => setActiveDialog({ mode: 'edit', registration })} onDelete={registration => setActiveDialog({ mode: 'delete', registration })} /> : <div className="rounded-2xl border border-[#e4e4e7] bg-white p-6 text-sm text-zinc-500">{query ? <>No matching registrations. <button type="button" onClick={() => updateSearch('')} className="font-semibold text-zinc-950 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-zinc-950">Clear search</button></> : 'No registrations yet.'}</div>}
    </section>}
    {activeDialog && <RegistrationDialog key={`${activeDialog.mode}-${'registration' in activeDialog ? activeDialog.registration.id : 'new'}`} mode={activeDialog.mode} registration={'registration' in activeDialog ? activeDialog.registration : undefined} onClose={() => setActiveDialog(null)} onAdd={createRegistration} onSave={saveChanges} onDelete={removeRegistration} />}
  </AdminLayout>
}

export function AdminDashboard() { return <AdminPageContent page="dashboard" /> }
export function AdminRegistrations() { return <AdminPageContent page="registrations" /> }
