const ADMIN_EMAIL = 'admin@holywin.local'
const SESSION_KEY = 'holywin-admin-session'

type Session = {
  access_token: string
  refresh_token: string
  expires_at: number
  user: { id: string }
}

function config() {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('Supabase is not configured.')
  return { url, key }
}

function saveSession(data: { access_token: string; refresh_token: string; expires_in: number; user: { id: string } }) {
  const session: Session = { ...data, expires_at: Date.now() + data.expires_in * 1000 }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

function storedSession(): Session | null {
  try {
    const value = localStorage.getItem(SESSION_KEY)
    return value ? JSON.parse(value) as Session : null
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

async function validSession(): Promise<Session | null> {
  const session = storedSession()
  if (!session) return null
  if (session.expires_at > Date.now() + 60_000) return session

  const { url, key } = config()
  const response = await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  })
  if (!response.ok) {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
  return saveSession(await response.json())
}

export async function isAdmin(): Promise<boolean> {
  const session = await validSession()
  if (!session) return false
  const { url, key } = config()
  const headers = { apikey: key, Authorization: `Bearer ${session.access_token}` }
  const userResponse = await fetch(`${url}/auth/v1/user`, { headers })
  if (!userResponse.ok) {
    localStorage.removeItem(SESSION_KEY)
    return false
  }
  const user = await userResponse.json() as { id: string }
  const roleResponse = await fetch(`${url}/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(user.id)}`, { headers })
  if (!roleResponse.ok) throw new Error('Could not verify admin access.')
  const roles = await roleResponse.json() as { user_id: string }[]
  return roles.length > 0
}

export async function signInAdmin(username: string, password: string): Promise<void> {
  if (username.trim().toLowerCase() !== 'holywin') throw new Error('Invalid username or password.')
  const { url, key } = config()
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password }),
  })
  if (!response.ok) throw new Error('Invalid username or password.')
  saveSession(await response.json())
  try {
    if (!(await isAdmin())) {
      await signOutAdmin()
      throw new Error('This account does not have admin access.')
    }
  } catch (error) {
    localStorage.removeItem(SESSION_KEY)
    throw error
  }
}

export async function signOutAdmin(): Promise<void> {
  const session = storedSession()
  localStorage.removeItem(SESSION_KEY)
  if (!session) return
  const { url, key } = config()
  await fetch(`${url}/auth/v1/logout`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${session.access_token}` },
  }).catch(() => undefined)
}

export type AdminRegistration = { id: string; full_name: string; email: string; invited_by: string | null; created_at: string }

export async function getRegistrations(): Promise<AdminRegistration[]> {
  const session = await validSession()
  if (!session) throw new Error('Your session has expired. Please sign in again.')
  const { url, key } = config()
  const registrations: AdminRegistration[] = []
  const pageSize = 1000

  for (let start = 0; ; start += pageSize) {
    const response = await fetch(`${url}/rest/v1/registrations?select=id,full_name,email,invited_by,created_at&order=created_at.desc&offset=${start}&limit=${pageSize}`, {
      headers: { apikey: key, Authorization: `Bearer ${session.access_token}` },
    })
    if (!response.ok) throw new Error('Could not load registrations.')
    const page = await response.json() as AdminRegistration[]
    registrations.push(...page)
    if (page.length < pageSize) return registrations
  }
}
