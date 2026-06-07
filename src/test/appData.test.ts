import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { User } from '@supabase/supabase-js';
import {
  syncProfile,
  listMyGroups,
  listIncomingInvites,
  createGroup,
  joinGroupByInviteCode,
  acceptInvite,
  inviteMember,
  setAvailability,
  clearAvailabilityRange,
} from '../lib/appData';
import { requireSupabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
  requireSupabase: vi.fn(),
  isSupabaseConfigured: true,
  supabase: null,
}));

const mockRequireSupabase = vi.mocked(requireSupabase);

// Builds a chainable Supabase query builder that resolves to `resolved` when awaited or .single() is called
function chain(resolved: { data: unknown; error: unknown }) {
  const q: Record<string, unknown> = {};
  for (const m of ['select', 'eq', 'neq', 'in', 'gte', 'lte', 'order', 'insert', 'upsert', 'update', 'delete', 'match']) {
    q[m] = vi.fn(() => q);
  }
  q.single = vi.fn(() => Promise.resolve(resolved));
  q.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
    Promise.resolve(resolved).then(resolve, reject);
  return q as any;
}

const mockUser: User = {
  id: 'user-1',
  email: 'alice@example.com',
  user_metadata: { full_name: 'Alice' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
} as User;

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── syncProfile ─────────────────────────────────────────────────────────────

describe('syncProfile', () => {
  it('upserts the correct profile payload', async () => {
    const q = chain({ data: null, error: null });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await syncProfile(mockUser);

    expect(q.upsert).toHaveBeenCalledWith({
      id: 'user-1',
      email: 'alice@example.com',
      full_name: 'Alice',
    });
  });

  it('uses email prefix as display name when full_name is missing', async () => {
    const q = chain({ data: null, error: null });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await syncProfile({ ...mockUser, user_metadata: {} });

    expect(q.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ full_name: 'alice' }),
    );
  });

  it('throws when the upsert fails', async () => {
    const q = chain({ data: null, error: { message: 'DB error' } });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await expect(syncProfile(mockUser)).rejects.toEqual({ message: 'DB error' });
  });
});

// ─── listMyGroups ─────────────────────────────────────────────────────────────

describe('listMyGroups', () => {
  it('returns empty array when user has no memberships', async () => {
    const q = chain({ data: [], error: null });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    expect(await listMyGroups('user-1')).toEqual([]);
  });

  it('returns mapped groups with correct roles', async () => {
    const membershipsQ = chain({ data: [{ group_id: 'g-1', role: 'owner' }], error: null });
    const groupsQ = chain({
      data: [{ id: 'g-1', name: 'Crew', invite_code: 'abc123', created_by: 'user-1', created_at: '2026-01-01' }],
      error: null,
    });
    mockRequireSupabase.mockReturnValue({
      from: vi.fn().mockReturnValueOnce(membershipsQ).mockReturnValueOnce(groupsQ),
    } as any);

    expect(await listMyGroups('user-1')).toEqual([{
      id: 'g-1',
      name: 'Crew',
      inviteCode: 'abc123',
      createdBy: 'user-1',
      createdAt: '2026-01-01',
      role: 'owner',
    }]);
  });

  it('throws when membership query fails', async () => {
    const q = chain({ data: null, error: { message: 'forbidden' } });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await expect(listMyGroups('user-1')).rejects.toEqual({ message: 'forbidden' });
  });
});

// ─── listIncomingInvites ──────────────────────────────────────────────────────

describe('listIncomingInvites', () => {
  it('returns empty array when there are no pending invites', async () => {
    const q = chain({ data: [], error: null });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    expect(await listIncomingInvites('alice@example.com')).toEqual([]);
  });

  it('attaches group name to each invite', async () => {
    const invitesQ = chain({
      data: [{ id: 'inv-1', group_id: 'g-1', email: 'alice@example.com', invitee_name: 'Alice', status: 'pending', created_at: '2026-01-01' }],
      error: null,
    });
    const groupsQ = chain({ data: [{ id: 'g-1', name: 'Crew' }], error: null });
    mockRequireSupabase.mockReturnValue({
      from: vi.fn().mockReturnValueOnce(invitesQ).mockReturnValueOnce(groupsQ),
    } as any);

    const result = await listIncomingInvites('alice@example.com');
    expect(result[0].groupName).toBe('Crew');
    expect(result[0].status).toBe('pending');
  });

  it('throws when invite query fails', async () => {
    const q = chain({ data: null, error: { message: 'not allowed' } });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await expect(listIncomingInvites('alice@example.com')).rejects.toEqual({ message: 'not allowed' });
  });
});

