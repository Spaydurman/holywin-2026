const ADMIN_EMAIL = 'admin@holywin.local'
const COOKIE_NAME = '__Host-holywin-admin'
const SESSION_SECONDS = 8 * 60 * 60
const PAGE_SIZE = 1000

function config() {
  const url = process.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) throw new Error('Supabase is not configured.')
  return { url, key }
}

function json(data, status = 200, cookie) {
  const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json; charset=utf-8' }
  if (cookie) headers['Set-Cookie'] = cookie
  return new Response(JSON.stringify(data), { status, headers })
}

function sessionCookie(session) {
  const value = Buffer.from(JSON.stringify(session)).toString('base64url')
  return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_SECONDS}`
}

function clearCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
}

function storedSession(request) {
  const raw = request.headers.get('cookie')?.split(';').map(part => part.trim())
    .find(part => part.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length + 1)
  if (!raw || raw.length > 8192) return null
  try {
    const session = JSON.parse(Buffer.from(raw, 'base64url').toString('utf8'))
    if (typeof session.access_token !== 'string' || typeof session.refresh_token !== 'string' ||
        typeof session.expires_at !== 'number') return null
    return session
  } catch {
    return null
  }
}

function makeSession(data) {
  if (typeof data.access_token !== 'string' || typeof data.refresh_token !== 'string' ||
      typeof data.expires_in !== 'number') throw new Error('Invalid authentication response.')
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }
}

async function supabase(path, options = {}) {
  const { url, key } = config()
  return fetch(`${url}${path}`, {
    ...options,
    headers: { apikey: key, ...options.headers },
    cache: 'no-store',
  })
}

async function verifyAdmin(session) {
  const headers = { Authorization: `Bearer ${session.access_token}` }
  const userResponse = await supabase('/auth/v1/user', { headers })
  if (userResponse.status === 401 || userResponse.status === 403) return false
  if (!userResponse.ok) throw new Error('Could not verify admin access.')
  const user = await userResponse.json()
  if (typeof user.id !== 'string') return false

  const roleResponse = await supabase(`/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(user.id)}`, { headers })
  if (roleResponse.status === 401 || roleResponse.status === 403) return false
  if (!roleResponse.ok) throw new Error('Could not verify admin access.')
  const roles = await roleResponse.json()
  return Array.isArray(roles) && roles.length > 0
}

async function authenticatedSession(request) {
  let session = storedSession(request)
  if (!session) return null
  if (session.expires_at <= Date.now() + 60_000) {
    const response = await supabase('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: session.refresh_token }),
    })
    if ([400, 401, 403].includes(response.status)) return null
    if (!response.ok) throw new Error('Could not refresh the admin session.')
    session = makeSession(await response.json())
  }
  return await verifyAdmin(session) ? session : null
}

function sameOrigin(request) {
  const origin = request.headers.get('origin')
  return origin === new URL(request.url).origin
}

function validId(id) {
  return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

function registrationChanges(details) {
  if (!details || !validId(details.id) || typeof details.full_name !== 'string' ||
      typeof details.email !== 'string' || typeof details.invited_by !== 'string' && details.invited_by !== null ||
      typeof details.best_in_costume !== 'boolean' || typeof details.costume_character !== 'string' && details.costume_character !== null) return null
  const full_name = details.full_name.trim()
  const email = details.email.trim().toLowerCase()
  const invited_by = details.invited_by?.trim() || null
  const costume_character = details.costume_character?.trim() || null
  if (!full_name || full_name.length > 120 || email.length < 3 || email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || invited_by && invited_by.length > 120 ||
      costume_character && costume_character.length > 120 || details.best_in_costume && !costume_character) return null
  return { full_name, email, invited_by, best_in_costume: details.best_in_costume,
    costume_character: details.best_in_costume ? costume_character : null }
}

export async function GET(request) {
  const url = new URL(request.url)
  const action = url.searchParams.get('action')
  if (action !== 'session' && action !== 'registrations') return json({ error: 'Not found.' }, 404)
  const offset = action === 'registrations' ? Number(url.searchParams.get('offset') ?? 0) : 0
  if (!Number.isSafeInteger(offset) || offset < 0) return json({ error: 'Invalid offset.' }, 400)

  try {
    const session = await authenticatedSession(request)
    if (!session) {
      return action === 'session'
        ? json({ admin: false }, 200, clearCookie())
        : json({ error: 'Your session has expired. Please sign in again.' }, 401, clearCookie())
    }
    const cookie = sessionCookie(session)
    if (action === 'session') return json({ admin: true }, 200, cookie)

    const response = await supabase(`/rest/v1/registrations?select=id,full_name,email,invited_by,best_in_costume,costume_character,created_at,is_attended&order=created_at.desc&offset=${offset}&limit=${PAGE_SIZE}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
    if (!response.ok) throw new Error('Could not load registrations.')
    return json({ registrations: await response.json() }, 200, cookie)
  } catch {
    return json({ error: 'Admin service is temporarily unavailable.' }, 502)
  }
}

