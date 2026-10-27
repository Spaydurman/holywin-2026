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

export type AdminRegistration = { id: string; full_name: string; email: string; invited_by: string | null; best_in_costume: boolean; costume_character: string | null; created_at: string; is_attended: boolean }
export type RegistrationChanges = Pick<AdminRegistration, 'full_name' | 'email' | 'invited_by' | 'best_in_costume' | 'costume_character'>

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
  const result = await request<{ isAttended: boolean }>('attendance', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, isAttended }),
  })
  return result.isAttended
}

export async function updateRegistration(id: string, changes: RegistrationChanges): Promise<AdminRegistration> {
  const result = await request<{ registration: AdminRegistration }>('registration', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, ...changes }),
  })
  return result.registration
}

export async function addRegistration(changes: RegistrationChanges): Promise<AdminRegistration> {
  const result = await request<{ registration: AdminRegistration }>('registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changes),
  })
  return result.registration
}

export async function deleteRegistration(id: string): Promise<void> {
  await request('registration', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}
