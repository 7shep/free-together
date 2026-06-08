import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { User } from '@supabase/supabase-js';
import AppHome from '../components/app/AppHome';

vi.mock('../lib/appData', () => ({
  createGroup: vi.fn(),
  acceptInvite: vi.fn(),
  setAvailability: vi.fn(),
  clearAvailabilityRange: vi.fn(),
  listMyGroups: vi.fn(),
  listIncomingInvites: vi.fn(),
  loadGroupSnapshot: vi.fn(),
  inviteMember: vi.fn(),
  joinGroupByInviteCode: vi.fn(),
}));

vi.mock('../lib/supabase', () => ({
  requireSupabase: vi.fn(() => ({ auth: { signOut: vi.fn().mockResolvedValue({}) } })),
  isSupabaseConfigured: true,
  supabase: null,
}));

import {
  createGroup,
  acceptInvite,
  setAvailability,
  clearAvailabilityRange,
  inviteMember,
  listMyGroups,
  listIncomingInvites,
  loadGroupSnapshot,
} from '../lib/appData';

const mockListMyGroups = vi.mocked(listMyGroups);
const mockListIncomingInvites = vi.mocked(listIncomingInvites);
const mockLoadGroupSnapshot = vi.mocked(loadGroupSnapshot);
const mockCreateGroup = vi.mocked(createGroup);
const mockAcceptInvite = vi.mocked(acceptInvite);
const mockSetAvailability = vi.mocked(setAvailability);
const mockClearAvailabilityRange = vi.mocked(clearAvailabilityRange);
const mockInviteMember = vi.mocked(inviteMember);

const mockUser: User = {
  id: 'user-1',
  email: 'alice@example.com',
  user_metadata: { full_name: 'Alice' },
  app_metadata: {},
  aud: 'authenticated',
  created_at: '2026-01-01T00:00:00Z',
} as User;

const mockGroup = {
  id: 'g-1',
  name: 'Weekend Crew',
  inviteCode: 'abc123',
  createdBy: 'user-1',
  createdAt: '2026-01-01',
  role: 'owner' as const,
};

const emptySnapshot = {
  availability: [],
  invites: [],
  members: [{ userId: 'user-1', email: 'alice@example.com', fullName: 'Alice', role: 'owner' as const }],
};

beforeEach(() => {
  vi.clearAllMocks();
  mockListMyGroups.mockResolvedValue([]);
  mockListIncomingInvites.mockResolvedValue([]);
  mockLoadGroupSnapshot.mockResolvedValue(emptySnapshot);
  vi.stubGlobal('scrollTo', vi.fn());
});

describe('AppHome - create group', () => {
  it('calls createGroup with the typed name and shows a success notice', async () => {
    mockCreateGroup.mockResolvedValue('g-1');
    mockListMyGroups.mockResolvedValueOnce([]).mockResolvedValue([mockGroup]);

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockListMyGroups).toHaveBeenCalled());

    await userEvent.type(screen.getByLabelText('Create a new group'), 'Weekend Crew');
    await userEvent.click(screen.getByRole('button', { name: 'Create group' }));

    await waitFor(() => {
      expect(mockCreateGroup).toHaveBeenCalledWith(mockUser, 'Weekend Crew');
    });
    await waitFor(() => {
      expect(screen.getByText(/Group created/)).toBeInTheDocument();
    });
  });

  it('does not call createGroup when the name is blank', async () => {
    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockListMyGroups).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: 'Create group' }));

    expect(mockCreateGroup).not.toHaveBeenCalled();
  });

  it('shows an error notice when createGroup fails', async () => {
    mockCreateGroup.mockRejectedValue(new Error('DB unavailable'));

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockListMyGroups).toHaveBeenCalled());

    await userEvent.type(screen.getByLabelText('Create a new group'), 'Crew');
    await userEvent.click(screen.getByRole('button', { name: 'Create group' }));

    await waitFor(() => {
      expect(screen.getByText('DB unavailable')).toBeInTheDocument();
    });
  });
});

