grant insert (full_name, email, invited_by, best_in_costume, costume_character)
on public.registrations to authenticated;

create policy "Admins can add registrations"
on public.registrations for insert to authenticated
with check (exists (
  select 1 from public.admin_users
  where user_id = (select auth.uid())
));
