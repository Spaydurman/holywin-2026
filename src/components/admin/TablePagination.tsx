import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  label: string
  page: number
  pageSize: number
  pageSizeOptions: number[]
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

// Always shows the first and last page with up to five pages around the current one.
function pageItems(page: number, totalPages: number): (number | 'gap')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
  const start = Math.max(2, Math.min(page - 1, totalPages - 4))
  const end = Math.min(totalPages - 1, Math.max(page + 1, 5))
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index)
  return [1, ...(start > 2 ? ['gap' as const] : []), ...middle, ...(end < totalPages - 1 ? ['gap' as const] : []), totalPages]
}

const stepButton = 'inline-flex min-h-9 cursor-pointer items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white'

export default function TablePagination({ label, page, pageSize, pageSizeOptions, total, onPageChange, onPageSizeChange }: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const from = total ? (page - 1) * pageSize + 1 : 0
  const to = Math.min(page * pageSize, total)

  return <nav aria-label={label} className="flex flex-col gap-3 border-t border-[#e4e4e7] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
      <p aria-live="polite">Showing <span className="font-semibold text-zinc-900">{from}–{to}</span> of <span className="font-semibold text-zinc-900">{total}</span></p>
      <label className="flex items-center gap-2">
        Rows per page
        <select value={pageSize} onChange={event => onPageSizeChange(Number(event.target.value))} className="h-8 cursor-pointer rounded-lg border border-zinc-200 bg-white px-2 text-xs font-semibold text-zinc-800 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200">
          {pageSizeOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
    </div>
    <div className="flex items-center justify-between gap-1.5 sm:justify-end">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={stepButton}><ChevronLeft size={14} aria-hidden="true" />Previous</button>
      <ol className="hidden items-center gap-1 sm:flex">
        {pageItems(page, totalPages).map((item, index) => <li key={item === 'gap' ? `gap-${index}` : item}>
          {item === 'gap'
            ? <span aria-hidden="true" className="grid size-9 place-items-center text-xs text-zinc-400">…</span>
            : <button type="button" onClick={() => onPageChange(item)} aria-label={`Page ${item}`} aria-current={item === page ? 'page' : undefined} className={`grid size-9 cursor-pointer place-items-center rounded-lg text-xs font-semibold tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 ${item === page ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'}`}>{item}</button>}
        </li>)}
      </ol>
      <p className="text-xs font-medium text-zinc-600 tabular-nums sm:hidden">Page {page} of {totalPages}</p>
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={stepButton}>Next<ChevronRight size={14} aria-hidden="true" /></button>
    </div>
  </nav>
}
