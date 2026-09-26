import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight, ArrowRight, Sprout } from 'lucide-react'
import { Star } from './Brand'

const tickerMessage = 'YET TO ALL WHO DID RECEIVE HIM, TO THOSE WHO BELIEVED IN HIS NAME, HE GAVE THE RIGHT TO BECOME CHILDREN OF GOD ✳ JOHN 1:12 ✳\u00a0\u00a0'

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
      <section className="hero flex min-h-dvh flex-col" aria-labelledby="hero-title">
        <div className="hero-grid container flex-1">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-star">✳</span> RECEIVE · BELIEVE · BECOME <span className="eyebrow-star">✳</span></div>
            <h1 id="hero-title" ref={titleRef} aria-label="Holywin" className="mt-[35px] mb-0 max-w-[760px] font-['Archivo_Black'] text-[clamp(90px,11.1vw,176px)] leading-[.79] tracking-[-.08em] max-[1100px]:text-[clamp(70px,10vw,120px)] max-[760px]:mt-[29px] max-[760px]:text-[clamp(69px,18vw,130px)] max-[440px]:text-[17.5vw]">
              <span className="block whitespace-nowrap">{'HOLY'.split('').map((letter, i) => <span className="hero-letter inline-block opacity-0 motion-reduce:opacity-100" key={i}>{letter}</span>)}</span>
              <span className="mt-[13px] block whitespace-nowrap text-[#f7f5ed] [-webkit-text-stroke:3px_#111] [text-shadow:5px_5px_0_#111] max-[760px]:[-webkit-text-stroke:2px_#111] max-[760px]:[text-shadow:3px_3px_0_#111]">{'WIN!'.split('').map((letter, i) => <span className="hero-letter inline-block opacity-0 motion-reduce:opacity-100" key={i}>{letter}</span>)}</span>
            </h1>
            <div className="hero-rule" />
            <blockquote className="max-w-[530px]">
              <p className="hero-lede">“Yet to all who did receive him, to those who believed in his name, he gave the right to become children of God.”</p>
              <cite className="mb-5 block text-xs font-extrabold not-italic uppercase tracking-[.14em]">John 1:12</cite>
            </blockquote>
            <p className="hero-sub">Holywin is a joyful place to hear the invitation in <span className="font-bold text-[#141414]">John 1:12</span>: receive Jesus, believe in his name, and discover what it means to become a child of God.</p>
            <div className="hero-actions"><a className="button button-dark" href="#register">Count me in <ArrowRight size={20} /></a><a className="text-link" href="#about">What is Holywin? <ArrowDownRight size={20} /></a></div>
            <div className="hero-side-note"><span className="tiny-cross">✦</span> FAITH · FUN · FRIENDSHIP</div>
          </div>
          <div className="hero-art-wrap">
            <motion.div className="hero-art" initial={reduceMotion ? false : { opacity: 0, scale: .94, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: .8, ease: 'easeOut' }}>
              <img className="aspect-[3/2] w-full object-cover object-center grayscale contrast-[1.08]" src="/Holywin/H6.jpg" alt="Holywin group posing together at the Level Up event" />
              <div className="hero-art-label">LET THE<br />GOOD GROW!</div>
            </motion.div>
            <motion.div className="round-sticker" animate={reduceMotion ? {} : { rotate: [0, 6, -4, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}><span>ROOTED<br />IN HOPE</span><Sprout size={28} strokeWidth={2.7} /></motion.div>
            <Star className="hero-star hero-star-one" /><Star className="hero-star hero-star-two" />
            <div className="doodle-arrow" aria-hidden="true">↗</div>
          </div>
        </div>
        <div className="ticker overflow-hidden border-y-2 border-[#111] bg-[#111] text-white" aria-hidden="true">
          <div className="ticker-track flex w-max animate-ticker whitespace-nowrap py-[15px] font-['Archivo_Black'] text-[17px] tracking-[.07em] motion-reduce:animate-none">
            {Array.from({ length: 6 }, (_, index) => <span className="shrink-0" key={index}>{tickerMessage}</span>)}
          </div>
        </div>
      </section>
  )
}
