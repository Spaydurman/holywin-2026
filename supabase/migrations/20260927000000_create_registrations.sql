create table public.registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(btrim(full_name)) between 1 and 120),
  email text not null check (length(btrim(email)) between 3 and 254),
  invited_by text check (invited_by is null or length(btrim(invited_by)) between 1 and 120),
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

revoke all on public.registrations from public, anon, authenticated;
grant insert (full_name, email, invited_by) on public.registrations to anon;

create policy "Visitors can register"
on public.registrations
for insert
to anon
with check (true);