describe('AppHome - accept invite', () => {
  it('calls acceptInvite with the correct invite id', async () => {
    mockListIncomingInvites.mockResolvedValue([
      {
        id: 'inv-1',
        groupId: 'g-2',
        groupName: 'Summer Crew',
        email: 'alice@example.com',
        inviteeName: 'Alice',
        status: 'pending',
        createdAt: '2026-01-01',
      },
    ]);
    mockAcceptInvite.mockResolvedValue('g-2');
    mockListMyGroups.mockResolvedValueOnce([]).mockResolvedValue([{ ...mockGroup, id: 'g-2', name: 'Summer Crew' }]);

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: 'Accept' }));

    await waitFor(() => {
      expect(mockAcceptInvite).toHaveBeenCalledWith(mockUser, 'inv-1');
    });
  });

  it('shows a success notice after accepting', async () => {
    mockListIncomingInvites.mockResolvedValue([
      {
        id: 'inv-1',
        groupId: 'g-2',
        groupName: 'Summer Crew',
        email: 'alice@example.com',
        inviteeName: null,
        status: 'pending',
        createdAt: '2026-01-01',
      },
    ]);
    mockAcceptInvite.mockResolvedValue('g-2');
    mockListMyGroups.mockResolvedValue([]);

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: 'Accept' }));

    await waitFor(() => {
      expect(screen.getByText(/Invite accepted/)).toBeInTheDocument();
    });
  });

  it('shows an error notice when acceptInvite fails', async () => {
    mockListIncomingInvites.mockResolvedValue([
      {
        id: 'inv-1',
        groupId: 'g-2',
        groupName: 'Summer Crew',
        email: 'alice@example.com',
        inviteeName: null,
        status: 'pending',
        createdAt: '2026-01-01',
      },
    ]);
    mockAcceptInvite.mockRejectedValue(new Error('Already a member'));

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: 'Accept' }));

    await waitFor(() => {
      expect(screen.getByText('Already a member')).toBeInTheDocument();
    });
  });
});

describe('AppHome - invite modal', () => {
  it('opens the invite flow in a modal from the topbar button', async () => {
    mockListMyGroups.mockResolvedValue([mockGroup]);

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockLoadGroupSnapshot).toHaveBeenCalled());

    expect(screen.queryByRole('dialog', { name: 'Invite to Weekend Crew' })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Invite' }));

    expect(screen.getByRole('dialog', { name: 'Invite to Weekend Crew' })).toBeInTheDocument();
    expect(screen.getByLabelText('Share this invite link')).toBeInTheDocument();
  });

  it('submits the saved email invite from the modal', async () => {
    mockListMyGroups.mockResolvedValue([mockGroup]);
    mockInviteMember.mockResolvedValue(undefined);

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockLoadGroupSnapshot).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: 'Invite' }));
    await userEvent.type(screen.getByLabelText('Save an email invite too'), 'Bob');
    await userEvent.type(screen.getByPlaceholderText('friend@email.com'), 'bob@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Save email invite' }));

    await waitFor(() => {
      expect(mockInviteMember).toHaveBeenCalledWith('g-1', 'bob@example.com', 'Bob');
    });
  });
});

describe('AppHome - toggle availability', () => {
  it('calls setAvailability when Add to my schedule is clicked', async () => {
    mockListMyGroups.mockResolvedValue([mockGroup]);
    mockSetAvailability.mockResolvedValue(undefined);

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockLoadGroupSnapshot).toHaveBeenCalledWith('g-1', expect.any(String), expect.any(String)));

    await userEvent.click(screen.getByRole('button', { name: '+ Add time' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add to my schedule' }));

    await waitFor(() => {
      expect(mockSetAvailability).toHaveBeenCalledWith(
        'g-1',
        'user-1',
        expect.any(String),
        expect.any(Number),
        expect.any(String),
        expect.any(String),
        true,
      );
    });
  });

  it('shows a toast when the slot is already on the schedule', async () => {
    mockListMyGroups.mockResolvedValue([mockGroup]);
    mockLoadGroupSnapshot.mockResolvedValue({
      ...emptySnapshot,
      availability: [],
    });
    mockSetAvailability.mockResolvedValue(undefined);

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockLoadGroupSnapshot).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: '+ Add time' }));
    await userEvent.click(screen.getByRole('button', { name: 'Add to my schedule' }));

    await waitFor(() => expect(mockSetAvailability).toHaveBeenCalled());
  });
});

describe('AppHome - clear week', () => {
  it('calls clearAvailabilityRange with the correct group and user ids', async () => {
    mockListMyGroups.mockResolvedValue([mockGroup]);
    mockClearAvailabilityRange.mockResolvedValue(undefined);

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockLoadGroupSnapshot).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: '+ Add time' }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear my week' }));

    await waitFor(() => {
      expect(mockClearAvailabilityRange).toHaveBeenCalledWith(
        'g-1',
        'user-1',
        expect.any(String),
        expect.any(String),
      );
    });
  });

  it('shows a success notice after clearing', async () => {
    mockListMyGroups.mockResolvedValue([mockGroup]);
    mockClearAvailabilityRange.mockResolvedValue(undefined);

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockLoadGroupSnapshot).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: '+ Add time' }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear my week' }));

    await waitFor(() => {
      expect(screen.getByText(/availability for this week was cleared/)).toBeInTheDocument();
    });
  });

  it('shows an error notice when clearAvailabilityRange fails', async () => {
    mockListMyGroups.mockResolvedValue([mockGroup]);
    mockClearAvailabilityRange.mockRejectedValue(new Error('Delete failed'));

    render(<AppHome user={mockUser} />);
    await waitFor(() => expect(mockLoadGroupSnapshot).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: '+ Add time' }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear my week' }));

    await waitFor(() => {
      expect(screen.getByText('Delete failed')).toBeInTheDocument();
    });
  });
});
