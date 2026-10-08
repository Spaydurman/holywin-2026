import type { AdminRegistration } from '../../lib/adminAuth'
import AdminCard from '../ui/AdminCard'

export default function TopInviters({ registrations }: { registrations: AdminRegistration[] }) {
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

  return <AdminCard aria-labelledby="inviters-title">
    <h2 id="inviters-title" className="text-sm font-bold text-zinc-950">Top inviters</h2>
    <p className="mt-1 text-xs text-zinc-400">Who brought people to Holywin</p>
    {top.length ? <div className="mt-6 space-y-5">{top.map(({ name, count }) => <div key={name}><div className="mb-2 flex items-center justify-between gap-3 text-xs"><span className="truncate font-medium text-zinc-700" title={name}>{name}</span><span className="font-semibold tabular-nums text-zinc-900">{count}</span></div><div className="h-1.5 rounded-full bg-[#e4e4e7]"><div className="h-full rounded-full bg-zinc-800" style={{ width: `${count / highest * 100}%` }} /></div></div>)}</div> : <p className="mt-6 text-sm text-zinc-500">No inviter details yet.</p>}
  </AdminCard>
}

