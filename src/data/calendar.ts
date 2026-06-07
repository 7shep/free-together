import { palette as c } from '../theme/colors';

/** A coloured "busy" block on a day track, positioned in px within the track. */
export interface BusyBlock {
  top: number;
  height: number;
  color: string;
}

/** One column of the hero week calendar. */
export interface DayColumn {
  label: string;
  /** When true the day renders the glowing "free together" slot instead of busy blocks. */
  free?: boolean;
  busy?: BusyBlock[];
}

/** The four friends shown stacked in the hero calendar header. */
export const heroAvatars = [
  { label: 'M', color: c.coral },
  { label: 'T', color: c.violet },
  { label: 'J', color: c.sky },
  { label: 'Y', color: c.pink },
] as const;

/** Seven-day schedule shown in the hero calendar card. Friday is the free window. */
export const weekDays: DayColumn[] = [
  {
    label: 'M',
    busy: [
      { top: 6, height: 34, color: c.sky },
      { top: 58, height: 40, color: c.coral },
      { top: 120, height: 30, color: c.violet },
    ],
  },
  {
    label: 'T',
    busy: [
      { top: 10, height: 46, color: c.violet },
      { top: 74, height: 28, color: c.pink },
      { top: 120, height: 34, color: c.sky },
    ],
  },
  {
    label: 'W',
    busy: [
      { top: 4, height: 30, color: c.coral },
      { top: 44, height: 30, color: c.sky },
      { top: 90, height: 52, color: c.violet },
    ],
  },
  {
    label: 'T',
    busy: [
      { top: 14, height: 40, color: c.pink },
      { top: 68, height: 24, color: c.coral },
      { top: 110, height: 40, color: c.sky },
    ],
  },
  { label: 'F', free: true },
  {
    label: 'S',
    busy: [
      { top: 20, height: 60, color: c.sun },
      { top: 96, height: 40, color: c.coral },
    ],
  },
  {
    label: 'S',
    busy: [
      { top: 8, height: 40, color: c.violet },
      { top: 60, height: 30, color: c.pink },
      { top: 110, height: 42, color: c.sky },
    ],
  },
];
