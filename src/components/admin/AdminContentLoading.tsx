import type { AdminPage } from './AdminSidebar'

const card = 'rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm'
const line = 'rounded-full bg-zinc-200'

export default function AdminContentLoading({ page }: { page: AdminPage }) {
  return <div role="status" className="motion-safe:animate-pulse">
    <span className="sr-only">Loading {page === 'dashboard' ? 'dashboard' : 'registrations'} content…</span>
    <div aria-hidden="true" className="space-y-4">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3"><div className={`h-2.5 w-28 ${line}`} /><div className={`h-7 w-44 ${line}`} /></div>
        <div className={`h-9 w-36 ${line}`} />
      </div>
      {page === 'dashboard' ? <>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => <div key={index} className={card}>
            <div className={`h-3 w-28 ${line}`} /><div className={`mt-4 h-7 w-16 ${line}`} /><div className={`mt-3 h-2.5 w-32 ${line}`} />
          </div>)}
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)]">
          <div className="space-y-4"><div className={`${card} h-72`}><div className={`h-4 w-40 ${line}`} /><div className="mt-8 h-44 rounded-xl bg-zinc-100" /></div><div className={`${card} h-52`}><div className={`h-4 w-44 ${line}`} /><div className="mt-6 space-y-4">{Array.from({ length: 3 }, (_, index) => <div key={index} className={`h-3 w-full ${line}`} />)}</div></div></div>
          <div className="space-y-4"><div className={`${card} h-44`}><div className={`h-4 w-36 ${line}`} /><div className="mt-6 h-20 rounded-xl bg-zinc-100" /></div><div className={`${card} h-44`}><div className={`h-4 w-32 ${line}`} /><div className="mt-6 space-y-4">{Array.from({ length: 3 }, (_, index) => <div key={index} className={`h-3 w-full ${line}`} />)}</div></div></div>
        </div>
      </> : <div className={card}>
        <div className="mb-6 flex items-center justify-between gap-4"><div className={`h-3 w-32 ${line}`} /><div className={`h-9 w-48 ${line}`} /></div>
        <div className="space-y-5">{Array.from({ length: 6 }, (_, index) => <div key={index} className="flex gap-4 border-t border-zinc-100 pt-5"><div className={`h-3 w-1/3 ${line}`} /><div className={`h-3 w-1/3 ${line}`} /><div className={`h-3 w-1/4 ${line}`} /></div>)}</div>
      </div>}
    </div>
  </div>
}
