/**
 * Small inline SVG icons used across the page. Strokes/fills reference CSS
 * custom properties so they recolour with the active theme. All are decorative
 * and marked `aria-hidden`.
 */

/** Green check used in the hero "free forever / no app / one link" meta row. */
export function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M5 10.5l3.2 3.2L15 6.5"
        stroke="var(--free)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Calendar — "everyone's calendar, stacked" feature. */
export function IconCalendar() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="20" height="18" rx="3" stroke="var(--ink)" strokeWidth="2.4" />
      <path d="M3 10h20M8 3v4M18 3v4" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="14.5" y="14" width="5" height="5" rx="1.2" fill="var(--ink)" />
    </svg>
  );
}

/** Sun — "always up to date" feature. */
export function IconSun() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M13 3v3M13 20v3M3 13h3M20 13h3M6 6l2 2M18 18l2 2M20 6l-2 2M8 18l-2 2"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="13" cy="13" r="5" stroke="var(--ink)" strokeWidth="2.4" />
    </svg>
  );
}

/** Check inside a circle — "no accounts to chase" feature. */
export function IconCheckCircle() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M9 13l3 3 6-7"
        stroke="var(--ink)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="13" cy="13" r="10" stroke="var(--ink)" strokeWidth="2.4" />
    </svg>
  );
}

/** Heart — "protects your downtime" feature. */
export function IconHeart() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M13 22S4 16 4 9.8C4 6.6 6.5 4.5 9.2 4.5c1.7 0 3.1.8 3.8 2 .7-1.2 2.1-2 3.8-2C19.5 4.5 22 6.6 22 9.8 22 16 13 22 13 22Z"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Outlined star — "nudge the group" feature. */
export function IconStarOutline() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <path
        d="M13 4l2.6 6.4L22 11l-5 4.4 1.6 6.6L13 18.5 7.4 22 9 15.4 4 11l6.4-.6z"
        fill="none"
        stroke="var(--ink)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Filled star sticker that bobs above the hero calendar. */
export function StickerStar() {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" aria-hidden="true">
      <path
        d="M23 4l4.5 11.4L39 17l-9 8 2.6 12L23 30.5 13.4 37 16 25l-9-8 11.5-1.6z"
        fill="var(--sun)"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Squiggle sticker that bobs near the hero calendar. */
export function StickerSquiggle() {
  return (
    <svg width="58" height="30" viewBox="0 0 58 30" fill="none" aria-hidden="true">
      <path
        d="M3 19C9 6 16 6 22 16s13 10 19-1 13-9 14 2"
        stroke="var(--violet)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
