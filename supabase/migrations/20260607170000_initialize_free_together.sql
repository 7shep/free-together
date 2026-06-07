create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references public.profiles (id) on delete cascade,
  invite_code text not null unique default substring(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  created_at timestamptz not null default now()
);

create table if not exists public.group_members (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (group_id, user_id)
);

create table if not exists public.group_invites (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups (id) on delete cascade,
  email text not null,
  invitee_name text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked')),
  created_at timestamptz not null default now(),
  unique (group_id, email)
);

create table if not exists public.availability_slots (
  group_id uuid not null references public.groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  slot_date date not null,
  slot_index smallint not null check (slot_index between 0 and 5),
  starts_at time not null,
  ends_at time not null,
  created_at timestamptz not null default now(),
  primary key (group_id, user_id, slot_date, slot_index),
  check (ends_at > starts_at)
);

create schema if not exists private;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1), 'Friend')
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = excluded.full_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;
alter table public.group_invites enable row level security;
alter table public.availability_slots enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.groups to authenticated;
grant select, insert, update, delete on public.group_members to authenticated;
grant select, insert, update on public.group_invites to authenticated;
grant select, insert, delete on public.availability_slots to authenticated;

create policy "profiles_select_shared_groups"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or exists (
    select 1
    from public.group_members my_membership
    join public.group_members other_membership
      on my_membership.group_id = other_membership.group_id
    where my_membership.user_id = auth.uid()
      and other_membership.user_id = profiles.id
  )
);

create policy "profiles_insert_self"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "profiles_update_self"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "groups_select_member"
on public.groups
for select
to authenticated
using (
  exists (
    select 1
    from public.group_members membership
    where membership.group_id = groups.id
      and membership.user_id = auth.uid()
  )
);

create policy "groups_insert_owner"
on public.groups
for insert
to authenticated
with check (created_by = auth.uid());

create policy "groups_update_owner"
on public.groups
for update
to authenticated
using (created_by = auth.uid())
with check (created_by = auth.uid());

create policy "groups_delete_owner"
on public.groups
for delete
to authenticated
using (created_by = auth.uid());

create policy "group_members_select_member"
on public.group_members
for select
to authenticated
using (
  exists (
    select 1
    from public.group_members membership
    where membership.group_id = group_members.group_id
      and membership.user_id = auth.uid()
  )
);

create policy "group_members_insert_owner"
on public.group_members
for insert
to authenticated
with check (
  exists (
    select 1
    from public.groups existing_group
    where existing_group.id = group_members.group_id
      and existing_group.created_by = auth.uid()
  )
  or (
    group_members.user_id = auth.uid()
    and exists (
      select 1
      from public.group_invites invite
      join public.profiles profile on profile.id = auth.uid()
      where invite.group_id = group_members.group_id
        and invite.status = 'pending'
        and lower(invite.email) = lower(profile.email)
    )
  )
);

create policy "group_members_delete_owner"
on public.group_members
for delete
to authenticated
using (
  exists (
    select 1
    from public.groups existing_group
    where existing_group.id = group_members.group_id
      and existing_group.created_by = auth.uid()
  )
);

create policy "group_invites_select_group_member_or_invitee"
on public.group_invites
for select
to authenticated
using (
  exists (
    select 1
    from public.group_members membership
    where membership.group_id = group_invites.group_id
      and membership.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and lower(profile.email) = lower(group_invites.email)
  )
);

create policy "group_invites_insert_group_member"
on public.group_invites
for insert
to authenticated
with check (
  exists (
    select 1
    from public.group_members membership
    where membership.group_id = group_invites.group_id
      and membership.user_id = auth.uid()
  )
);

create policy "group_invites_update_group_member_or_invitee"
on public.group_invites
for update
to authenticated
using (
  exists (
    select 1
    from public.group_members membership
    where membership.group_id = group_invites.group_id
      and membership.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and lower(profile.email) = lower(group_invites.email)
  )
)
with check (
  exists (
    select 1
    from public.group_members membership
    where membership.group_id = group_invites.group_id
      and membership.user_id = auth.uid()
  )
  or exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and lower(profile.email) = lower(group_invites.email)
  )
);

create policy "availability_select_group_member"
on public.availability_slots
for select
to authenticated
using (
  exists (
    select 1
    from public.group_members membership
    where membership.group_id = availability_slots.group_id
      and membership.user_id = auth.uid()
  )
);

create policy "availability_insert_self"
on public.availability_slots
for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.group_members membership
    where membership.group_id = availability_slots.group_id
      and membership.user_id = auth.uid()
  )
);

create policy "availability_delete_self"
on public.availability_slots
for delete
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1
    from public.group_members membership
    where membership.group_id = availability_slots.group_id
      and membership.user_id = auth.uid()
  )
);
