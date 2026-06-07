create or replace function public.join_group_by_invite_code(p_invite_code text)
returns table(group_id uuid, group_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  target_group public.groups%rowtype;
  profile_email text;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select *
  into target_group
  from public.groups
  where lower(invite_code) = lower(trim(p_invite_code))
  limit 1;

  if not found then
    raise exception 'This invite link is invalid or expired.';
  end if;

  select email
  into profile_email
  from public.profiles
  where id = auth.uid();

  if profile_email is null then
    raise exception 'Profile not found for the current user.';
  end if;

  insert into public.group_members (group_id, user_id, role)
  values (target_group.id, auth.uid(), 'member')
  on conflict (group_id, user_id) do nothing;

  update public.group_invites
  set status = 'accepted'
  where group_id = target_group.id
    and lower(email) = lower(profile_email)
    and status = 'pending';

  return query
  select target_group.id, target_group.name;
end;
$$;

revoke all on function public.join_group_by_invite_code(text) from public;
grant execute on function public.join_group_by_invite_code(text) to authenticated;