// ─── createGroup ─────────────────────────────────────────────────────────────

describe('createGroup', () => {
  it('returns the new group id', async () => {
    const profilesQ = chain({ data: null, error: null });
    const groupsQ = chain({ data: { id: 'g-new' }, error: null });
    const membersQ = chain({ data: null, error: null });

    mockRequireSupabase.mockReturnValue({
      from: vi.fn()
        .mockReturnValueOnce(profilesQ)
        .mockReturnValueOnce(groupsQ)
        .mockReturnValueOnce(membersQ),
    } as any);

    expect(await createGroup(mockUser, 'Weekend Crew')).toBe('g-new');
  });

  it('trims whitespace from group name', async () => {
    const profilesQ = chain({ data: null, error: null });
    const groupsQ = chain({ data: { id: 'g-new' }, error: null });
    const membersQ = chain({ data: null, error: null });

    mockRequireSupabase.mockReturnValue({
      from: vi.fn()
        .mockReturnValueOnce(profilesQ)
        .mockReturnValueOnce(groupsQ)
        .mockReturnValueOnce(membersQ),
    } as any);

    await createGroup(mockUser, '  Crew  ');
    expect(groupsQ.insert).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Crew' }),
    );
  });

  it('throws when group insert fails', async () => {
    const profilesQ = chain({ data: null, error: null });
    const groupsQ = chain({ data: null, error: { message: 'insert failed' } });

    mockRequireSupabase.mockReturnValue({
      from: vi.fn()
        .mockReturnValueOnce(profilesQ)
        .mockReturnValueOnce(groupsQ),
    } as any);

    await expect(createGroup(mockUser, 'Crew')).rejects.toEqual({ message: 'insert failed' });
  });
});

// ─── joinGroupByInviteCode ────────────────────────────────────────────────────

describe('joinGroupByInviteCode', () => {
  it('returns groupId and groupName on success', async () => {
    const profilesQ = chain({ data: null, error: null });
    const rpc = vi.fn().mockResolvedValue({
      data: [{ group_id: 'g-1', group_name: 'Crew' }],
      error: null,
    });
    mockRequireSupabase.mockReturnValue({
      from: vi.fn(() => profilesQ),
      rpc,
    } as any);

    const result = await joinGroupByInviteCode(mockUser, 'ABC123');
    expect(result).toEqual({ groupId: 'g-1', groupName: 'Crew' });
  });

  it('normalises the invite code to lowercase before calling RPC', async () => {
    const profilesQ = chain({ data: null, error: null });
    const rpc = vi.fn().mockResolvedValue({
      data: [{ group_id: 'g-1', group_name: 'Crew' }],
      error: null,
    });
    mockRequireSupabase.mockReturnValue({
      from: vi.fn(() => profilesQ),
      rpc,
    } as any);

    await joinGroupByInviteCode(mockUser, 'ABC123');
    expect(rpc).toHaveBeenCalledWith('join_group_by_invite_code', { p_invite_code: 'abc123' });
  });

  it('throws a clear message when RPC returns no row', async () => {
    const profilesQ = chain({ data: null, error: null });
    const rpc = vi.fn().mockResolvedValue({ data: [], error: null });
    mockRequireSupabase.mockReturnValue({
      from: vi.fn(() => profilesQ),
      rpc,
    } as any);

    await expect(joinGroupByInviteCode(mockUser, 'bad')).rejects.toThrow(
      'invalid or no longer works',
    );
  });

  it('throws when RPC returns an error', async () => {
    const profilesQ = chain({ data: null, error: null });
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'rpc error' } });
    mockRequireSupabase.mockReturnValue({
      from: vi.fn(() => profilesQ),
      rpc,
    } as any);

    await expect(joinGroupByInviteCode(mockUser, 'abc')).rejects.toEqual({ message: 'rpc error' });
  });
});

// ─── acceptInvite ─────────────────────────────────────────────────────────────

