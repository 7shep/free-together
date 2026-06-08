import type { User } from '@supabase/supabase-js';
import { requireSupabase } from './supabase';

export interface GroupListItem {
  createdAt: string;
  createdBy: string;
  id: string;
  inviteCode: string;
  name: string;
  role: 'owner' | 'member';
}

export interface GroupMember {
  email: string;
  fullName: string;
  role: 'owner' | 'member';
  userId: string;
}

export interface GroupInvite {
  createdAt: string;
  email: string;
  groupId: string;
  groupName?: string;
  id: string;
  inviteeName: string | null;
  status: 'pending' | 'accepted' | 'revoked';
}

export interface GroupChatMessage {
  body: string;
  createdAt: string;
  groupId: string;
  id: string;
  senderEmail: string;
  senderName: string;
  userId: string;
}

export interface AvailabilityRecord {
  slotDate: string;
  slotIndex: number;
  userId: string;
}

export interface GroupSnapshot {
  availability: AvailabilityRecord[];
  invites: GroupInvite[];
  members: GroupMember[];
}

function getDisplayName(user: User) {
  const fallback = user.email?.split('@')[0] ?? 'Friend';
  return `${user.user_metadata?.full_name || user.user_metadata?.name || fallback}`.trim();
}

async function syncProfileBestEffort(user: User) {
  try {
    await syncProfile(user);
  } catch (error) {
    // Profile rows should already be created by the auth trigger. If the direct
    // REST upsert fails, continue and let the real write surface a clearer error.
    console.warn('Skipping non-blocking profile sync', error);
  }
}

export async function syncProfile(user: User) {
  const client = requireSupabase();
  const payload = {
    id: user.id,
    email: user.email ?? '',
    full_name: getDisplayName(user),
  };

  const { error } = await client.from('profiles').upsert(payload);
  if (error) throw error;
}

export async function listMyGroups(userId: string): Promise<GroupListItem[]> {
  const client = requireSupabase();

  const { data: memberships, error: membershipError } = await client
    .from('group_members')
    .select('group_id, role')
    .eq('user_id', userId);

  if (membershipError) throw membershipError;
  if (!memberships?.length) return [];

  const roles = new Map(memberships.map((item) => [item.group_id, item.role as 'owner' | 'member']));
  const groupIds = memberships.map((item) => item.group_id);

  const { data: groups, error: groupError } = await client
    .from('groups')
    .select('id, name, invite_code, created_by, created_at')
    .in('id', groupIds)
    .order('created_at', { ascending: true });

  if (groupError) throw groupError;

  return (groups ?? []).map((group) => ({
    createdAt: group.created_at,
    createdBy: group.created_by,
    id: group.id,
    inviteCode: group.invite_code,
    name: group.name,
    role: roles.get(group.id) ?? 'member',
  }));
}

export async function listIncomingInvites(email: string): Promise<GroupInvite[]> {
  const client = requireSupabase();

  const { data: invites, error } = await client
    .from('group_invites')
    .select('id, group_id, email, invitee_name, status, created_at')
    .eq('email', email.toLowerCase())
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!invites?.length) return [];

  const groupIds = [...new Set(invites.map((invite) => invite.group_id))];
  const { data: groups, error: groupError } = await client
    .from('groups')
    .select('id, name')
    .in('id', groupIds);

  if (groupError) throw groupError;

  const groupNames = new Map((groups ?? []).map((group) => [group.id, group.name]));

  return invites.map((invite) => ({
    createdAt: invite.created_at,
    email: invite.email,
    groupId: invite.group_id,
    groupName: groupNames.get(invite.group_id),
    id: invite.id,
    inviteeName: invite.invitee_name,
    status: invite.status,
  }));
}

export async function createGroup(user: User, name: string): Promise<string> {
  const client = requireSupabase();
  await syncProfileBestEffort(user);

  const { data: group, error: groupError } = await client
    .from('groups')
    .insert({
      created_by: user.id,
      name: name.trim(),
    })
    .select('id')
    .single();

  if (groupError) throw groupError;

  const { error: memberError } = await client.from('group_members').insert({
    group_id: group.id,
    role: 'owner',
    user_id: user.id,
  });

  if (memberError) throw memberError;

  return group.id;
}

export async function joinGroupByInviteCode(
  user: User,
  inviteCode: string,
): Promise<{ groupId: string; groupName: string }> {
  const client = requireSupabase();
  await syncProfileBestEffort(user);

  const { data, error } = await client.rpc('join_group_by_invite_code', {
    p_invite_code: inviteCode.trim().toLowerCase(),
  });

  if (error) throw error;

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.group_id || !row?.group_name) {
    throw new Error('This invite link is invalid or no longer works.');
  }

  return {
    groupId: row.group_id as string,
    groupName: row.group_name as string,
  };
}

export async function acceptInvite(user: User, inviteId: string) {
  const client = requireSupabase();
  await syncProfileBestEffort(user);

  const { data: invite, error: inviteError } = await client
    .from('group_invites')
    .select('id, group_id, status')
    .eq('id', inviteId)
    .single();

  if (inviteError) throw inviteError;

  const { error: memberError } = await client.from('group_members').upsert({
    group_id: invite.group_id,
    role: 'member',
    user_id: user.id,
  });

  if (memberError) throw memberError;

  if (invite.status !== 'accepted') {
    const { error: updateError } = await client
      .from('group_invites')
      .update({ status: 'accepted' })
      .eq('id', inviteId);

    if (updateError) throw updateError;
  }

  return invite.group_id as string;
}

