alter table public.registrations
add column is_attended boolean not null default false;

grant update (is_attended) on public.registrations to authenticated;

create policy "Admins can update registration attendance"
on public.registrations for update to authenticated
using (exists (
  select 1 from public.admin_users
  where user_id = (select auth.uid())
))
with check (exists (
  select 1 from public.admin_users
  where user_id = (select auth.uid())
));
