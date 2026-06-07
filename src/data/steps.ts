import { palette as c } from '../theme/colors';

/** A schedule block in the step-2 "drop in your schedule" mini-grid. */
export interface SchedBlock {
  top: number;
  height: number;
  color: string;
}

/** Five columns of busy blocks for the step-2 visual. */
export const scheduleCols: SchedBlock[][] = [
  [
    { top: 10, height: 30, color: c.coral },
    { top: 60, height: 24, color: c.sky },
  ],
  [{ top: 20, height: 40, color: c.violet }],
  [
    { top: 8, height: 24, color: c.sky },
    { top: 50, height: 34, color: c.coral },
  ],
  [{ top: 30, height: 36, color: c.pink }],
  [
    { top: 12, height: 28, color: c.violet },
    { top: 60, height: 26, color: c.sun },
  ],
];

/** Overlapping availability bars for the step-3 "see your free windows" visual. */
export const overlapBars = [
  { color: c.coral, left: 6, width: 38 },
  { color: c.violet, left: 18, width: 30 },
  { color: c.sky, left: 2, width: 44 },
];
