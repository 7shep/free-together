import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthForm from '../components/auth/AuthForm';
import { requireSupabase } from '../lib/supabase';

vi.mock('../lib/supabase', () => ({
  requireSupabase: vi.fn(),
  isSupabaseConfigured: true,
}));

const mockRequireSupabase = vi.mocked(requireSupabase);

describe('AuthForm signup redirects', () => {
  const signUp = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.location.hash = '#/auth';
    signUp.mockResolvedValue({ data: { session: null }, error: null });
    mockRequireSupabase.mockReturnValue({
      auth: {
        signUp,
      },
    } as any);
  });

  async function submitSignup() {
    render(<AuthForm mode="signup" onModeChange={vi.fn()} onSuccess={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('Your name'), 'Alice');
    await userEvent.type(screen.getByLabelText('Email'), 'alice@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Create your account' }));

    await waitFor(() => expect(signUp).toHaveBeenCalled());
  }

  it('keeps the join link in the email redirect when signing up from an invite', async () => {
    window.location.hash = '#/join/abc123';

    await submitSignup();

    expect(signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          emailRedirectTo: `${window.location.origin}${window.location.pathname}#/join/abc123`,
        }),
      }),
    );
  });

  it('falls back to the app route for normal signup', async () => {
    await submitSignup();

    expect(signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({
          emailRedirectTo: `${window.location.origin}${window.location.pathname}#/app`,
        }),
      }),
    );
  });
});
