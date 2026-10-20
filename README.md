# Holywin 2026

A Holywin site built with React, TypeScript, Motion, Anime.js, and Vite.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Admin access

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` for local development and in the Vercel project settings for deployment. Apply the SQL migrations in `supabase/migrations` before creating an admin.

On a trusted machine, set `SUPABASE_SERVICE_ROLE_KEY` and a unique `HOLYWIN_ADMIN_PASSWORD` of at least 16 characters in `.env`, then run `node scripts/provision-admin.mjs`. Never place the service role key or admin password in a `VITE_` variable. The provisioning script has no default password.

Admin authentication is handled by the same-origin Vercel function at `/api/admin`. It stores the Supabase session in a Secure, HttpOnly, SameSite cookie and checks the admin role before returning registrations. `npm run dev` serves the same API locally. Existing browser sessions from versions that used localStorage are cleared, so admins must sign in again. Run `npm run test:admin` to check the API security flow.

## Before launch

- Replace the “Coming soon” date and venue with confirmed event details.
- Replace the illustrative gallery with approved Holywin photos.
- Verify the Supabase environment variables, migrations, and admin account in the deployment before accepting registrations.
