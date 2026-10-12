import { motion } from 'motion/react'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { useReveal } from '../../hooks/useReveal'

export type EventDetail = {
  number: string
  icon: LucideIcon
  label: string
  title: readonly [string, string]
  description: string
  address?: string
  footer: string
  variant: 'plain' | 'dark' | 'pattern'
  action?: { href: string; label: string; external?: boolean }
}

export default function DetailCard({ detail }: { detail: EventDetail }) {
  const reveal = useReveal()
  const Icon = detail.icon
  const isPattern = detail.variant === 'pattern'

  return (
    <motion.article
      className={`flex min-h-[335px] flex-col justify-between border-[3px] border-[#111] p-[27px_28px_20px] shadow-[7px_7px_0_#111] min-[761px]:min-h-[396px] ${
        detail.variant === 'dark'
          ? 'bg-[#111] text-white'
          : isPattern
            ? 'bg-[#f7f5ed] bg-[radial-gradient(#b9b9b5_1.3px,transparent_1.3px)] bg-[length:19px_19px]'
            : 'bg-[#f7f5ed]'
      }`}
      {...reveal}
    >
      <div className="flex items-center justify-between">
        <span className="grid size-[53px] place-items-center border-2 border-current bg-white text-[#111]" aria-hidden="true">
          <Icon size={27} strokeWidth={2.4} />
        </span>
        <span className="font-['Archivo_Black',sans-serif] text-[26px]" aria-hidden="true">
          {detail.number}
        </span>
      </div>

      <div className={isPattern ? 'w-fit bg-[#f7f5ed] py-2 pr-3' : undefined}>
        <span className="text-xs font-extrabold tracking-[.15em]">{detail.label}</span>
        <h3 className="my-[12px_14px] font-['Archivo_Black',sans-serif] text-[46px] leading-[.98] tracking-[-.055em] min-[761px]:text-[clamp(37px,3.5vw,53px)]">
          {detail.action ? (
            <a
              className="inline-block rounded-sm underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              href={detail.action.href}
              aria-label={detail.action.label}
              target={detail.action.external ? '_blank' : undefined}
              rel={detail.action.external ? 'noopener noreferrer' : undefined}
            >
              {detail.title[0]}<br />{detail.title[1]}
            </a>
          ) : <>{detail.title[0]}<br />{detail.title[1]}</>}
        </h3>
        {detail.address && detail.action ? (
          <a
            className="inline-block rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            href={detail.action.href}
            aria-label={`${detail.description}, ${detail.address}. Open in Google Maps`}
            target={detail.action.external ? '_blank' : undefined}
            rel={detail.action.external ? 'noopener noreferrer' : undefined}
          >
            <span className="block max-w-[270px] text-[15px] leading-normal">{detail.description}</span>
            <address className="mt-2 max-w-[270px] text-[15px] leading-normal not-italic">
              {detail.address}
            </address>
          </a>
        ) : (
          <p className="m-0 max-w-[270px] text-[15px] leading-normal">{detail.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between border-t-2 border-current pt-[18px] text-[11px] font-extrabold tracking-[.1em]">
        {detail.action ? (
          <a
            className="flex min-h-11 w-full items-center justify-between gap-3 rounded-sm transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
            href={detail.action.href}
            aria-label={detail.action.label}
            target={detail.action.external ? '_blank' : undefined}
            rel={detail.action.external ? 'noopener noreferrer' : undefined}
          >
            <span>{detail.footer}</span>
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        ) : <><span>{detail.footer}</span><ArrowRight size={18} aria-hidden="true" /></>}
      </div>
    </motion.article>
  )
}