export async function inviteMember(groupId: string, email: string, inviteeName: string) {
  const client = requireSupabase();

  const { error } = await client.from('group_invites').upsert(
    {
      email: email.trim().toLowerCase(),
      group_id: groupId,
      invitee_name: inviteeName.trim() || null,
      status: 'pending',
    },
    { onConflict: 'group_id,email' },
  );

  if (error) throw error;
}

export async function listGroupMessages(groupId: string): Promise<GroupChatMessage[]> {
  const client = requireSupabase();

  const { data: messages, error: messageError } = await client
    .from('group_messages')
    .select('id, group_id, user_id, body, created_at')
    .eq('group_id', groupId)
    .order('created_at', { ascending: true });

  if (messageError) throw messageError;
  if (!messages?.length) return [];

  const userIds = [...new Set(messages.map((message) => message.user_id))];
  const { data: profiles, error: profileError } = await client
    .from('profiles')
    .select('id, full_name, email')
    .in('id', userIds);

  if (profileError) throw profileError;

  const profilesById = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      {
        email: profile.email,
        fullName: profile.full_name,
      },
    ]),
  );

  return messages.map((message) => {
    const sender = profilesById.get(message.user_id);
    return {
      body: message.body,
      createdAt: message.created_at,
      groupId: message.group_id,
      id: message.id,
      senderEmail: sender?.email ?? '',
      senderName: sender?.fullName ?? 'Unknown member',
      userId: message.user_id,
    };
  });
}

export async function sendGroupMessage(user: User, groupId: string, body: string) {
  const client = requireSupabase();
  await syncProfileBestEffort(user);

  const { error } = await client.from('group_messages').insert({
    body: body.trim(),
    group_id: groupId,
    user_id: user.id,
  });

  if (error) throw error;
}

export async function loadGroupSnapshot(
  groupId: string,
  rangeStart: string,
  rangeEnd: string,
): Promise<GroupSnapshot> {
  const client = requireSupabase();

  const [{ data: memberships, error: membershipsError }, { data: invites, error: invitesError }, { data: availability, error: availabilityError }] =
    await Promise.all([
      client
        .from('group_members')
        .select('user_id, role')
        .eq('group_id', groupId)
        .order('created_at', { ascending: true }),
      client
        .from('group_invites')
        .select('id, group_id, email, invitee_name, status, created_at')
        .eq('group_id', groupId)
        .neq('status', 'revoked')
        .order('created_at', { ascending: false }),
      client
        .from('availability_slots')
        .select('user_id, slot_date, slot_index')
        .eq('group_id', groupId)
        .gte('slot_date', rangeStart)
        .lte('slot_date', rangeEnd),
    ]);

  if (membershipsError) throw membershipsError;
  if (invitesError) throw invitesError;
  if (availabilityError) throw availabilityError;

  const userIds = [...new Set((memberships ?? []).map((membership) => membership.user_id))];

  const { data: profiles, error: profilesError } = await client
    .from('profiles')
    .select('id, full_name, email')
    .in('id', userIds);

  if (profilesError) throw profilesError;

  const profilesById = new Map(
    (profiles ?? []).map((profile) => [
      profile.id,
      {
        email: profile.email,
        fullName: profile.full_name,
      },
    ]),
  );

  return {
    availability: (availability ?? []).map((item) => ({
      slotDate: item.slot_date,
      slotIndex: item.slot_index,
      userId: item.user_id,
    })),
    invites: (invites ?? []).map((invite) => ({
      createdAt: invite.created_at,
      email: invite.email,
      groupId: invite.group_id,
      id: invite.id,
      inviteeName: invite.invitee_name,
      status: invite.status,
    })),
    members: (memberships ?? []).map((membership) => {
      const profile = profilesById.get(membership.user_id);
      return {
        email: profile?.email ?? '',
        fullName: profile?.fullName ?? 'Unknown member',
        role: membership.role,
        userId: membership.user_id,
      };
    }),
  };
}

export async function setAvailability(
  groupId: string,
  userId: string,
  slotDate: string,
  slotIndex: number,
  startsAt: string,
  endsAt: string,
  available: boolean,
) {
  const client = requireSupabase();

  if (available) {
    const { error } = await client.from('availability_slots').upsert(
      {
        ends_at: endsAt,
        group_id: groupId,
        slot_date: slotDate,
        slot_index: slotIndex,
        starts_at: startsAt,
        user_id: userId,
      },
      { onConflict: 'group_id,user_id,slot_date,slot_index' },
    );

    if (error) throw error;
    return;
  }

  const { error } = await client
    .from('availability_slots')
    .delete()
    .match({ group_id: groupId, user_id: userId, slot_date: slotDate, slot_index: slotIndex });

  if (error) throw error;
}

export async function clearAvailabilityRange(groupId: string, userId: string, rangeStart: string, rangeEnd: string) {
  const client = requireSupabase();

  const { error } = await client
    .from('availability_slots')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId)
    .gte('slot_date', rangeStart)
    .lte('slot_date', rangeEnd);

  if (error) throw error;
}

export async function revokeInvite(inviteId: string) {
  const client = requireSupabase();

  const { error } = await client
    .from('group_invites')
    .update({ status: 'revoked' })
    .eq('id', inviteId);

  if (error) throw error;
}

export async function leaveGroup(groupId: string, userId: string) {
  const client = requireSupabase();

  const { error } = await client
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
    .eq('user_id', userId);

  if (error) throw error;
}
