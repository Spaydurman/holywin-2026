import { motion } from 'motion/react'
import { Cross, Sparkles, Sprout } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
export default function About() {
  const reveal = useReveal()
  return (
      <section className="about section" id="about" aria-labelledby="about-title"><div className="container about-grid">
        <motion.div className="about-photo" {...reveal}><img src="/holywin-hero.png" alt="Illustrated young friends gathering around a newly planted seedling" loading="lazy"/><span className="photo-tag">GROWING GOOD TOGETHER</span><div className="about-photo-frame" /></motion.div>
        <motion.div className="about-copy" {...reveal}><span className="kicker">02 / THE HEART BEHIND IT</span><h2 id="about-title">MORE THAN<br /><span>A NIGHT.</span><br />A NEW START.</h2><div className="hand-underline" aria-hidden="true"/><p className="about-lead">Holywin takes the excitement of the season and fills it with something lasting: joy, community, and the love of Jesus.</p><p>We believe every young heart is good ground. Through games, creativity, friendship, and faith, we plant small seeds of hope that can grow for a lifetime.</p><div className="about-values"><div><span><Sparkles size={22}/></span><strong>Big joy</strong><small>Play, laugh, and make memories.</small></div><div><span><Sprout size={22}/></span><strong>Deep roots</strong><small>Discover faith in a welcoming space.</small></div><div><span><Cross size={22}/></span><strong>Real light</strong><small>Celebrate the hope we have in Jesus.</small></div></div></motion.div>
      </div></section>
  )
}
