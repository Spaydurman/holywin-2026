import { useEffect, useRef, useState, type FormEvent } from 'react'
import { animate } from 'animejs'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowDownRight, ArrowRight, CalendarDays, Check, Cross, Heart, MapPin, Menu, Sparkles, Sprout, X } from 'lucide-react'

const links = [
  { href: '#details', label: 'The details' },
  { href: '#about', label: 'About' },
  { href: '#moments', label: 'Past moments' },
]

function Logo() {
  return <a className="logo" href="#top" aria-label="Holywin home"><span className="logo-mark"><span>H</span><span>W</span></span><span className="logo-name">HOLYWIN<span className="logo-dot">.</span></span></a>
}

function Star({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 72 72" fill="none" aria-hidden="true"><path d="M36 1.5 43 27l26.5 9L43 45 36 70.5 29 45 2.5 36 29 27 36 1.5Z" fill="currentColor" stroke="currentColor" strokeWidth="2"/></svg>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [invitedBy, setInvitedBy] = useState('')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion || !titleRef.current) return
    const letters = titleRef.current.querySelectorAll('.hero-letter')
    const animation = animate(letters, { translateY: [70, 0], opacity: [0, 1], rotate: [4, 0], delay: (_el, i) => (i ?? 0) * 65, duration: 820, ease: 'out(4)' })
    return () => { animation.pause() }
  }, [reduceMotion])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  const reveal = reduceMotion ? {} : { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.15 }, transition: { duration: 0.55, ease: 'easeOut' as const } }

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" />
    <header className="site-header">
      <div className="header-inner container">
        <Logo />
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Main navigation">
          {links.map(link => <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>)}
          <a className="nav-register" href="#register" onClick={() => setMenuOpen(false)}>Join the fun <ArrowRight size={17} strokeWidth={2.5} /></a>
        </nav>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>

    <main id="main">
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

      <section className="details section" id="details" aria-labelledby="details-title">
        <div className="container">
          <motion.div className="section-heading details-heading" {...reveal}><div><span className="kicker">01 / MARK YOUR CALENDAR</span><h2 id="details-title">THE <span>LOWDOWN.</span></h2></div><p>Everything you need to know before the fun begins. More details are on the way!</p></motion.div>
          <div className="details-grid">
            <motion.article className="detail-card" {...reveal}><div className="detail-card-top"><span className="detail-icon"><CalendarDays size={27} strokeWidth={2.4}/></span><span className="detail-number">01</span></div><div><span className="card-label">WHEN IS IT?</span><h3>COMING<br />SOON.</h3><p>Keep your eyes here. The date and time will be announced soon.</p></div><div className="card-bottom">SAVE THE EXCITEMENT <ArrowRight size={18}/></div></motion.article>
            <motion.article className="detail-card detail-card-dark" {...reveal}><div className="detail-card-top"><span className="detail-icon"><MapPin size={27} strokeWidth={2.4}/></span><span className="detail-number">02</span></div><div><span className="card-label">WHERE IS IT?</span><h3>STAY<br />TUNED.</h3><p>We’re getting the space ready. The venue will be shared here soon.</p></div><div className="card-bottom">A PLACE TO BELONG <ArrowRight size={18}/></div></motion.article>
            <motion.article className="detail-card detail-card-pattern" {...reveal}><div className="detail-card-top"><span className="detail-icon"><Heart size={27} strokeWidth={2.4}/></span><span className="detail-number">03</span></div><div><span className="card-label">WHO'S INVITED?</span><h3>YOU,<br />OF COURSE.</h3><p>Bring a friend, bring your curiosity, and come as you are.</p></div><div className="card-bottom">EVERYONE IS WELCOME <ArrowRight size={18}/></div></motion.article>
          </div>
        </div>
      </section>

      <section className="about section" id="about" aria-labelledby="about-title"><div className="container about-grid">
        <motion.div className="about-photo" {...reveal}><img src="/holywin-hero.png" alt="Illustrated young friends gathering around a newly planted seedling" loading="lazy"/><span className="photo-tag">GROWING GOOD TOGETHER</span><div className="about-photo-frame" /></motion.div>
        <motion.div className="about-copy" {...reveal}><span className="kicker">02 / THE HEART BEHIND IT</span><h2 id="about-title">MORE THAN<br /><span>A NIGHT.</span><br />A NEW START.</h2><div className="hand-underline" aria-hidden="true"/><p className="about-lead">Holywin takes the excitement of the season and fills it with something lasting: joy, community, and the love of Jesus.</p><p>We believe every young heart is good ground. Through games, creativity, friendship, and faith, we plant small seeds of hope that can grow for a lifetime.</p><div className="about-values"><div><span><Sparkles size={22}/></span><strong>Big joy</strong><small>Play, laugh, and make memories.</small></div><div><span><Sprout size={22}/></span><strong>Deep roots</strong><small>Discover faith in a welcoming space.</small></div><div><span><Cross size={22}/></span><strong>Real light</strong><small>Celebrate the hope we have in Jesus.</small></div></div></motion.div>
      </div></section>

      <section className="moments section" id="moments" aria-labelledby="moments-title"><div className="container"><motion.div className="section-heading moments-heading" {...reveal}><div><span className="kicker">03 / PREVIOUS HOLYWIN</span><h2 id="moments-title">LOOK BACK.<br /><span>LEAP FORWARD.</span></h2></div><p>A little taste of the connection, creativity, and joy at the heart of Holywin.</p></motion.div><div className="gallery-grid"><motion.div className="gallery-card gallery-one" {...reveal}><div className="gallery-image" role="img" aria-label="Young people enjoying arts and crafts together"/><span className="gallery-caption"><strong>CREATE TOGETHER</strong><span>01 / 03</span></span></motion.div><motion.div className="gallery-card gallery-two" {...reveal}><div className="gallery-image" role="img" aria-label="Young people planting seedlings outdoors"/><span className="gallery-caption"><strong>GROW TOGETHER</strong><span>02 / 03</span></span></motion.div><motion.div className="gallery-card gallery-three" {...reveal}><div className="gallery-image" role="img" aria-label="Youth gathered for a joyful worship event"/><span className="gallery-caption"><strong>SHINE TOGETHER</strong><span>03 / 03</span></span></motion.div></div><p className="gallery-note">Illustrative moments for this concept mockup.</p></div></section>

      <section className="register section" id="register" aria-labelledby="register-title"><div className="container register-grid"><motion.div className="register-copy" {...reveal}><span className="kicker">04 / BE PART OF IT</span><h2 id="register-title">YOUR SPOT<br />STARTS <span>HERE.</span></h2><p>Ready for a night full of faith, friends, and the kind of fun that sticks with you? Drop your details below.</p><div className="register-doodle"><Sprout size={86} strokeWidth={1.5}/><span>LET'S GROW<br />SOMETHING GOOD!</span></div></motion.div><motion.div className="form-panel" {...reveal}>{submitted ? <div className="success-state" role="status"><span className="success-icon"><Check size={40} strokeWidth={3}/></span><span className="form-kicker">YOU'RE IN THE MIX</span><h3>AWESOME,<br />{name.trim().split(' ')[0].toUpperCase()}!</h3><p>Your details are filled in for this mockup. No registration has been sent yet.</p><button className="button button-dark" type="button" onClick={() => setSubmitted(false)}>Edit details <ArrowRight size={19}/></button></div> : <form onSubmit={handleSubmit}><span className="form-kicker">HOLYWIN REGISTRATION</span><h3>SAY HELLO<span>!</span></h3><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="First and last name" value={name} onChange={e => setName(e.target.value)} required/><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required/><label htmlFor="invitedBy">Invited by <span>(optional)</span></label><input id="invitedBy" name="invitedBy" placeholder="A friend, a group, or a church" value={invitedBy} onChange={e => setInvitedBy(e.target.value)}/><button className="button button-dark form-submit" type="submit">Join the fun <ArrowRight size={20}/></button><p className="form-note">Concept form only — information stays on this page and is not sent or saved.</p></form>}</motion.div></div></section>
    </main>
    <footer className="footer"><div className="container footer-inner"><Logo/><p>Plant hope. Grow joy. Shine bright.</p><a href="#top">BACK TO TOP ↑</a></div><div className="footer-bottom container"><span>© {new Date().getFullYear()} HOLYWIN CONCEPT</span><span>MADE WITH FAITH & A LITTLE FUN ✳</span></div></footer>
  </>
}

export default App
