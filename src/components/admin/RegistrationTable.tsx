import type { AdminRegistration } from '../../lib/adminAuth'
import { eventTimeZone } from '../../lib/adminDates'
import { Check, Pencil, Trash2, UserRound } from 'lucide-react'

type Props = {
  registrations: AdminRegistration[]
  caption: string
  onAttendanceChange: (row: AdminRegistration) => void
  pendingAttendanceIds: Set<string>
  attendanceErrors: Record<string, string>
  onEdit: (row: AdminRegistration) => void
  onDelete: (row: AdminRegistration) => void
}

export default function RegistrationTable({ registrations, caption, onAttendanceChange, pendingAttendanceIds, attendanceErrors, onEdit, onDelete }: Props) {
  return <div className="overflow-x-auto rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_4px_18px_rgba(24,24,27,.035)]">
    <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
      <caption className="sr-only">{caption}</caption>
      <thead className="border-b border-[#e4e4e7] text-[11px] font-semibold uppercase tracking-[.08em] text-zinc-400">
        <tr><th scope="col" className="px-5 py-4">Name</th><th scope="col" className="px-5 py-4">Email</th><th scope="col" className="px-5 py-4">Invited by</th><th scope="col" className="px-5 py-4">Best in Costume</th><th scope="col" className="px-5 py-4">Character portrayed</th><th scope="col" className="px-5 py-4">Registered</th><th scope="col" className="px-5 py-4">Attendance</th><th scope="col" className="px-5 py-4">Action</th></tr>
      </thead>
      <tbody className="divide-y divide-[#f4f4f5]">
        {registrations.map(row => <tr key={row.id} className="hover:bg-zinc-100/60">
          <td className="px-5 py-3.5"><span className="flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#f4f4f5] text-zinc-950"><UserRound size={15} aria-hidden="true" /></span><span className="font-semibold text-zinc-800">{row.full_name}</span></span></td>
          <td className="px-5 py-3.5"><a className="text-zinc-600 hover:text-zinc-950 hover:underline" href={`mailto:${row.email}`}>{row.email}</a></td>
          <td className="px-5 py-3.5 text-zinc-500">{row.invited_by || '—'}</td>
          <td className="px-5 py-3.5 text-zinc-600">{row.best_in_costume ? <span className="inline-flex rounded-full border border-zinc-950 bg-zinc-950 px-2.5 py-1 text-xs font-semibold text-white">Entered</span> : '—'}</td>
          <td className="max-w-48 break-words px-5 py-3.5 text-zinc-600">{row.costume_character || '—'}</td>
          <td className="whitespace-nowrap px-5 py-3.5 text-zinc-500"><time dateTime={row.created_at}>{new Date(row.created_at).toLocaleString('en-US', { timeZone: eventTimeZone, dateStyle: 'medium', timeStyle: 'short' })}</time></td>
          <td className="px-5 py-3.5">
            <button
              type="button"
              aria-label={`${row.is_attended ? 'Undo attendance for' : 'Mark attended:'} ${row.full_name}`}
              aria-pressed={row.is_attended}
              disabled={pendingAttendanceIds.has(row.id)}
              onClick={() => onAttendanceChange(row)}
              className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-wait disabled:opacity-60 ${row.is_attended ? 'border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800' : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100'}`}
            >
              {row.is_attended && <Check size={14} aria-hidden="true" />}
              {pendingAttendanceIds.has(row.id) ? 'Saving…' : row.is_attended ? 'Attended' : 'Mark attended'}
            </button>
            {attendanceErrors[row.id] && <p role="alert" className="mt-1 max-w-44 text-xs text-zinc-700">{attendanceErrors[row.id]}</p>}
          </td>
          <td className="px-5 py-3.5"><div className="flex items-center gap-1.5">
            <button type="button" onClick={() => onEdit(row)} aria-label={`Edit registration for ${row.full_name}`} title={`Edit registration for ${row.full_name}`} className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-300 text-zinc-800 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"><Pencil size={16} aria-hidden="true" /></button>
            <button type="button" onClick={() => onDelete(row)} aria-label={`Delete registration for ${row.full_name}`} title={`Delete registration for ${row.full_name}`} className="inline-flex size-10 items-center justify-center rounded-lg border border-zinc-300 text-zinc-800 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950"><Trash2 size={16} aria-hidden="true" /></button>
          </div></td>
        </tr>)}
      </tbody>
    </table>
  </div>
}
