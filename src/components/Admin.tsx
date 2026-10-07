import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import { isAdmin, signInAdmin } from '../lib/adminAuth'

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

  return <main className="flex min-h-dvh items-center justify-center bg-zinc-100 px-5 py-12 text-zinc-950">
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
            <input id="admin-username" name="username" autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required className="h-12 w-full border-2 border-zinc-900 bg-zinc-50 px-4 text-base outline-none focus-visible:ring-4 focus-visible:ring-zinc-400" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-bold">Password</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required className="h-12 w-full border-2 border-zinc-900 bg-zinc-50 px-4 text-base outline-none focus-visible:ring-4 focus-visible:ring-zinc-400" />
          </div>
          {error && <p role="alert" className="border-2 border-zinc-500 bg-zinc-100 p-3 text-sm font-semibold text-zinc-950">{error}</p>}
          <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-3 border-2 border-zinc-950 bg-zinc-950 px-5 font-extrabold uppercase tracking-wide text-white shadow-[4px_4px_0_#888] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0_#888] disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'} <ArrowRight size={19} aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  </main>
}

export { AdminDashboard, AdminRegistrations } from './AdminPages'
