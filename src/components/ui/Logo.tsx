interface LogoProps {
  width?: number;
  height?: number;
}

/** The Free Together brand mark: two overlapping friend-circles with a green
 *  "free together" overlap in the middle. */
export default function Logo({ width = 38, height = 32 }: LogoProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 38 32" fill="none" aria-hidden="true">
      <circle cx="13" cy="16" r="11" fill="var(--coral)" stroke="var(--ink)" strokeWidth="2.5" />
      <circle cx="25" cy="16" r="11" fill="var(--sky)" stroke="var(--ink)" strokeWidth="2.5" />
      <path
        d="M19 7.2A11 11 0 0 1 19 24.8 11 11 0 0 1 19 7.2Z"
        fill="var(--free)"
        stroke="var(--ink)"
        strokeWidth="2.5"
      />
    </svg>
  );
}
