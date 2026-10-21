alter table public.registrations
add column best_in_costume boolean not null default false;

grant insert (best_in_costume) on public.registrations to anon;
