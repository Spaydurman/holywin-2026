grant update (full_name, email, invited_by, best_in_costume, costume_character)
on public.registrations to authenticated;

grant delete on public.registrations to authenticated;

create policy "Admins can delete registrations"
on public.registrations for delete to authenticated
using (exists (
  select 1 from public.admin_users
  where user_id = (select auth.uid())
));
