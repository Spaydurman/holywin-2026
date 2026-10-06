// Run on a trusted machine only. Never put the service role key in VITE_* variables.
const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const password = process.env.HOLYWIN_ADMIN_PASSWORD || 'TSA_Holywin2026'
const email = 'admin@holywin.local'

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running this script.')
  process.exit(1)
}

const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' }

async function request(path, options = {}) {
  const response = await fetch(`${url}${path}`, { ...options, headers: { ...headers, ...options.headers } })
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path} failed (${response.status}): ${await response.text()}`)
  const body = await response.text()
  return body ? JSON.parse(body) : null
}

let existing
for (let page = 1; !existing; page++) {
  const result = await request(`/auth/v1/admin/users?page=${page}&per_page=100`)
  existing = result.users.find(user => user.email?.toLowerCase() === email)
  if (existing || result.users.length < 100) break
}

const user = existing
  ? await request(`/auth/v1/admin/users/${existing.id}`, { method: 'PUT', body: JSON.stringify({ password, email_confirm: true }) })
  : await request('/auth/v1/admin/users', { method: 'POST', body: JSON.stringify({ email, password, email_confirm: true }) })

await request('/rest/v1/admin_users?on_conflict=user_id', {
  method: 'POST',
  headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  body: JSON.stringify({ user_id: user.id }),
})

console.log('Holywin admin is ready. Username: Holywin')
