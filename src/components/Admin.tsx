import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, LogOut, ShieldCheck } from 'lucide-react'
import { getRegistrations, isAdmin, signInAdmin, signOutAdmin } from '../lib/adminAuth'

const LOGIN_PATH = '/holywin/2026/admin/login'
const DASHBOARD_PATH = '/holywin/2026/admin/dashboard'

function navigate(path: string) {
  window.location.assign(path)
}

export function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    document.title = 'Admin login — Holywin'
    isAdmin().then(admin => { if (admin) navigate(DASHBOARD_PATH) }).catch(() => undefined)
  }, [])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await signInAdmin(username, password)
      navigate(DASHBOARD_PATH)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign in failed. Please try again.')
      setBusy(false)
    }
  }

  return <main className="flex min-h-dvh items-center justify-center bg-[#f7f5ed] px-5 py-12 text-zinc-950">
    <div className="w-full max-w-md">
      <a href="/" className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm font-bold underline underline-offset-4 hover:text-zinc-600"><ArrowLeft size={18} /> Back to Holywin</a>
      <div className="border-4 border-zinc-950 bg-white p-7 shadow-[10px_10px_0_#111] sm:p-10">
        <div className="mb-7 flex h-12 w-12 items-center justify-center bg-zinc-950 text-white"><ShieldCheck size={26} aria-hidden="true" /></div>
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[.18em]">Holywin 2026 / Admin</p>
        <h1 className="mb-3 font-['Archivo_Black'] text-4xl uppercase leading-none tracking-tight sm:text-5xl">Welcome back.</h1>
        <p className="mb-8 text-base leading-relaxed text-zinc-600">Sign in to view registrations and manage your event.</p>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label htmlFor="admin-username" className="mb-2 block text-sm font-bold">Username</label>
            <input id="admin-username" name="username" autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required className="h-12 w-full border-2 border-zinc-900 bg-[#f7f5ed] px-4 text-base outline-none focus-visible:ring-4 focus-visible:ring-zinc-400" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-bold">Password</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required className="h-12 w-full border-2 border-zinc-900 bg-[#f7f5ed] px-4 text-base outline-none focus-visible:ring-4 focus-visible:ring-zinc-400" />
          </div>
          {error && <p role="alert" className="border-2 border-red-700 bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
          <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-3 border-2 border-zinc-950 bg-zinc-950 px-5 font-extrabold uppercase tracking-wide text-white shadow-[4px_4px_0_#888] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#888] disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={19} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  </main>
}

type Registration = Awaited<ReturnType<typeof getRegistrations>>[number]

export function AdminDashboard() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    document.title = 'Admin dashboard — Holywin'
    let active = true
    async function load() {
      try {
        if (!(await isAdmin())) {
          navigate(LOGIN_PATH)
          return
        }
        const rows = await getRegistrations()
        if (active) { setRegistrations(rows); setStatus('ready') }
      } catch (cause) {
        if (active) { setError(cause instanceof Error ? cause.message : 'Could not load the dashboard.'); setStatus('error') }
      }
    }
    void load()
    return () => { active = false }
  }, [])

  async function logout() {
    await signOutAdmin()
    navigate(LOGIN_PATH)
  }

  return <main className="min-h-dvh bg-[#f7f5ed] text-zinc-950">
    <header className="border-b-2 border-zinc-950 bg-white px-5 py-5 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <a href="/" className="font-['Archivo_Black'] text-xl tracking-tight">HOLYWIN<span className="text-zinc-500">.</span></a>
        <button onClick={logout} className="inline-flex min-h-11 items-center gap-2 px-3 text-sm font-bold underline underline-offset-4 hover:text-zinc-600"><LogOut size={18} aria-hidden="true" /> Sign out</button>
      </div>
    </header>
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="mb-2 text-xs font-extrabold uppercase tracking-[.18em]">Holywin 2026 / Admin</p>
      <h1 className="font-['Archivo_Black'] text-4xl uppercase tracking-tight sm:text-6xl">Dashboard.</h1>
      <p className="mt-3 text-zinc-600">Registrations at a glance.</p>
      {status === 'loading' && <p role="status" className="mt-10">Loading dashboard…</p>}
      {status === 'error' && <p role="alert" className="mt-10 border-2 border-red-700 bg-red-50 p-4 font-semibold text-red-800">{error}</p>}
      {status === 'ready' && <>
        <section aria-label="Registration summary" className="mt-10 w-full max-w-xs border-2 border-zinc-950 bg-white p-6 shadow-[6px_6px_0_#111]">
          <p className="text-xs font-extrabold uppercase tracking-widest">Total registrations</p>
          <p className="mt-3 font-['Archivo_Black'] text-5xl">{registrations.length}</p>
        </section>
        <section className="mt-12" aria-labelledby="registrations-title">
          <h2 id="registrations-title" className="mb-5 font-['Archivo_Black'] text-2xl uppercase">Registrations</h2>
          {registrations.length === 0 ? <p className="border-2 border-zinc-950 bg-white p-6">No registrations yet.</p> : <div className="overflow-x-auto border-2 border-zinc-950 bg-white">
            <table className="w-full min-w-[680px] border-collapse text-left text-sm">
              <thead className="bg-zinc-950 text-white"><tr><th scope="col" className="p-4">Name</th><th scope="col" className="p-4">Email</th><th scope="col" className="p-4">Invited by</th><th scope="col" className="p-4">Registered</th></tr></thead>
              <tbody>{registrations.map(row => <tr key={row.id} className="border-t border-zinc-300"><td className="p-4 font-bold">{row.full_name}</td><td className="p-4"><a className="underline underline-offset-2" href={`mailto:${row.email}`}>{row.email}</a></td><td className="p-4">{row.invited_by || '—'}</td><td className="whitespace-nowrap p-4">{new Date(row.created_at).toLocaleString()}</td></tr>)}</tbody>
            </table>
          </div>}
        </section>
      </>}
    </div>
  </main>
}
