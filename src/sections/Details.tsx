import { motion } from 'motion/react'
import { CalendarDays, Heart, MapPin } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import DetailCard from '../components/ui/DetailCard'

const eventDetails = [
  {
    number: '01',
    icon: CalendarDays,
    label: 'WHEN IS IT?',
    title: ['OCT 31', '2026.'],
    description: 'Tap the date to add Holywin to your calendar. The event time will be shared soon.',
    footer: 'ADD TO CALENDAR',
    variant: 'plain',
    action: { href: '/holywin-2026.ics', label: 'Add Holywin on October 31, 2026 to your calendar' },
  },
  {
    number: '02',
    icon: MapPin,
    label: 'WHERE IS IT?',
    title: ['PASIG', 'CORPS.'],
    description: 'The Salvation Army Pasig Corps',
    address: '25 Sgt. Pascua St, Pasig, 1600 Metro Manila',
    footer: 'OPEN IN GOOGLE MAPS',
    variant: 'dark',
    action: { href: 'https://maps.app.goo.gl/XVdMim2h4eVMrw6E9', label: 'View the Holywin venue in Google Maps', external: true },
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
          <p>Join us on October 31 for a joyful gathering centered on the promise of John 1:12. Save the date and find your way to the venue.</p>
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
