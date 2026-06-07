/**
 * Icons used only by the auth screen: the back chevron, social-provider marks,
 * the email-field glyphs, and the "remember me" check. Field icons draw with
 * `currentColor` so they inherit the muted input color; the Google mark keeps
 * its brand colors.
 */

/** Chevron in the top-left "Back" link. */
export function BackChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M11 4l-5 5 5 5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Google "G" mark for the social sign-in button. */
export function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M19.6 10.23c0-.68-.06-1.36-.18-2.02H10v3.82h5.4a4.62 4.62 0 0 1-2 3.03v2.51h3.24c1.9-1.75 2.96-4.33 2.96-7.34z"
        fill="#4285F4"
      />
      <path
        d="M10 20c2.7 0 4.96-.9 6.62-2.43l-3.24-2.51c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H1.07v2.59A10 10 0 0 0 10 20z"
        fill="#34A853"
      />
      <path d="M4.41 11.9a6 6 0 0 1 0-3.8V5.51H1.07a10 10 0 0 0 0 8.98l3.34-2.59z" fill="#FBBC05" />
      <path
        d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87A10 10 0 0 0 1.07 5.51L4.4 8.1C5.2 5.74 7.4 3.98 10 3.98z"
        fill="#EA4335"
      />
    </svg>
  );
}

/** Apple mark for the social sign-in button. */
export function AppleIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M16.5 15.3c-.3.7-.66 1.34-1.08 1.93-.57.81-1.04 1.37-1.4 1.68-.56.51-1.16.78-1.8.8-.46 0-1.02-.13-1.66-.4-.65-.26-1.24-.39-1.79-.39-.57 0-1.18.13-1.83.4-.65.26-1.18.4-1.58.42-.62.02-1.23-.25-1.83-.82-.4-.34-.88-.92-1.46-1.74-.62-.87-1.13-1.89-1.53-3.05-.43-1.25-.64-2.47-.64-3.65 0-1.35.29-2.51.88-3.49a5.16 5.16 0 0 1 1.83-1.85 4.9 4.9 0 0 1 2.48-.7c.49 0 1.13.15 1.94.44.8.3 1.32.45 1.54.45.17 0 .74-.18 1.72-.53.92-.32 1.7-.46 2.34-.4 1.73.13 3.03.81 3.89 2.04-1.55.94-2.32 2.25-2.3 3.94.01 1.31.49 2.4 1.42 3.27.42.4.9.71 1.42.93-.11.33-.23.64-.36.94zM12.9.4c0 .99-.36 1.92-1.08 2.78-.86 1.02-1.91 1.61-3.04 1.52a3.06 3.06 0 0 1-.02-.38c0-.95.41-1.97 1.15-2.8.37-.43.84-.78 1.41-1.06.57-.27 1.1-.42 1.61-.45.01.13.02.26.02.39z"
        fill="var(--ink)"
      />
    </svg>
  );
}

/** Person glyph for the "Your name" field. */
export function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M3 15c0-2.8 2.7-5 6-5s6 2.2 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Envelope glyph for the email field. */
export function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="3.5" width="14" height="11" rx="2.2" stroke="currentColor" strokeWidth="2" />
      <path d="M3 5l6 4.2L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Padlock glyph for the password field. */
export function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="3" y="8" width="12" height="7" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M6 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** White check inside the filled "remember me" box. */
export function CheckSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
      <path
        d="M2.5 6.8l2.6 2.6L10.5 4"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
