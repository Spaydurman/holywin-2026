import { useState } from 'react'
import type { AdminRegistration } from '../../lib/adminAuth'
import { addDays, dateKey, displayDay } from '../../lib/adminDates'

type Period = '7' | '30' | 'all'
type DayCount = { day: string; count: number }

function dailyCounts(registrations: AdminRegistration[]) {
  const counts = new Map<string, number>()
  for (const registration of registrations) {
    const day = dateKey(registration.created_at)
    counts.set(day, (counts.get(day) ?? 0) + 1)
  }
  return counts
}

function daysInRange(counts: Map<string, number>, start: string, end: string): DayCount[] {
  const days: DayCount[] = []
  for (let day = start; day <= end; day = addDays(day, 1)) days.push({ day, count: counts.get(day) ?? 0 })
  return days
}

function AccessibleDailyTable({ days, caption }: { days: DayCount[]; caption: string }) {
  return <div className="sr-only"><table><caption>{caption}</caption><thead><tr><th scope="col">Date</th><th scope="col">Registrations</th></tr></thead><tbody>{days.map(({ day, count }) => <tr key={day}><td>{day}</td><td>{count}</td></tr>)}</tbody></table></div>
}

export default function RegistrationGraph({ registrations }: { registrations: AdminRegistration[] }) {
  const [period, setPeriod] = useState<Period>('30')
  const counts = dailyCounts(registrations)
  const today = dateKey(new Date())
  const oldest = registrations.length ? dateKey(registrations[registrations.length - 1].created_at) : today
  const start = period === 'all' ? oldest : addDays(today, 1 - Number(period))
  const days = daysInRange(counts, start, today)
  const highest = days.reduce((max, item) => Math.max(max, item.count), 1)
  const total = days.reduce((sum, item) => sum + item.count, 0)

  const left = 35
  const right = 612
  const top = 18
  const bottom = 162
  const x = (index: number) => left + (days.length === 1 ? 0 : index / (days.length - 1) * (right - left))
  const y = (count: number) => bottom - count / highest * (bottom - top)
  const line = days.map((item, index) => `${index ? 'L' : 'M'} ${x(index).toFixed(1)} ${y(item.count).toFixed(1)}`).join(' ')
  const area = `${line} L ${x(days.length - 1).toFixed(1)} ${bottom} L ${left} ${bottom} Z`
  const tickIndexes = [...new Set([0, Math.floor((days.length - 1) / 4), Math.floor((days.length - 1) / 2), Math.floor((days.length - 1) * 3 / 4), days.length - 1])]

  return <section aria-labelledby="registration-graph-title" className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_4px_18px_rgba(24,24,27,.035)] sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h2 id="registration-graph-title" className="text-sm font-bold text-zinc-950">Registration trend</h2><p className="mt-1 text-xs text-zinc-400">Daily registrations · Taipei time</p></div>
      <select aria-label="Chart date range" value={period} onChange={event => setPeriod(event.target.value as Period)} className="min-h-9 rounded-lg border border-[#e4e4e7] bg-white px-3 text-xs font-medium text-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950">
        <option value="7">Last 7 days</option><option value="30">Last 30 days</option><option value="all">All time</option>
      </select>
    </div>
    <div className="mt-4 grid items-center gap-5 2xl:grid-cols-[130px_minmax(0,1fr)]">
      <div><p className="text-3xl font-extrabold tabular-nums tracking-tight text-zinc-950">{total.toLocaleString()}</p><p className="mt-1 text-xs text-zinc-500">registrations in range</p></div>
      <div className="min-w-0">
        <svg viewBox="0 0 640 205" className="h-[205px] w-full" aria-hidden="true" focusable="false">
          <defs><linearGradient id="registration-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#52525b" stopOpacity=".15" /><stop offset="100%" stopColor="#52525b" stopOpacity="0" /></linearGradient></defs>
          {[0, .5, 1].map(fraction => { const gridY = bottom - fraction * (bottom - top); return <g key={fraction}><line x1={left} x2={right} y1={gridY} y2={gridY} stroke="#e4e4e7" strokeDasharray="4 5" /><text x="27" y={gridY + 4} textAnchor="end" fill="#a1a1aa" fontSize="10">{Math.round(highest * fraction)}</text></g> })}
          <path d={area} fill="url(#registration-area)" />
          <path d={line} fill="none" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {days.length <= 7 && days.map((item, index) => <circle key={item.day} cx={x(index)} cy={y(item.count)} r="3.5" fill="#18181b"><title>{displayDay(item.day)}: {item.count} registrations</title></circle>)}
          {tickIndexes.map(index => <text key={days[index].day} x={x(index)} y="193" textAnchor={index === 0 ? 'start' : index === days.length - 1 ? 'end' : 'middle'} fill="#a1a1aa" fontSize="10">{displayDay(days[index].day)}</text>)}
        </svg>
      </div>
    </div>
    <AccessibleDailyTable days={days} caption={`Daily registrations, ${period === 'all' ? 'all time' : `last ${period} days`}, Asia/Taipei time`} />
  </section>
}

export function WeeklyActivityGraph({ registrations }: { registrations: AdminRegistration[] }) {
  const counts = dailyCounts(registrations)
  const today = dateKey(new Date())
  const days = daysInRange(counts, addDays(today, -6), today)
  const highest = days.reduce((max, item) => Math.max(max, item.count), 1)
  const mostActive = days.reduce((best, item) => item.count >= best.count ? item : best, days[0])

  return <section aria-labelledby="activity-title" className="rounded-2xl border border-[#e4e4e7] bg-white p-5 shadow-[0_4px_18px_rgba(24,24,27,.035)] sm:p-6">
    <div><h2 id="activity-title" className="text-sm font-bold text-zinc-950">Daily activity</h2><p className="mt-1 text-xs text-zinc-400">Registrations in the last 7 days</p></div>
    <div className="mt-7 flex h-36 items-end justify-between gap-2" aria-hidden="true">
      {days.map(({ day, count }) => <div key={day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"><span className="text-[10px] font-semibold tabular-nums text-zinc-500">{count || ''}</span><div className={`w-full max-w-9 rounded-t-md ${day === mostActive.day && count ? 'bg-zinc-950' : 'bg-[#f4f4f5]'}`} style={{ height: `${Math.max(8, count / highest * 104)}px` }} /><span className="text-[10px] text-zinc-500">{new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${day}T00:00:00Z`))}</span></div>)}
    </div>
    <AccessibleDailyTable days={days} caption="Daily registrations for the last 7 days, Asia/Taipei time" />
  </section>
}
