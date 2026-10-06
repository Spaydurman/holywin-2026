create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on public.admin_users from public, anon, authenticated;
grant select on public.admin_users to authenticated;

create policy "Admins can verify their role"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

grant select on public.registrations to authenticated;

create policy "Admins can read registrations"
on public.registrations for select to authenticated
using (exists (
  select 1 from public.admin_users
  where user_id = (select auth.uid())
));
