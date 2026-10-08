import { motion } from 'motion/react'
import { CalendarDays, Heart, MapPin } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import DetailCard from '../components/ui/DetailCard'

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
