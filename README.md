# Free Together

Free Together is a React + TypeScript + Vite app for finding real overlap across friend groups. It now uses Supabase for authentication, group membership, invites, and saved availability.

## Tech stack

- React 18 + TypeScript
- Vite
- Supabase Auth + Postgres
- Plain CSS with global design tokens in `src/styles/tokens.css`

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

## Supabase setup (hosted project)

1. Enable Email/Password auth in your Supabase project under **Authentication → Providers → Email**.
2. Run every file in `supabase/migrations/` against your project in order (oldest timestamp first) via the Supabase SQL editor or the CLI push command.
3. Copy your project URL and publishable key into `.env.local`.

The migrations create:

- `profiles` — synced from Supabase Auth on sign-up
- `groups` — each group has a unique 10-char invite code
- `group_members` — tracks role (`owner` / `member`) per group
- `group_invites` — email-based invites with `pending` / `accepted` / `revoked` status
- `availability_slots` — per-user, per-group time blocks

RLS is enabled on every table. Users can only read and write data that belongs to their own groups.

## Local Supabase development

Running Supabase locally lets you develop and test without touching the hosted project. You need [Docker](https://www.docker.com/) and the [Supabase CLI](https://supabase.com/docs/guides/cli) installed.

### Start the local stack

```bash
supabase start
```

This boots Postgres, Auth, Storage, and the local Studio UI. On first run it pulls Docker images — takes a few minutes. Subsequent starts are fast.

The CLI prints your local credentials when it finishes:

```
API URL:   http://127.0.0.1:54321
anon key:  <local-anon-key>
```

### Point the app at local Supabase

Add a `.env.local.local` file (or temporarily edit `.env.local`) with the local values:

```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<local-anon-key>
```

### Apply migrations

```bash
supabase db reset
```

This drops and recreates the local database and runs every file in `supabase/migrations/` in order. Run it any time you add a new migration.

To apply only new migrations without resetting:

```bash
supabase migration up
```

### Test auth locally

The local stack runs a full Auth server. Sign-up confirmation emails are captured by Inbucket (a local mail catcher) at:

```
http://127.0.0.1:54324
```

Open that URL in a browser to see and click any confirmation links without needing a real email account.

### Push a new migration to the hosted project

After testing locally, push migrations to the hosted project:

```bash
supabase db push
```

### Stop the local stack

```bash
supabase stop
```

## Running tests

```bash
npm run test           # watch mode
npm run test:coverage  # single run with coverage report
```

Tests mock the Supabase client — no database connection needed.

## Manual edge case checklist

Run these checks against the hosted project with two separate browser sessions (or two different browsers) logged in as different accounts.

### Duplicate invite

1. As User A (owner), invite User B's email to a group.
2. Invite the same email again without accepting the first invite.
3. **Expected:** the second invite upserts over the first — only one pending invite exists per email per group (enforced by the `unique (group_id, email)` constraint).

### Duplicate membership via invite link

1. As User B, open the group invite link and join.
2. Open the same link a second time.
3. **Expected:** second join silently succeeds with no duplicate row (`ON CONFLICT DO NOTHING` in the RPC).

### Invalid invite code

1. Navigate to `/#/join/BADCODE` in the browser.
2. **Expected:** the app shows a clear error — "This invite link is invalid or no longer works."

### Joining the same group twice via email invite

1. As User A, invite User B by email.
2. As User B, accept the invite from the dashboard.
3. Accept it again (e.g. via a stale notification).
4. **Expected:** second accept silently succeeds — `upsert` on `group_members` is idempotent.

### Non-member trying to read group data

1. As User C (not a member of the group), obtain a valid group ID.
2. Query `group_members`, `group_invites`, or `availability_slots` directly via the Supabase REST API with User C's token.
3. **Expected:** all queries return empty results — RLS blocks access for non-members.

## Project structure

```text
src/
  components/
    app/                      signed-in dashboard
    auth/                     auth screen and form
    layout/, sections/, ui/   marketing + shared UI
  hooks/
    useAuthRoute.ts
    useSupabaseSession.ts
  lib/
    appData.ts                Supabase queries and mutations
    calendar.ts               seven-day calendar window builder
    supabase.ts               browser client setup
  styles/
    tokens.css
supabase/
  migrations/
```
