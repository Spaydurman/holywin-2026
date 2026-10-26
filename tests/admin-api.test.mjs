import assert from 'node:assert/strict'
import { Readable } from 'node:stream'
import { after, before, test } from 'node:test'
import { createServer } from 'vite'
import { DELETE, GET, PATCH, POST } from '../api/admin.js'

const registrationId = '11111111-1111-4111-8111-111111111111'

const originalFetch = globalThis.fetch
const originalUrl = process.env.VITE_SUPABASE_URL
const originalKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY

before(() => {
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co'
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'publishable-test-key'
})

after(() => {
  globalThis.fetch = originalFetch
  if (originalUrl === undefined) delete process.env.VITE_SUPABASE_URL
  else process.env.VITE_SUPABASE_URL = originalUrl
  if (originalKey === undefined) delete process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  else process.env.VITE_SUPABASE_PUBLISHABLE_KEY = originalKey
})

function request(action, { method = 'GET', cookie, body, origin = 'https://holywin.example' } = {}) {
  const headers = {}
  if (cookie) headers.cookie = cookie
  if (method !== 'GET') headers.origin = origin
  if (body) headers['content-type'] = 'application/json'
  return new Request(`https://holywin.example/api/admin?action=${action}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  })
}

function authFetch({ admin = true, calls }) {
  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options })
    if (String(url).includes('grant_type=password')) {
      return Response.json({ access_token: 'access-secret', refresh_token: 'refresh-secret', expires_in: 3600 })
    }
    if (String(url).includes('grant_type=refresh_token')) {
      return Response.json({ access_token: 'renewed-secret', refresh_token: 'renewed-refresh', expires_in: 3600 })
    }
    if (String(url).endsWith('/auth/v1/user')) return Response.json({ id: 'admin-id' })
    if (String(url).includes('/admin_users?')) return Response.json(admin ? [{ user_id: 'admin-id' }] : [])
    if (String(url).includes('/registrations?') && options.method === 'POST') {
      return Response.json([{ id: registrationId, ...JSON.parse(options.body), created_at: '2026-10-26T00:00:00Z', is_attended: false }])
    }
    if (String(url).includes('/registrations?') && options.method === 'PATCH') {
      if (JSON.parse(options.body).full_name) return Response.json([{ id: registrationId, ...JSON.parse(options.body), created_at: '2026-10-22T00:00:00Z', is_attended: false }])
      return Response.json([{ id: registrationId, is_attended: true }])
    }
    if (String(url).includes('/registrations?') && options.method === 'DELETE') return Response.json([{ id: registrationId }])
    if (String(url).includes('/registrations?')) return Response.json([{ id: registrationId, email: 'guest@example.com', is_attended: false }])
    if (String(url).endsWith('/auth/v1/logout')) return Response.json({})
    throw new Error(`Unexpected Supabase call: ${url}`)
  }
}

test('login stores tokens only in a secure HttpOnly cookie and serves authorized data', async () => {
  const calls = []
  authFetch({ calls })
  const login = await POST(request('login', { method: 'POST', body: { username: 'Holywin', password: 'test-password' } }))
  assert.equal(login.status, 200)
  const loginBody = await login.text()
  assert.deepEqual(JSON.parse(loginBody), { ok: true })
  const setCookie = login.headers.get('set-cookie')
  assert.match(setCookie, /HttpOnly; Secure; SameSite=Strict; Path=\//)
  assert.doesNotMatch(loginBody, /access-secret|refresh-secret/)
  const cookie = setCookie.split(';')[0]

  const session = await GET(request('session', { cookie }))
  assert.deepEqual(await session.json(), { admin: true })
  const registrations = await GET(request('registrations&offset=0', { cookie }))
  assert.deepEqual(await registrations.json(), { registrations: [{ id: registrationId, email: 'guest@example.com', is_attended: false }] })
  assert.ok(calls.some(call => call.url.includes('/registrations?') && call.options.headers.Authorization === 'Bearer access-secret'))
  assert.ok(calls.some(call => call.url.includes('/registrations?select=') && call.url.includes('best_in_costume')))
  assert.ok(calls.some(call => call.url.includes('/registrations?select=') && call.url.includes('costume_character')))

  const logout = await POST(request('logout', { method: 'POST', cookie }))
  assert.deepEqual(await logout.json(), { ok: true })
  assert.match(logout.headers.get('set-cookie'), /Max-Age=0/)
})

test('expired sessions refresh on the server without returning tokens in JSON', async () => {
  const calls = []
  authFetch({ calls })
  const expired = Buffer.from(JSON.stringify({ access_token: 'expired', refresh_token: 'refresh-secret', expires_at: 1 })).toString('base64url')
  const response = await GET(request('session', { cookie: `__Host-holywin-admin=${expired}` }))
  assert.deepEqual(await response.json(), { admin: true })
  assert.ok(calls.some(call => call.url.includes('grant_type=refresh_token')))
  assert.match(response.headers.get('set-cookie'), /__Host-holywin-admin=/)
})

test('non-admins, missing sessions, and cross-origin login cannot access registrations', async () => {
  const calls = []
  authFetch({ admin: false, calls })
  const nonAdmin = await POST(request('login', { method: 'POST', body: { username: 'Holywin', password: 'test-password' } }))
  assert.equal(nonAdmin.status, 403)
  assert.equal(nonAdmin.headers.get('set-cookie'), null)

  const noSession = await GET(request('registrations'))
  assert.equal(noSession.status, 401)
  assert.equal(calls.filter(call => call.url.includes('/registrations?')).length, 0)

  const crossOrigin = await POST(request('login', { method: 'POST', origin: 'https://attacker.example', body: { username: 'Holywin', password: 'test-password' } }))
  assert.equal(crossOrigin.status, 403)
  assert.equal(calls.filter(call => call.url.includes('grant_type=password')).length, 1)
})

test('attendance updates require an admin cookie and same-origin request', async () => {
  const calls = []
  authFetch({ calls })
  const login = await POST(request('login', { method: 'POST', body: { username: 'Holywin', password: 'test-password' } }))
  const cookie = login.headers.get('set-cookie').split(';')[0]
  const body = { id: registrationId, isAttended: true }

  const unauthorized = await PATCH(request('attendance', { method: 'PATCH', body }))
  assert.equal(unauthorized.status, 401)
  const crossOrigin = await PATCH(request('attendance', { method: 'PATCH', cookie, body, origin: 'https://attacker.example' }))
  assert.equal(crossOrigin.status, 403)
  const updated = await PATCH(request('attendance', { method: 'PATCH', cookie, body }))
  assert.deepEqual(await updated.json(), { isAttended: true })
  assert.ok(calls.some(call => call.url.includes('/registrations?') && call.options.method === 'PATCH' && call.options.headers.Authorization === 'Bearer access-secret'))
})

test('editing and deleting registrations require admin access and same-origin requests', async () => {
  const calls = []
  authFetch({ calls })
  const login = await POST(request('login', { method: 'POST', body: { username: 'Holywin', password: 'test-password' } }))
  const cookie = login.headers.get('set-cookie').split(';')[0]
  const edit = { id: registrationId, full_name: 'Edited Guest', email: 'EDITED@example.com', invited_by: null, best_in_costume: false, costume_character: null }

  assert.equal((await PATCH(request('registration', { method: 'PATCH', body: edit }))).status, 401)
  assert.equal((await PATCH(request('registration', { method: 'PATCH', cookie, body: edit, origin: 'https://attacker.example' }))).status, 403)
  assert.equal((await PATCH(request('registration', { method: 'PATCH', cookie, body: { ...edit, email: 'invalid' } }))).status, 400)
  const updated = await PATCH(request('registration', { method: 'PATCH', cookie, body: edit }))
  assert.equal(updated.status, 200)
  assert.equal((await updated.json()).registration.email, 'edited@example.com')
  const patchCall = calls.find(call => call.url.includes('/registrations?') && call.options.method === 'PATCH' && JSON.parse(call.options.body).full_name)
  assert.equal(patchCall.options.headers.Authorization, 'Bearer access-secret')
  assert.equal(JSON.parse(patchCall.options.body).email, 'edited@example.com')

  const deletion = { id: registrationId }
  assert.equal((await DELETE(request('registration', { method: 'DELETE', body: deletion }))).status, 401)
  assert.equal((await DELETE(request('registration', { method: 'DELETE', cookie, body: deletion, origin: 'https://attacker.example' }))).status, 403)
  assert.equal((await DELETE(request('registration', { method: 'DELETE', cookie, body: { id: 'invalid' } }))).status, 400)
  const deleted = await DELETE(request('registration', { method: 'DELETE', cookie, body: deletion }))
  assert.deepEqual(await deleted.json(), { ok: true })
  assert.ok(calls.some(call => call.url.includes('/registrations?') && call.options.method === 'DELETE' && call.options.headers.Authorization === 'Bearer access-secret'))
})

test('adding a registration requires admin access and returns the created row', async () => {
  const calls = []
  authFetch({ calls })
  const login = await POST(request('login', { method: 'POST', body: { username: 'Holywin', password: 'test-password' } }))
  const cookie = login.headers.get('set-cookie').split(';')[0]
  const body = { full_name: 'New Guest', email: 'NEW@example.com', invited_by: null, best_in_costume: true, costume_character: 'Hero' }

  assert.equal((await POST(request('registration', { method: 'POST', body }))).status, 401)
  assert.equal((await POST(request('registration', { method: 'POST', cookie, body, origin: 'https://attacker.example' }))).status, 403)
  assert.equal((await POST(request('registration', { method: 'POST', cookie, body: { ...body, costume_character: null } }))).status, 400)
  assert.equal(calls.filter(call => call.url.includes('/registrations?') && call.options.method === 'POST').length, 0)

  const created = await POST(request('registration', { method: 'POST', cookie, body }))
  assert.equal(created.status, 201)
  assert.deepEqual((await created.json()).registration, { id: registrationId, ...body, email: 'new@example.com', created_at: '2026-10-26T00:00:00Z', is_attended: false })
  const insertCall = calls.find(call => call.url.includes('/registrations?') && call.options.method === 'POST')
  assert.equal(insertCall.options.headers.Authorization, 'Bearer access-secret')
  assert.equal(insertCall.options.headers.Prefer, 'return=representation')
  assert.equal(JSON.parse(insertCall.options.body).email, 'new@example.com')

  const nonAdminCalls = []
  authFetch({ admin: false, calls: nonAdminCalls })
  assert.equal((await POST(request('registration', { method: 'POST', cookie, body }))).status, 401)
  assert.equal(nonAdminCalls.filter(call => call.url.includes('/registrations?') && call.options.method === 'POST').length, 0)
})

test('Vite serves the admin API during local development', async () => {
  const server = await createServer({ server: { middlewareMode: true } })
  try {
    const route = server.middlewares.stack.find(layer => layer.route === '/api/admin')
    assert.ok(route)
    const req = Readable.from([])
    req.method = 'GET'
    req.url = '/?action=session'
    req.headers = { host: 'localhost:5173' }
    const headers = {}
    let body = ''
    const res = {
      statusCode: 200,
      setHeader(name, value) { headers[name] = value },
      end(value) { body = value.toString() },
    }
    await route.handle(req, res)
    assert.equal(res.statusCode, 200)
    assert.deepEqual(JSON.parse(body), { admin: false })
    assert.match(headers['set-cookie'], /HttpOnly; Secure/)
  } finally {
    await server.close()
  }
})
