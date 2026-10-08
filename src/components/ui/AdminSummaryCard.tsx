import type { LucideIcon } from 'lucide-react'
import AdminCard from './AdminCard'

type AdminSummaryCardProps = { label: string; value: number; note: string; icon: LucideIcon }

export default function AdminSummaryCard({ label, value, note, icon: Icon }: AdminSummaryCardProps) {
  return <AdminCard aria-label={label} padding="compact">
    <div className="flex items-start justify-between gap-2"><p className="text-xs font-semibold text-zinc-700">{label}</p><Icon size={16} className="text-zinc-950" aria-hidden="true" /></div>
    <p className="mt-5 text-[27px] font-extrabold leading-none tabular-nums tracking-tight text-zinc-950">{value.toLocaleString()}</p>
    <p className="mt-2 text-[11px] text-zinc-400">{note}</p>
  </AdminCard>
}
