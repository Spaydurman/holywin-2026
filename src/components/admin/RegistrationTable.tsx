import { useRef, useState } from 'react'
import type { AdminRegistration } from '../../lib/adminAuth'
import { eventTimeZone } from '../../lib/adminDates'
import { Check, Pencil, Trash2 } from 'lucide-react'
import TablePagination from './TablePagination'

const PAGE_SIZES = [10, 25, 50]

type Props = {
  registrations: AdminRegistration[]
  caption: string
  onAttendanceChange: (row: AdminRegistration) => void
  pendingAttendanceIds: Set<string>
  attendanceErrors: Record<string, string>
  onEdit: (row: AdminRegistration) => void
  onDelete: (row: AdminRegistration) => void
  // Pass both to split the rows into pages with previous/next controls.
  page?: number
  onPageChange?: (page: number) => void
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase() || '?'
}

function Empty() {
  return <span className="text-zinc-500">—<span className="sr-only">None</span></span>
}

const iconButton = 'grid size-10 cursor-pointer place-items-center rounded-lg border border-zinc-300 text-zinc-800 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950'

export default function RegistrationTable({ registrations, caption, onAttendanceChange, pendingAttendanceIds, attendanceErrors, onEdit, onDelete, page, onPageChange }: Props) {
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const containerRef = useRef<HTMLDivElement>(null)
  const paginated = page !== undefined && onPageChange !== undefined
  const totalPages = Math.max(1, Math.ceil(registrations.length / pageSize))
  // Clamp so removing the last row of the final page falls back to the previous page.
  const currentPage = paginated ? Math.min(Math.max(page, 1), totalPages) : 1
  const rows = paginated ? registrations.slice((currentPage - 1) * pageSize, currentPage * pageSize) : registrations

  function goToPage(next: number) {
    onPageChange?.(next)
    const container = containerRef.current
    if (container && container.getBoundingClientRect().top < 0) container.scrollIntoView({ block: 'start' })
  }

  function changePageSize(next: number) {
    setPageSize(next)
    goToPage(1)
  }

  return <div ref={containerRef} className="scroll-mt-4 overflow-hidden rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_4px_18px_rgba(24,24,27,.035)]">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] border-collapse text-left text-sm">
        <caption className="sr-only">{caption}{paginated && `, page ${currentPage} of ${totalPages}`}</caption>
        <thead className="border-b border-[#e4e4e7] bg-zinc-50 text-[11px] font-semibold uppercase tracking-[.08em] text-zinc-500">
          <tr>
            <th scope="col" className="px-5 py-3">Registrant</th>
            <th scope="col" className="px-5 py-3">Invited by</th>
            <th scope="col" className="px-5 py-3">Best in Costume</th>
            <th scope="col" className="px-5 py-3">Registered</th>
            <th scope="col" className="px-5 py-3">Attendance</th>
            <th scope="col" className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f0f0f1]">
          {rows.map(row => {
            const created = new Date(row.created_at)
            const pending = pendingAttendanceIds.has(row.id)
            return <tr key={row.id} className="align-middle transition-colors hover:bg-zinc-50/80">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200">{initials(row.full_name)}</span>
                  <div className="min-w-0 max-w-64">
                    <p className="truncate font-semibold text-zinc-900" title={row.full_name}>{row.full_name}</p>
                    <a href={`mailto:${row.email}`} title={row.email} className="block truncate text-xs text-zinc-500 hover:text-zinc-950 hover:underline">{row.email}</a>
                  </div>
                </div>
              </td>
              <td className="max-w-44 break-words px-5 py-3 text-zinc-700">{row.invited_by || <Empty />}</td>
              <td className="px-5 py-3">
                {row.best_in_costume || row.costume_character
                  ? <div className="flex max-w-52 flex-col items-start gap-1">
                    {row.best_in_costume && <span className="inline-flex rounded-full bg-zinc-950 px-2 py-0.5 text-[11px] font-semibold text-white">Entered</span>}
                    {row.costume_character && <span className="break-words text-xs text-zinc-600">{row.costume_character}</span>}
                  </div>
                  : <Empty />}
              </td>
              <td className="whitespace-nowrap px-5 py-3">
                <time dateTime={row.created_at} className="flex flex-col">
                  <span className="text-zinc-800">{created.toLocaleDateString('en-US', { timeZone: eventTimeZone, dateStyle: 'medium' })}</span>
                  <span className="text-xs text-zinc-500">{created.toLocaleTimeString('en-US', { timeZone: eventTimeZone, timeStyle: 'short' })}</span>
                </time>
              </td>
              <td className="px-5 py-3">
                <button
                  type="button"
                  aria-label={`${row.is_attended ? 'Undo attendance for' : 'Mark attended:'} ${row.full_name}`}
                  aria-pressed={row.is_attended}
                  disabled={pending}
                  onClick={() => onAttendanceChange(row)}
                  className={`inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border px-3 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-wait disabled:opacity-60 ${row.is_attended ? 'border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800' : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-950'}`}
                >
                  {row.is_attended ? <Check size={14} aria-hidden="true" /> : <span aria-hidden="true" className="size-2 rounded-full border-[1.5px] border-current" />}
                  {pending ? 'Saving…' : row.is_attended ? 'Attended' : 'Mark attended'}
                </button>
                {attendanceErrors[row.id] && <p role="alert" className="mt-1 max-w-44 text-xs text-zinc-700">{attendanceErrors[row.id]}</p>}
              </td>
              <td className="px-5 py-3">
                <div className="flex items-center justify-end gap-1">
                  <button type="button" onClick={() => onEdit(row)} aria-label={`Edit registration for ${row.full_name}`} title={`Edit registration for ${row.full_name}`} className={iconButton}><Pencil size={16} aria-hidden="true" /></button>
                  <button type="button" onClick={() => onDelete(row)} aria-label={`Delete registration for ${row.full_name}`} title={`Delete registration for ${row.full_name}`} className={iconButton}><Trash2 size={16} aria-hidden="true" /></button>
                </div>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
    {paginated && <TablePagination label="Registrations pages" page={currentPage} pageSize={pageSize} pageSizeOptions={PAGE_SIZES} total={registrations.length} onPageChange={goToPage} onPageSizeChange={changePageSize} />}
  </div>
}
