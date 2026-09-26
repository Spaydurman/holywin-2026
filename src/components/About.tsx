import { motion } from 'motion/react'
import { Cross, Sparkles, Sprout } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
export default function About() {
  const reveal = useReveal()
  return (
      <section className="about section flex min-h-dvh items-center" id="about" aria-labelledby="about-title"><div className="container about-grid">
        <motion.div className="about-photo" {...reveal}><img className="aspect-[3/2] w-full object-cover object-center grayscale contrast-[1.14]" src="/Holywin/H6.jpg" alt="Holywin group posing together at the Level Up event" loading="lazy"/><span className="photo-tag">GROWING GOOD TOGETHER</span><div className="about-photo-frame" /></motion.div>
        <motion.div className="about-copy" {...reveal}><span className="kicker">02 / THE HEART BEHIND IT</span><h2 id="about-title">MORE THAN<br /><span>A NIGHT.</span><br />A NEW START.</h2><div className="hand-underline" aria-hidden="true"/><p className="about-lead">John 1:12 is our starting point: everyone who receives Jesus and believes in his name is given the right to become a child of God.</p><p>Holywin makes space for young people to hear that promise, ask questions, build friendships, and celebrate the welcome Jesus offers.</p><div className="about-values"><div><span><Sparkles size={22}/></span><strong>Receive</strong><small>Hear Jesus’ invitation with an open heart.</small></div><div><span><Sprout size={22}/></span><strong>Believe</strong><small>Explore what it means to trust in his name.</small></div><div><span><Cross size={22}/></span><strong>Become</strong><small>Discover his promise of becoming God’s child.</small></div></div></motion.div>
      </div></section>
  )
}
