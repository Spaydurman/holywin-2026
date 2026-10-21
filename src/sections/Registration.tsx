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
  const [bestInCostume, setBestInCostume] = useState(false)
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
        best_in_costume: bestInCostume,
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
    setBestInCostume(false)
    setError('')
  }

  return (
    <section className="register section flex min-h-dvh items-center" id="register" aria-labelledby="register-title">
      <div className="container register-grid">
        <motion.div className="register-copy" {...reveal}>
          <span className="kicker">05 / BE PART OF IT</span>
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
              <p>Your registration has been received. {bestInCostume ? "You're entered for Best in Costume, too!" : 'We look forward to seeing you!'}</p>
              <button className="button button-dark" type="button" onClick={resetForm}>Make Another Registration <ArrowRight size={19} /></button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <span className="form-kicker">HOLYWIN REGISTRATION</span>
              <h3>SAY HELLO<span>!</span></h3>
              <label className="mb-2 text-[13px] font-extrabold uppercase tracking-[.06em]" htmlFor="name">Your name</label>
              <input className="mb-[22px] h-[54px] w-full rounded-none border-2 border-black bg-[#f7f5ed] px-[15px] text-base text-black placeholder:text-neutral-600 focus:outline-3 focus:outline-offset-2 focus:outline-neutral-500" id="name" name="name" autoComplete="name" placeholder="First and last name" value={name} onChange={e => setName(e.target.value)} maxLength={120} required />
              <label className="mb-2 text-[13px] font-extrabold uppercase tracking-[.06em]" htmlFor="email">Email address</label>
              <input className="mb-[22px] h-[54px] w-full rounded-none border-2 border-black bg-[#f7f5ed] px-[15px] text-base text-black placeholder:text-neutral-600 focus:outline-3 focus:outline-offset-2 focus:outline-neutral-500" id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} maxLength={254} required />
              <label className="mb-2 text-[13px] font-extrabold uppercase tracking-[.06em]" htmlFor="invitedBy">Invited by <span className="font-normal normal-case tracking-normal text-neutral-600">(optional)</span></label>
              <input className="mb-[22px] h-[54px] w-full rounded-none border-2 border-black bg-[#f7f5ed] px-[15px] text-base text-black placeholder:text-neutral-600 focus:outline-3 focus:outline-offset-2 focus:outline-neutral-500" id="invitedBy" name="invitedBy" placeholder="A friend, a group, or a church" value={invitedBy} onChange={e => setInvitedBy(e.target.value)} maxLength={120} />
              <fieldset className="mb-5 border-2 border-black bg-[#f7f5ed] p-4 sm:p-5">
                <legend className="px-2 text-xs font-extrabold uppercase tracking-[.12em]">Best in Costume</legend>
                <label htmlFor="bestInCostume" className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold leading-5 text-black">
                  <input id="bestInCostume" name="bestInCostume" type="checkbox" checked={bestInCostume} onChange={e => setBestInCostume(e.target.checked)} className="h-5 w-5 shrink-0 cursor-pointer accent-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black" />
                  <span>Yes, enter me in Best in Costume</span>
                </label>
                <p className="mt-2 pl-8 text-sm leading-5 text-neutral-700">Optional — join the costume contest as part of your Holywin registration.</p>
              </fieldset>
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
