create schema if not exists private;

create or replace function private.is_group_member(target_group_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members membership
    where membership.group_id = target_group_id
      and membership.user_id = target_user_id
  );
$$;

create or replace function private.is_group_owner(target_group_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.groups existing_group
    where existing_group.id = target_group_id
      and existing_group.created_by = target_user_id
  );
$$;

create or replace function private.shares_group_with(other_user_id uuid, target_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.group_members my_membership
    join public.group_members other_membership
      on my_membership.group_id = other_membership.group_id
    where my_membership.user_id = target_user_id
      and other_membership.user_id = other_user_id
  );
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_group_member(uuid, uuid) to authenticated;
grant execute on function private.is_group_owner(uuid, uuid) to authenticated;
grant execute on function private.shares_group_with(uuid, uuid) to authenticated;

drop policy if exists "profiles_select_shared_groups" on public.profiles;
create policy "profiles_select_shared_groups"
on public.profiles
for select
to authenticated
using (
  id = auth.uid()
  or private.shares_group_with(profiles.id)
);

drop policy if exists "groups_select_member" on public.groups;
create policy "groups_select_member"
on public.groups
for select
to authenticated
using (
  created_by = auth.uid()
  or private.is_group_member(groups.id)
);


drop policy if exists "group_members_select_member" on public.group_members;
create policy "group_members_select_member"
on public.group_members
for select
to authenticated
using (private.is_group_member(group_members.group_id));

drop policy if exists "group_members_insert_owner" on public.group_members;
create policy "group_members_insert_owner"
on public.group_members
for insert
to authenticated
with check (
  private.is_group_owner(group_members.group_id)
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

drop policy if exists "group_members_delete_owner" on public.group_members;
create policy "group_members_delete_owner"
on public.group_members
for delete
to authenticated
using (private.is_group_owner(group_members.group_id));

drop policy if exists "group_invites_select_group_member_or_invitee" on public.group_invites;
create policy "group_invites_select_group_member_or_invitee"
on public.group_invites
for select
to authenticated
using (
  private.is_group_member(group_invites.group_id)
  or exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and lower(profile.email) = lower(group_invites.email)
  )
);

drop policy if exists "group_invites_insert_group_member" on public.group_invites;
create policy "group_invites_insert_group_member"
on public.group_invites
for insert
to authenticated
with check (private.is_group_member(group_invites.group_id));

drop policy if exists "group_invites_update_group_member_or_invitee" on public.group_invites;
create policy "group_invites_update_group_member_or_invitee"
on public.group_invites
for update
to authenticated
using (
  private.is_group_member(group_invites.group_id)
  or exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and lower(profile.email) = lower(group_invites.email)
  )
)
with check (
  private.is_group_member(group_invites.group_id)
  or exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and lower(profile.email) = lower(group_invites.email)
  )
);

drop policy if exists "availability_select_group_member" on public.availability_slots;
create policy "availability_select_group_member"
on public.availability_slots
for select
to authenticated
using (private.is_group_member(availability_slots.group_id));

drop policy if exists "availability_insert_self" on public.availability_slots;
create policy "availability_insert_self"
on public.availability_slots
for insert
to authenticated
with check (
  user_id = auth.uid()
  and private.is_group_member(availability_slots.group_id)
);

drop policy if exists "availability_delete_self" on public.availability_slots;
create policy "availability_delete_self"
on public.availability_slots
for delete
to authenticated
using (
  user_id = auth.uid()
  and private.is_group_member(availability_slots.group_id)
);
