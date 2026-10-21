alter table public.registrations
add column costume_character text
check (costume_character is null or (best_in_costume and length(btrim(costume_character)) between 1 and 120));

grant insert (costume_character) on public.registrations to anon;
