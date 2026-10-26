import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { AdminRegistration, RegistrationChanges } from '../../lib/adminAuth'

type Props = {
  mode: 'add' | 'edit' | 'delete'
  registration?: AdminRegistration
  onClose: () => void
  onAdd: (changes: RegistrationChanges) => Promise<void>
  onSave: (id: string, changes: RegistrationChanges) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const inputClass = 'mt-1.5 min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-200'

export default function RegistrationDialog({ mode, registration, onClose, onAdd, onSave, onDelete }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(registration?.full_name ?? '')
  const [email, setEmail] = useState(registration?.email ?? '')
  const [invitedBy, setInvitedBy] = useState(registration?.invited_by ?? '')
  const [bestInCostume, setBestInCostume] = useState(registration?.best_in_costume ?? false)
  const [costumeCharacter, setCostumeCharacter] = useState(registration?.costume_character ?? '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    if (mode !== 'delete') nameRef.current?.focus()
  }, [mode])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setError('')
    setPending(true)
    try {
      if (mode === 'delete') {
        if (!registration) throw new Error('Registration details are missing.')
        await onDelete(registration.id)
      } else {
        const changes = {
          full_name: name.trim(),
          email: email.trim().toLowerCase(),
          invited_by: invitedBy.trim() || null,
          best_in_costume: bestInCostume,
          costume_character: bestInCostume ? costumeCharacter.trim() : null,
        }
        if (mode === 'add') await onAdd(changes)
        else {
          if (!registration) throw new Error('Registration details are missing.')
          await onSave(registration.id, changes)
        }
      }
      dialogRef.current?.close()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : `Could not ${mode} registration. Please try again.`)
    } finally {
      setPending(false)
    }
  }

  return <dialog ref={dialogRef} onClose={onClose} onCancel={event => { if (pending) event.preventDefault() }} aria-labelledby="registration-dialog-title" aria-describedby="registration-dialog-description" className="m-auto w-[calc(100%-2rem)] max-w-[30rem] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-0 text-zinc-950 shadow-xl backdrop:bg-zinc-950/45">
    <form onSubmit={submit} className="p-6 sm:p-7">
      <h2 id="registration-dialog-title" className="text-lg font-bold tracking-tight">{mode === 'add' ? 'Add registration' : mode === 'edit' ? 'Edit registration' : 'Delete registration?'}</h2>
      <p id="registration-dialog-description" className="mt-1.5 text-sm leading-5 text-zinc-600">
        {mode === 'add' ? 'Enter the details for a new Holywin attendee.' : mode === 'edit' ? `Update the details for ${registration?.full_name}.` : <>This will permanently remove <strong className="font-semibold text-zinc-950">{registration?.full_name}</strong> and their registration details.</>}
      </p>
      {mode !== 'delete' && <div className="mt-5 space-y-4">
        <label className="block text-xs font-semibold text-zinc-700">Name
          <input ref={nameRef} className={inputClass} value={name} onChange={event => setName(event.target.value)} maxLength={120} required />
        </label>
        <label className="block text-xs font-semibold text-zinc-700">Email
          <input className={inputClass} type="email" value={email} onChange={event => setEmail(event.target.value)} maxLength={254} required />
        </label>
        <label className="block text-xs font-semibold text-zinc-700">Invited by <span className="font-normal text-zinc-500">(optional)</span>
          <input className={inputClass} value={invitedBy} onChange={event => setInvitedBy(event.target.value)} maxLength={120} />
        </label>
        <label className="flex min-h-10 items-center gap-2.5 text-sm font-medium text-zinc-800">
          <input type="checkbox" checked={bestInCostume} onChange={event => setBestInCostume(event.target.checked)} className="h-4 w-4 accent-zinc-950" />Best in Costume
        </label>
        {bestInCostume && <label className="block text-xs font-semibold text-zinc-700">Character portrayed
          <input className={inputClass} value={costumeCharacter} onChange={event => setCostumeCharacter(event.target.value)} maxLength={120} required />
        </label>}
      </div>}
      {error && <p role="alert" className="mt-4 rounded-lg border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-900">{error}</p>}
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button type="button" disabled={pending} onClick={() => dialogRef.current?.close()} className="min-h-11 rounded-lg border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:opacity-50">Cancel</button>
        <button type="submit" disabled={pending} className="min-h-11 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 disabled:cursor-wait disabled:opacity-60">{pending ? (mode === 'add' ? 'Adding…' : mode === 'edit' ? 'Saving…' : 'Deleting…') : (mode === 'add' ? 'Add registration' : mode === 'edit' ? 'Save changes' : 'Delete registration')}</button>
      </div>
    </form>
  </dialog>
}
