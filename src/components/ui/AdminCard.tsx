import type { ComponentPropsWithoutRef } from 'react'

type AdminCardProps = ComponentPropsWithoutRef<'section'> & { padding?: 'default' | 'compact' }

export default function AdminCard({ children, className = '', padding = 'default', ...props }: AdminCardProps) {
  return (
    <section
      {...props}
      className={`min-w-0 rounded-2xl border border-[#e4e4e7] bg-white shadow-[0_4px_18px_rgba(24,24,27,.035)] ${padding === 'compact' ? 'p-4 sm:p-5' : 'p-5 sm:p-6'} ${className}`}
    >
      {children}
    </section>
  )
}
