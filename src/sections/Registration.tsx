import { useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Check, Sprout } from 'lucide-react'
import { useReveal } from '../hooks/useReveal'
import { saveRegistration } from '../lib/registration'

export default function Registration() {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [invitedBy, setInvitedBy] = useState('')
  const reveal = useReveal()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const fullName = name.trim()
    if (!fullName) {
      setError('Please enter your name.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await saveRegistration({
        full_name: fullName,
        email: email.trim().toLowerCase(),
        invited_by: invitedBy.trim() || null,
      })
      setSubmitted(true)
    } catch {
      setError('We could not save your registration. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
    setSubmitted(false)
    setName('')
    setEmail('')
    setInvitedBy('')
    setError('')
  }

  return (
    <section className="register section flex min-h-dvh items-center" id="register" aria-labelledby="register-title">
      <div className="container register-grid">
        <motion.div className="register-copy" {...reveal}>
          <span className="kicker">04 / BE PART OF IT</span>
          <h2 id="register-title">YOUR SPOT<br />STARTS <span>HERE.</span></h2>
          <p>Come for the friends and the fun. Stay to explore the promise of <span className="font-bold">John 1:12</span> and what it means to belong to God’s family through Jesus.</p>
          <div className="register-doodle"><Sprout size={86} strokeWidth={1.5} /><span>COME HEAR<br />THE GOOD NEWS!</span></div>
        </motion.div>
        <motion.div className="form-panel" {...reveal}>
          {submitted ? (
            <div className="success-state" role="status">
              <span className="success-icon"><Check size={40} strokeWidth={3} /></span>
              <span className="form-kicker">YOU'RE IN THE MIX</span>
              <h3>AWESOME,<br />{name.trim().split(' ')[0].toUpperCase()}!</h3>
              <p>Your registration has been received. We look forward to seeing you!</p>
              <button className="button button-dark" type="button" onClick={resetForm}>Make Another Registration <ArrowRight size={19} /></button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <span className="form-kicker">HOLYWIN REGISTRATION</span>
              <h3>SAY HELLO<span>!</span></h3>
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" autoComplete="name" placeholder="First and last name" value={name} onChange={e => setName(e.target.value)} maxLength={120} required />
              <label htmlFor="email">Email address</label>
              <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} maxLength={254} required />
              <label htmlFor="invitedBy">Invited by <span>(optional)</span></label>
              <input id="invitedBy" name="invitedBy" placeholder="A friend, a group, or a church" value={invitedBy} onChange={e => setInvitedBy(e.target.value)} maxLength={120} />
              {error && <p role="alert" className="mb-3 border-2 border-red-700 bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
              <button className="button button-dark form-submit disabled:cursor-wait disabled:opacity-60" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Join the fun'} <ArrowRight size={20} />
              </button>
              <p className="form-note">Submitting stores your details for Holywin registration.</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
