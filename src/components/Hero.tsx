import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight, ArrowRight, Sprout } from 'lucide-react'
import { Star } from './Brand'
export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion || !titleRef.current) return
    const letters = titleRef.current.querySelectorAll('.hero-letter')
    const animation = animate(letters, { translateY: [70, 0], opacity: [0, 1], rotate: [4, 0], delay: (_el, i) => (i ?? 0) * 65, duration: 820, ease: 'out(4)' })
    return () => { animation.pause() }
  }, [reduceMotion])
  return (
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-star">✳</span> A DIFFERENT KIND OF CELEBRATION <span className="eyebrow-star">✳</span></div>
            <h1 id="hero-title" ref={titleRef} aria-label="Holywin"><span className="hero-word">{'HOLY'.split('').map((letter, i) => <span className="hero-letter" key={i}>{letter}</span>)}</span><span className="hero-word hero-word-outline">{'WIN!'.split('').map((letter, i) => <span className="hero-letter" key={i}>{letter}</span>)}</span></h1>
            <div className="hero-rule" />
            <p className="hero-lede">Good things grow when we plant <strong>hope</strong> in young hearts.</p>
            <p className="hero-sub">A joy-filled, faith-first celebration where the next generation can belong, have fun, and discover the light of Jesus.</p>
            <div className="hero-actions"><a className="button button-dark" href="#register">Count me in <ArrowRight size={20} /></a><a className="text-link" href="#about">What is Holywin? <ArrowDownRight size={20} /></a></div>
            <div className="hero-side-note"><span className="tiny-cross">✦</span> FAITH · FUN · FRIENDSHIP</div>
          </div>
          <div className="hero-art-wrap">
            <motion.div className="hero-art" initial={reduceMotion ? false : { opacity: 0, scale: .94, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .8, ease: 'easeOut' }}>
              <img src="/holywin-hero.png" alt="Illustration of young people planting a seedling together" />
              <div className="hero-art-label">LET THE<br />GOOD GROW!</div>
            </motion.div>
            <motion.div className="round-sticker" animate={reduceMotion ? {} : { rotate: [0, 6, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}><span>ROOTED<br />IN HOPE</span><Sprout size={28} strokeWidth={2.7} /></motion.div>
            <Star className="hero-star hero-star-one" /><Star className="hero-star hero-star-two" />
            <div className="doodle-arrow" aria-hidden="true">↗</div>
          </div>
        </div>
        <div className="ticker" aria-hidden="true"><div className="ticker-track">HOLYWIN ✳ LIGHT UP THE NIGHT ✳ PLANT HOPE ✳ GROW IN FAITH ✳ HOLYWIN ✳ LIGHT UP THE NIGHT ✳ PLANT HOPE ✳ GROW IN FAITH ✳ </div></div>
      </section>
  )
}
