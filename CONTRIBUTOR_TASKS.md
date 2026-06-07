# Contributor Task Split

This project already has the core flow wired up:

- Supabase auth works
- users can create groups
- users can join by invite link
- users can save weekly availability
- the dashboard shows overlap across members

The best next step is to split improvement work into one frontend-heavy track and one backend-quality track.

## Person 1: Frontend UX and Product Polish -- RHYS

**Recommended branch:** `feat/dashboard-ux-polish`

### Tasks

1. Improve the dashboard mobile layout so the sidebar, calendar, and top bar stay usable on smaller screens.
2. Tighten the empty, loading, and error states in the signed-in flow so every panel explains what the user should do next.
3. Make the invite flow clearer:
   - explain the difference between "copy invite link" and "save email invite"
   - show success/error feedback closer to the form
   - make the pending invite list easier to scan
4. Improve the availability interaction:
   - make it easier to see which slots belong to "me" versus friends
   - make the "add time" and "clear week" actions more obvious
   - reduce visual clutter in the calendar when many members are visible
5. Polish the "Lock it in" flow so sharing a suggested time feels intentional and complete.
6. Add accessibility cleanup:
   - keyboard navigation for important actions
   - better button labels
   - clearer focus states
7. Clean up the remaining placeholder copy:
   - disabled social buttons
   - terms/privacy placeholder links
   - any rough text still left from prototyping

### How to test

1. Run `npm run typecheck`.
2. Run `npm run build`.
3. Run `npm run dev`.
4. Manually verify:
   - sign up
   - log in
   - create a group
   - copy/share an invite link
   - add and remove availability
   - hide/show members
   - open "Lock it in"
   - test desktop and narrow mobile widths

### Supabase changes

No schema change should be needed for this track.

Possible exception:

- if the UI adds a brand new user action that does not exist yet, check whether the current tables and RPC already support it before changing the database

## Person 2: Supabase Guardrails, Data Rules, and Test Coverage -- TRENT

**Recommended branch:** `feat/supabase-guardrails-and-tests`

### Tasks

1. Add automated test coverage for the data layer in [`src/lib/appData.ts`](/C:/Users/alex/Desktop/Coding%20Projects/free-together/src/lib/appData.ts:1).
2. Add component-level tests for the signed-in dashboard flow:
   - create group
   - accept invite
   - toggle availability
   - clear week
3. Add a proper test runner setup for the project if needed.
   - `vitest`
   - React Testing Library
   - basic mocking for Supabase client calls
4. Review and tighten business rules in Supabase:
   - decide whether any group member can create invites, or only owners
   - decide whether invite links should expire
   - decide whether invite links should be revocable from the UI
   - decide whether a user should be able to leave a group
5. If invite ownership rules need to change, update RLS policies and the client code together.
6. Add a small set of database-facing manual checks for:
   - duplicate invites
   - duplicate memberships
   - joining with an invalid code
   - joining the same group twice
   - non-members trying to read group data
7. Document the local Supabase workflow more clearly in the README:
   - how to start local Supabase
   - how to apply migrations
   - how to test auth and invites locally

### How to test

1. Run `npm run typecheck`.
2. Run `npm run build`.
3. Run the automated test suite you add.
4. Start the app locally and verify:
   - one user creates a group
   - a second user joins with the link
   - both users can see the same group
   - each user only edits their own availability
   - invalid invite codes fail cleanly
5. Re-run the full signed-in flow after any RLS or RPC change.

### Supabase changes

This track may need Supabase changes.

Most likely changes:

- a new migration if invite permissions or revoke/expiry behavior changes
- possible updates to `join_group_by_invite_code`
- possible RLS updates in `group_invites`, `group_members`, or `groups`

Current files to inspect before changing anything:

- [supabase/migrations/20260607170000_initialize_free_together.sql](/C:/Users/alex/Desktop/Coding%20Projects/free-together/supabase/migrations/20260607170000_initialize_free_together.sql:1)
- [supabase/migrations/20260607203000_add_join_group_by_invite_code.sql](/C:/Users/alex/Desktop/Coding%20Projects/free-together/supabase/migrations/20260607203000_add_join_group_by_invite_code.sql:1)
- [supabase/migrations/20260607213000_fix_recursive_rls_policies.sql](/C:/Users/alex/Desktop/Coding%20Projects/free-together/supabase/migrations/20260607213000_fix_recursive_rls_policies.sql:1)
- [supabase/migrations/20260607214500_allow_group_owner_to_select_new_group.sql](/C:/Users/alex/Desktop/Coding%20Projects/free-together/supabase/migrations/20260607214500_allow_group_owner_to_select_new_group.sql:1)

## Shared Notes

- There are no automated tests configured yet, so both contributors should treat `npm run typecheck` and `npm run build` as the minimum safety check.
- The existing `PLAN.md` is now behind the current codebase. Use this file as the working split unless you rewrite the plan.
- Prefer `feat/...` branch names for new work so branch naming stays consistent.
