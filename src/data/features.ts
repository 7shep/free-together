/** Accent colour for a feature card; also selects its icon. */
export type FeatureColor = 'mint' | 'sun' | 'sky' | 'pink' | 'violet';

export interface FeatureItem {
  color: FeatureColor;
  size: 'big' | 'small';
  title: string;
  desc: string;
}

export const features: FeatureItem[] = [
  {
    color: 'mint',
    size: 'big',
    title: "Everyone's calendar, stacked in one view",
    desc: 'See all your schedules overlaid at once. The free gaps light up instantly — no mental math required.',
  },
  {
    color: 'sun',
    size: 'small',
    title: 'Always up to date',
    desc: "Change your hours and everyone's free windows recalculate on the spot.",
  },
  {
    color: 'sky',
    size: 'small',
    title: 'No accounts to chase',
    desc: 'One link gets your whole crew in. Friends just tap and add their times.',
  },
  {
    color: 'pink',
    size: 'small',
    title: 'Protects your downtime',
    desc: 'Mark times as off-limits. We only suggest windows that work for real.',
  },
  {
    color: 'violet',
    size: 'small',
    title: 'Nudge the group',
    desc: 'Found a window? Send a one-tap "let\'s do this" so plans actually happen.',
  },
];
