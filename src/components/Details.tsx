import { motion } from 'motion/react'
import { ArrowRight, CalendarDays, Heart, MapPin } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

const eventDetails = [
  {
    number: '01',
    icon: CalendarDays,
    label: 'WHEN IS IT?',
    title: ['COMING', 'SOON.'],
    description: 'Keep your eyes here. The date and time will be announced soon.',
    footer: 'SAVE THE EXCITEMENT',
    variant: 'plain',
  },
  {
    number: '02',
    icon: MapPin,
    label: 'WHERE IS IT?',
    title: ['STAY', 'TUNED.'],
    description: 'We’re getting the space ready. The venue will be shared here soon.',
    footer: 'A PLACE TO BELONG',
    variant: 'dark',
  },
  {
    number: '03',
    icon: Heart,
    label: "WHO'S INVITED?",
    title: ['YOU,', 'OF COURSE.'],
    description: 'Come as you are. Bring a friend, your questions, and an open heart.',
    footer: 'EVERYONE IS WELCOME',
    variant: 'pattern',
  },
] as const

type EventDetail = (typeof eventDetails)[number]

function DetailCard({ detail }: { detail: EventDetail }) {
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
          {detail.title[0]}<br />{detail.title[1]}
        </h3>
        <p className="m-0 max-w-[270px] text-[15px] leading-normal">{detail.description}</p>
      </div>

      <div className="flex items-center justify-between border-t-2 border-current pt-[18px] text-[11px] font-extrabold tracking-[.1em]">
        <span>{detail.footer}</span>
        <ArrowRight size={18} aria-hidden="true" />
      </div>
    </motion.article>
  )
}

export default function Details() {
  const reveal = useReveal()

  return (
    <section
      className="section flex min-h-dvh scroll-mt-[30px] items-center bg-[#eae8df]"
      id="details"
      aria-labelledby="details-title"
    >
      <div className="container">
        <motion.div className="section-heading" {...reveal}>
          <div>
            <span className="kicker">01 / MARK YOUR CALENDAR</span>
            <h2 id="details-title">THE <span>LOWDOWN.</span></h2>
          </div>
          <p>Come together for a joyful evening centered on the promise of John 1:12. Event details are on the way!</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 min-[761px]:grid-cols-3 min-[761px]:gap-[22px]">
          {eventDetails.map((detail) => (
            <DetailCard key={detail.number} detail={detail} />
          ))}
        </div>
      </div>
    </section>
  )
}
