import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Check, Sprout } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
export default function Registration() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [invitedBy, setInvitedBy] = useState('')
  const reveal = useReveal()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }
  return (
      <section className="register section flex min-h-dvh items-center" id="register" aria-labelledby="register-title"><div className="container register-grid"><motion.div className="register-copy" {...reveal}><span className="kicker">04 / BE PART OF IT</span><h2 id="register-title">YOUR SPOT<br />STARTS <span>HERE.</span></h2><p>Ready for a night full of faith, friends, and the kind of fun that sticks with you? Drop your details below.</p><div className="register-doodle"><Sprout size={86} strokeWidth={1.5}/><span>LET'S GROW<br />SOMETHING GOOD!</span></div></motion.div><motion.div className="form-panel" {...reveal}>{submitted ? <div className="success-state" role="status"><span className="success-icon"><Check size={40} strokeWidth={3}/></span><span className="form-kicker">YOU'RE IN THE MIX</span><h3>AWESOME,<br />{name.trim().split(' ')[0].toUpperCase()}!</h3><p>Your details are filled in for this mockup. No registration has been sent yet.</p><button className="button button-dark" type="button" onClick={() => setSubmitted(false)}>Edit details <ArrowRight size={19}/></button></div> : <form onSubmit={handleSubmit}><span className="form-kicker">HOLYWIN REGISTRATION</span><h3>SAY HELLO<span>!</span></h3><label htmlFor="name">Your name</label><input id="name" name="name" autoComplete="name" placeholder="First and last name" value={name} onChange={e => setName(e.target.value)} required/><label htmlFor="email">Email address</label><input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required/><label htmlFor="invitedBy">Invited by <span>(optional)</span></label><input id="invitedBy" name="invitedBy" placeholder="A friend, a group, or a church" value={invitedBy} onChange={e => setInvitedBy(e.target.value)}/><button className="button button-dark form-submit" type="submit">Join the fun <ArrowRight size={20}/></button><p className="form-note">Concept form only — information stays on this page and is not sent or saved.</p></form>}</motion.div></div></section>
  )
}
