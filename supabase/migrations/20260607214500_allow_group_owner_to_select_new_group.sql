drop policy if exists "groups_select_member" on public.groups;

create policy "groups_select_member"
on public.groups
for select
to authenticated
using (
  created_by = auth.uid()
  or private.is_group_member(groups.id)
);
