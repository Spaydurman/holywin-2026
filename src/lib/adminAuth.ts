const API = '/api/admin'

// Remove tokens saved by earlier versions as soon as the app loads.
try { localStorage.removeItem('holywin-admin-session') } catch { /* Storage may be unavailable. */ }

async function request<T>(action: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API}?action=${action}`, {
    ...options,
    credentials: 'same-origin',
    cache: 'no-store',
  })
  const result = await response.json().catch(() => ({})) as T & { error?: string }
  if (!response.ok) throw new Error(result.error ?? 'Admin request failed.')
  return result
}

export async function isAdmin(): Promise<boolean> {
  const result = await request<{ admin: boolean }>('session')
  return result.admin
}

export async function signInAdmin(username: string, password: string): Promise<void> {
  await request('login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
}

export async function signOutAdmin(): Promise<void> {
  await request('logout', { method: 'POST' })
}

export type AdminRegistration = { id: string; full_name: string; email: string; invited_by: string | null; created_at: string; is_attended: boolean }

export async function getRegistrations(): Promise<AdminRegistration[]> {
  const registrations: AdminRegistration[] = []
  const pageSize = 1000
  for (let offset = 0; ; offset += pageSize) {
    const result = await request<{ registrations: AdminRegistration[] }>(`registrations&offset=${offset}`)
    registrations.push(...result.registrations)
    if (result.registrations.length < pageSize) return registrations
  }
}

export async function setRegistrationAttendance(id: string, isAttended: boolean): Promise<boolean> {
  const session = await validSession()
  if (!session) throw new Error('Your session has expired. Please sign in again.')
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/registrations?id=eq.${encodeURIComponent(id)}&select=id,is_attended`, {
    method: 'PATCH',
    headers: {
      apikey: key,
      Authorization: `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({ is_attended: isAttended }),
  })
  if (!response.ok) throw new Error('Could not update attendance. Please try again.')
  const updated = await response.json() as Pick<AdminRegistration, 'id' | 'is_attended'>[]
  if (updated.length !== 1 || updated[0].id !== id) throw new Error('Could not update attendance. Please refresh and try again.')
  return updated[0].is_attended
}
