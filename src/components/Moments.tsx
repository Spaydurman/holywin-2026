import { motion } from 'motion/react'
import { useReveal } from '../hooks/useReveal'
export default function Moments() {
  const reveal = useReveal()
  return (
      <section className="moments section flex min-h-dvh items-center" id="moments" aria-labelledby="moments-title"><div className="container"><motion.div className="section-heading moments-heading" {...reveal}><div><span className="kicker">03 / PREVIOUS HOLYWIN</span><h2 id="moments-title">LOOK BACK.<br /><span>LEAP FORWARD.</span></h2></div><p>Friendship, creativity, and worship give us ways to share the good news of belonging to God's family through Jesus.</p></motion.div><div className="gallery-grid"><motion.div className="gallery-card gallery-one" {...reveal}><div className="gallery-image" role="img" aria-label="Young people enjoying arts and crafts together"/><span className="gallery-caption"><strong>CREATE TOGETHER</strong><span>01 / 03</span></span></motion.div><motion.div className="gallery-card gallery-two" {...reveal}><div className="gallery-image" role="img" aria-label="Young people planting seedlings outdoors"/><span className="gallery-caption"><strong>GROW TOGETHER</strong><span>02 / 03</span></span></motion.div><motion.div className="gallery-card gallery-three" {...reveal}><div className="gallery-image" role="img" aria-label="Youth gathered for a joyful worship event"/><span className="gallery-caption"><strong>SHINE TOGETHER</strong><span>03 / 03</span></span></motion.div></div><p className="gallery-note">Illustrative moments for this concept mockup.</p></div></section>
  )
}
