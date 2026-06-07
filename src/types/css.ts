import type { CSSProperties } from 'react';

/**
 * Inline style object that also permits CSS custom properties
 * (e.g. `--r`, `--ov`) used by the animated decorations.
 */
export type CSSVars = CSSProperties & Record<`--${string}`, string | number>;
