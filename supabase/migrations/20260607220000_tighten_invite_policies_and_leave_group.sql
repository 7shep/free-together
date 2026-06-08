-- Replace the single broad invite update policy with two narrow ones that
-- enforce valid status transitions at the database level.
-- Previously any group member could update any invite to any status, which
-- would allow a regular member to revoke someone else's invite or reopen an
-- accepted one. Now the DB enforces exactly which transitions are legal.

drop policy if exists "group_invites_update_group_member_or_invitee" on public.group_invites;

-- Invitees can only accept their own pending invite (pending → accepted).
create policy "group_invites_accept_invitee"
on public.group_invites
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles profile
    where profile.id = auth.uid()
      and lower(profile.email) = lower(group_invites.email)
  )
  and group_invites.status = 'pending'
)
with check (
  status = 'accepted'
);

-- Only the group owner can revoke pending invites (pending → revoked).
create policy "group_invites_revoke_owner"
on public.group_invites
for update
to authenticated
using (
  private.is_group_owner(group_invites.group_id)
  and group_invites.status = 'pending'
)
with check (
  status = 'revoked'
);

-- Allow any non-owner member to remove themselves from a group.
-- Owners cannot leave — they must delete the group instead.
-- This prevents groups from becoming ownerless.
create policy "group_members_leave_self"
on public.group_members
for delete
to authenticated
using (
  user_id = auth.uid()
  and not private.is_group_owner(group_members.group_id)
);
