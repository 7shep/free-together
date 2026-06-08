create table if not exists public.group_messages (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  check (char_length(trim(body)) > 0),
  check (char_length(body) <= 2000)
);

create index if not exists group_messages_group_id_created_at_idx
  on public.group_messages (group_id, created_at);

alter table public.group_messages enable row level security;

grant select, insert on public.group_messages to authenticated;

drop policy if exists "group_messages_select_group_member" on public.group_messages;
create policy "group_messages_select_group_member"
on public.group_messages
for select
to authenticated
using (
  private.is_group_member(group_messages.group_id)
);

drop policy if exists "group_messages_insert_self" on public.group_messages;
create policy "group_messages_insert_self"
on public.group_messages
for insert
to authenticated
with check (
  user_id = auth.uid()
  and private.is_group_member(group_messages.group_id)
);

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) and not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'group_messages'
  ) then
    alter publication supabase_realtime add table public.group_messages;
  end if;
end
$$;
