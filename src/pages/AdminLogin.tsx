import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import AdminCard from '../components/ui/AdminCard'
import { isAdmin, signInAdmin } from '../lib/adminAuth'

const DASHBOARD_PATH = '/holywin/2026/admin/dashboard'

function navigate(path: string) {
  window.location.assign(path)
}

export default function AdminLogin() {
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

  return <main id="admin-login-main" className="flex min-h-dvh items-center justify-center bg-[#f6f6f7] px-5 py-12 text-zinc-900 sm:px-8">
    <div className="w-full max-w-[440px]">
      <p className="text-[11px] font-medium text-zinc-400">Holywin 2026 / Admin</p>
      <h1 className="mt-1 text-[28px] font-bold tracking-tight text-zinc-950">Welcome back</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-500">Sign in to view registrations and manage your event.</p>

      <AdminCard aria-label="Admin sign in" className="mt-6 p-6 sm:p-7">
        <div className="mb-6 flex items-center gap-3 border-b border-zinc-100 pb-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800"><ShieldCheck size={20} aria-hidden="true" /></span>
          <div><h2 className="text-sm font-semibold text-zinc-950">Admin sign in</h2><p className="mt-0.5 text-xs text-zinc-500">Enter your account details below</p></div>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label htmlFor="admin-username" className="mb-2 block text-xs font-semibold text-zinc-700">Username</label>
            <input id="admin-username" name="username" autoComplete="username" value={username} onChange={event => setUsername(event.target.value)} required className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-950 outline-none transition-colors focus-visible:border-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-200" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-xs font-semibold text-zinc-700">Password</label>
            <input id="admin-password" name="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-950 outline-none transition-colors focus-visible:border-zinc-700 focus-visible:ring-2 focus-visible:ring-zinc-200" />
          </div>
          {error && <p role="alert" className="rounded-lg border border-zinc-300 bg-zinc-100 px-3.5 py-3 text-sm text-zinc-900">{error}</p>}
          <button type="submit" disabled={busy} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-wait disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign in'} {!busy && <ArrowRight size={16} aria-hidden="true" />}
          </button>
        </form>
      </AdminCard>
      <a href="/" className="mt-5 inline-flex min-h-9 items-center gap-2 text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"><ArrowLeft size={15} aria-hidden="true" />Back to Holywin</a>
    </div>
  </main>
}
