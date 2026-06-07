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

## Supabase setup

1. Enable Email/Password auth in your Supabase project.
2. Apply the SQL migration in [supabase/migrations/20260607170000_initialize_free_together.sql](/C:/Users/alex/Desktop/Coding%20Projects/free-together/supabase/migrations/20260607170000_initialize_free_together.sql:1).
3. Use your project URL and publishable key in the Vite env file.

The migration creates:

- `profiles`
- `groups`
- `group_members`
- `group_invites`
- `availability_slots`

It also enables RLS and installs policies so users can only access their own groups, invites, and availability.

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
