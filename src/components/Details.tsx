import { motion } from 'motion/react'
import { ArrowRight, CalendarDays, Heart, MapPin } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
export default function Details() {
  const reveal = useReveal()
  return (
      <section className="details section flex min-h-dvh items-center" id="details" aria-labelledby="details-title">
        <div className="container">
          <motion.div className="section-heading details-heading" {...reveal}><div><span className="kicker">01 / MARK YOUR CALENDAR</span><h2 id="details-title">THE <span>LOWDOWN.</span></h2></div><p>Everything you need to know before the fun begins. More details are on the way!</p></motion.div>
          <div className="details-grid">
            <motion.article className="detail-card" {...reveal}><div className="detail-card-top"><span className="detail-icon"><CalendarDays size={27} strokeWidth={2.4}/></span><span className="detail-number">01</span></div><div><span className="card-label">WHEN IS IT?</span><h3>COMING<br />SOON.</h3><p>Keep your eyes here. The date and time will be announced soon.</p></div><div className="card-bottom">SAVE THE EXCITEMENT <ArrowRight size={18}/></div></motion.article>
            <motion.article className="detail-card detail-card-dark" {...reveal}><div className="detail-card-top"><span className="detail-icon"><MapPin size={27} strokeWidth={2.4}/></span><span className="detail-number">02</span></div><div><span className="card-label">WHERE IS IT?</span><h3>STAY<br />TUNED.</h3><p>We’re getting the space ready. The venue will be shared here soon.</p></div><div className="card-bottom">A PLACE TO BELONG <ArrowRight size={18}/></div></motion.article>
            <motion.article className="detail-card detail-card-pattern" {...reveal}><div className="detail-card-top"><span className="detail-icon"><Heart size={27} strokeWidth={2.4}/></span><span className="detail-number">03</span></div><div><span className="card-label">WHO'S INVITED?</span><h3>YOU,<br />OF COURSE.</h3><p>Bring a friend, bring your curiosity, and come as you are.</p></div><div className="card-bottom">EVERYONE IS WELCOME <ArrowRight size={18}/></div></motion.article>
          </div>
        </div>
      </section>
  )
}
