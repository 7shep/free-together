import { palette as c } from '../theme/colors';

/** Text content for the three "How it works" steps. The visual for each step
 *  is wired up in the section component since each one is bespoke. */
export const steps = [
  {
    num: 1,
    color: c.coral,
    title: 'Start a group',
    desc: 'Spin up a crew and share one link. Friends hop in — no accounts to chase down.',
  },
  {
    num: 2,
    color: c.violet,
    title: 'Drop in your schedule',
    desc: 'Block out work, class, the gym — whatever keeps you busy. Takes about a minute.',
  },
  {
    num: 3,
    color: c.mint,
    title: 'See your free windows',
    desc: "We highlight the moments everyone's actually open. Pick one and go make plans.",
  },
] as const;