describe('acceptInvite', () => {
  it('upserts membership and marks invite as accepted', async () => {
    const profilesQ = chain({ data: null, error: null });
    const inviteQ = chain({ data: { id: 'inv-1', group_id: 'g-1', status: 'pending' }, error: null });
    const membersQ = chain({ data: null, error: null });
    const updateQ = chain({ data: null, error: null });

    mockRequireSupabase.mockReturnValue({
      from: vi.fn()
        .mockReturnValueOnce(profilesQ)
        .mockReturnValueOnce(inviteQ)
        .mockReturnValueOnce(membersQ)
        .mockReturnValueOnce(updateQ),
    } as any);

    const groupId = await acceptInvite(mockUser, 'inv-1');
    expect(groupId).toBe('g-1');
    expect(membersQ.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ group_id: 'g-1', role: 'member', user_id: 'user-1' }),
    );
  });

  it('skips the status update when invite is already accepted', async () => {
    const profilesQ = chain({ data: null, error: null });
    const inviteQ = chain({ data: { id: 'inv-1', group_id: 'g-1', status: 'accepted' }, error: null });
    const membersQ = chain({ data: null, error: null });
    const fromMock = vi.fn()
      .mockReturnValueOnce(profilesQ)
      .mockReturnValueOnce(inviteQ)
      .mockReturnValueOnce(membersQ);
    mockRequireSupabase.mockReturnValue({ from: fromMock } as any);

    await acceptInvite(mockUser, 'inv-1');
    // only 3 from() calls — no 4th for the status update
    expect(fromMock).toHaveBeenCalledTimes(3);
  });
});

// ─── inviteMember ─────────────────────────────────────────────────────────────

describe('inviteMember', () => {
  it('upserts an invite with lowercased email', async () => {
    const q = chain({ data: null, error: null });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await inviteMember('g-1', 'BOB@Example.com', 'Bob');

    expect(q.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'bob@example.com', group_id: 'g-1' }),
      expect.anything(),
    );
  });

  it('stores null for blank invitee name', async () => {
    const q = chain({ data: null, error: null });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await inviteMember('g-1', 'bob@example.com', '   ');

    expect(q.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ invitee_name: null }),
      expect.anything(),
    );
  });

  it('throws when upsert fails', async () => {
    const q = chain({ data: null, error: { message: 'conflict' } });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await expect(inviteMember('g-1', 'bob@example.com', 'Bob')).rejects.toEqual({ message: 'conflict' });
  });
});

// ─── setAvailability ─────────────────────────────────────────────────────────

describe('setAvailability', () => {
  it('upserts a slot when available is true', async () => {
    const q = chain({ data: null, error: null });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await setAvailability('g-1', 'user-1', '2026-06-10', 2, '18:00', '19:00', true);

    expect(q.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ group_id: 'g-1', user_id: 'user-1', slot_date: '2026-06-10', slot_index: 2 }),
      expect.anything(),
    );
  });

  it('deletes the slot when available is false', async () => {
    const q = chain({ data: null, error: null });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await setAvailability('g-1', 'user-1', '2026-06-10', 2, '18:00', '19:00', false);

    expect(q.delete).toHaveBeenCalled();
    expect(q.match).toHaveBeenCalledWith(
      expect.objectContaining({ group_id: 'g-1', user_id: 'user-1', slot_date: '2026-06-10', slot_index: 2 }),
    );
  });
});

// ─── clearAvailabilityRange ───────────────────────────────────────────────────

describe('clearAvailabilityRange', () => {
  it('deletes slots within the given date range', async () => {
    const q = chain({ data: null, error: null });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await clearAvailabilityRange('g-1', 'user-1', '2026-06-09', '2026-06-15');

    expect(q.delete).toHaveBeenCalled();
    expect(q.gte).toHaveBeenCalledWith('slot_date', '2026-06-09');
    expect(q.lte).toHaveBeenCalledWith('slot_date', '2026-06-15');
  });

  it('throws when delete fails', async () => {
    const q = chain({ data: null, error: { message: 'delete failed' } });
    mockRequireSupabase.mockReturnValue({ from: vi.fn(() => q) } as any);

    await expect(clearAvailabilityRange('g-1', 'user-1', '2026-06-09', '2026-06-15')).rejects.toEqual({ message: 'delete failed' });
  });
});
