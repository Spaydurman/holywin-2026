import type { AdminRegistration } from '../../lib/adminAuth'
import { eventTimeZone } from '../../lib/adminDates'
import { UserRound } from 'lucide-react'

export default function RegistrationTable({ registrations, caption }: { registrations: AdminRegistration[]; caption: string }) {
  return <div className="overflow-x-auto rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_4px_18px_rgba(24,24,27,.035)]">
    <table className="w-full min-w-[680px] border-collapse text-left text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead className="border-b border-[#e4e4e7] text-[11px] font-semibold uppercase tracking-[.08em] text-zinc-400">
        <tr><th scope="col" className="px-5 py-4">Name</th><th scope="col" className="px-5 py-4">Email</th><th scope="col" className="px-5 py-4">Invited by</th><th scope="col" className="px-5 py-4">Registered</th></tr>
      </thead>
      <tbody className="divide-y divide-[#f4f4f5]">
        {registrations.map(row => <tr key={row.id} className="hover:bg-zinc-100/60">
          <td className="px-5 py-3.5"><span className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f4f4f5] text-zinc-950"><UserRound size={15} aria-hidden="true" /></span><span className="font-semibold text-zinc-800">{row.full_name}</span></span></td>
          <td className="px-5 py-3.5"><a className="text-zinc-600 hover:text-zinc-950 hover:underline" href={`mailto:${row.email}`}>{row.email}</a></td>
          <td className="px-5 py-3.5 text-zinc-500">{row.invited_by || '—'}</td>
          <td className="whitespace-nowrap px-5 py-3.5 text-zinc-500"><time dateTime={row.created_at}>{new Date(row.created_at).toLocaleString('en-US', { timeZone: eventTimeZone, dateStyle: 'medium', timeStyle: 'short' })}</time></td>
        </tr>)}
      </tbody>
    </table>
  </div>
}
