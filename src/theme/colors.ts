/**
 * Friend-color palette, referenced as CSS custom properties so that the
 * alternate themes in `tokens.css` recolor every visual automatically.
 */
export const palette = {
  coral: 'var(--coral)',
  violet: 'var(--violet)',
  sky: 'var(--sky)',
  pink: 'var(--pink)',
  sun: 'var(--sun)',
  mint: 'var(--mint)',
  free: 'var(--free)',
  ink: 'var(--ink)',
} as const;

export type PaletteColor = (typeof palette)[keyof typeof palette];
