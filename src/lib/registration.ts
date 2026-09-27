type RegistrationDetails = {
  full_name: string
  email: string
  invited_by: string | null
}

export async function saveRegistration(details: RegistrationDetails): Promise<void> {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error('Supabase registration is not configured')
  }

  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/registrations`, {
    method: 'POST',
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(details),
  })

  if (!response.ok) {
    throw new Error(`Registration failed (${response.status})`)
  }
}
