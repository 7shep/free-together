# Free Together Plan

## Current State

- Frontend is in place.
- User authentication is implemented.
- The app is still missing the core product workflow that makes the signup/auth experience useful.

## Product Goal

Build the actual scheduling experience for friend groups: create a group, collect availability, find overlap, and make it easy to share the result.

## Work Split

### You

Focus on the product and user-facing experience.

- Finalize the core user flow from landing page to signed-in dashboard.
- Build the group creation and invite flow.
- Design the availability input experience.
- Make the overlap/results view clear and easy to understand.
- Handle edge cases in the UI, such as empty states, loading states, and errors.
- Keep the frontend polished and responsive.

### Your Friend

Focus on app infrastructure and data handling.

- Set up the backend data model for users, groups, invites, and availability.
- Wire up the auth session to the backend records.
- Implement APIs or database operations for creating groups and saving availability.
- Add permissions so only the right people can view and edit a group.
- Support invite links or codes.
- Add basic validation and security checks.

## Milestones

### 1. Core Data Model

Define the backend structures needed for the app.

- Users
- Groups
- Group members
- Invites
- Availability entries

### 2. Auth + Session Integration

Connect the existing auth flow to the app data.

- Create user records on first login.
- Load the signed-in user’s groups.
- Protect private routes and group data.

### 3. Group Creation and Invites

Let users start a new group and bring friends in.

- Create a group from the dashboard.
- Generate an invite link or code.
- Join a group from an invite.

### 4. Availability Collection

Let each member mark when they are free.

- Show a simple calendar or time-slot picker.
- Save availability per user and per group.
- Allow edits and removals.

### 5. Overlap Calculation

Show the times when everyone is free.

- Compute overlapping availability for the group.
- Highlight best meeting windows.
- Handle partial overlap and no-overlap states.

### 6. Sharing and Cleanup

Make the result easy to act on.

- Add a shareable summary view.
- Add export or copy-to-clipboard if useful.
- Polish loading, error, and empty states.

## Suggested Order

1. Lock the backend schema first.
2. Wire auth to the data layer.
3. Build group creation and invites.
4. Build availability input.
5. Add overlap logic and results UI.
6. Polish and test the full flow end to end.

## Coordination Rules

- Keep the data contract explicit before building UI against it.
- Prefer small, testable pieces over one large integration pass.
- Merge in vertical slices when possible so both frontend and backend stay usable.
- Use the same naming for groups, invites, and availability across the codebase.

## Definition of Done

- A signed-in user can create a group.
- A friend can join through an invite.
- Group members can submit availability.
- The app shows the overlapping free time clearly.
- The flow works end to end without manual database edits.