export async function PATCH(request) {
  const action = new URL(request.url).searchParams.get('action')
  if (action !== 'attendance' && action !== 'registration') return json({ error: 'Not found.' }, 404)
  if (!sameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403)

  let details
  try {
    details = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }
  const changes = action === 'registration' ? registrationChanges(details) : null
  if (action === 'attendance' ? !details || !validId(details.id) || typeof details.isAttended !== 'boolean' : !changes)
    return json({ error: action === 'attendance' ? 'Invalid attendance details.' : 'Invalid registration details.' }, 400)

  try {
    const session = await authenticatedSession(request)
    if (!session) return json({ error: 'Your session has expired. Please sign in again.' }, 401, clearCookie())
    const response = await supabase(`/rest/v1/registrations?id=eq.${encodeURIComponent(details.id)}&select=${action === 'attendance' ? 'id,is_attended' : 'id,full_name,email,invited_by,best_in_costume,costume_character,created_at,is_attended'}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(action === 'attendance' ? { is_attended: details.isAttended } : changes),
    })
    if (!response.ok) throw new Error('Could not update registration.')
    const updated = await response.json()
    if (!Array.isArray(updated) || updated.length !== 1 || updated[0].id !== details.id) return json({ error: 'Registration was not found.' }, 404)
    if (action === 'attendance') {
      if (typeof updated[0].is_attended !== 'boolean') throw new Error('Invalid attendance response.')
      return json({ isAttended: updated[0].is_attended }, 200, sessionCookie(session))
    }
    return json({ registration: updated[0] }, 200, sessionCookie(session))
  } catch {
    return json({ error: `Could not update ${action === 'attendance' ? 'attendance' : 'registration'}. Please try again.` }, 502)
  }
}

export async function DELETE(request) {
  if (new URL(request.url).searchParams.get('action') !== 'registration') return json({ error: 'Not found.' }, 404)
  if (!sameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403)
  let details
  try { details = await request.json() } catch { return json({ error: 'Invalid request.' }, 400) }
  if (!details || !validId(details.id)) return json({ error: 'Invalid registration details.' }, 400)

  try {
    const session = await authenticatedSession(request)
    if (!session) return json({ error: 'Your session has expired. Please sign in again.' }, 401, clearCookie())
    const response = await supabase(`/rest/v1/registrations?id=eq.${encodeURIComponent(details.id)}&select=id`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}`, Prefer: 'return=representation' },
    })
    if (!response.ok) throw new Error('Could not delete registration.')
    const deleted = await response.json()
    if (!Array.isArray(deleted) || deleted.length !== 1 || deleted[0].id !== details.id)
      return json({ error: 'Registration was not found.' }, 404)
    return json({ ok: true }, 200, sessionCookie(session))
  } catch {
    return json({ error: 'Could not delete registration. Please try again.' }, 502)
  }
}

export async function POST(request) {
  const action = new URL(request.url).searchParams.get('action')
  if (action !== 'login' && action !== 'logout') return json({ error: 'Not found.' }, 404)
  if (!sameOrigin(request)) return json({ error: 'Invalid request origin.' }, 403)

  if (action === 'logout') {
    const session = storedSession(request)
    if (session) {
      try {
        const refreshed = await supabase('/auth/v1/token?grant_type=refresh_token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: session.refresh_token }),
        })
        const token = refreshed.ok ? makeSession(await refreshed.json()).access_token : session.access_token
        await supabase('/auth/v1/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch { /* Clear the browser cookie even if Supabase is unavailable. */ }
    }
    return json({ ok: true }, 200, clearCookie())
  }

  let credentials
  try {
    credentials = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }
  if (!credentials || typeof credentials.username !== 'string' || credentials.username.trim().toLowerCase() !== 'holywin' ||
      typeof credentials.password !== 'string' || !credentials.password) {
    return json({ error: 'Invalid username or password.' }, 401)
  }

  try {
    const response = await supabase('/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: credentials.password }),
    })
    if ([400, 401, 403].includes(response.status)) return json({ error: 'Invalid username or password.' }, 401)
    if (!response.ok) throw new Error('Could not sign in.')
    const session = makeSession(await response.json())
    if (!(await verifyAdmin(session))) return json({ error: 'This account does not have admin access.' }, 403)
    return json({ ok: true }, 200, sessionCookie(session))
  } catch {
    return json({ error: 'Admin service is temporarily unavailable.' }, 502)
  }
}
