import type { ReactNode } from 'react';
import { steps } from '../../data/steps-content';
import SectionHead from '../ui/SectionHead';
import InviteViz from '../visuals/InviteViz';
import OverlapViz from '../visuals/OverlapViz';
import ScheduleViz from '../visuals/ScheduleViz';
import styles from './HowItWorks.module.css';

interface StepProps {
  num: number;
  color: string;
  title: string;
  desc: string;
  children: ReactNode;
}

function Step({ num, color, title, desc, children }: StepProps) {
  return (
    <div className={`reveal ${styles.step}`}>
      <span className={styles.num} style={{ background: color }}>
        {num}
      </span>
      <div className={styles.viz}>{children}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

const visuals = [<InviteViz />, <ScheduleViz />, <OverlapViz />];

/** "How it works" — three numbered steps, each with a bespoke mini-visual. */
export default function HowItWorks() {
  return (
    <section className={styles.how} id="how">
      <div className="wrap">
        <SectionHead
          kicker="How it works"
          title="Three taps to a plan"
          sub={'No spreadsheets. No "does Tuesday work for everyone?" times forty messages.'}
        />
        <div className={styles.steps}>
          {steps.map((s, i) => (
            <Step key={s.num} num={s.num} color={s.color} title={s.title} desc={s.desc}>
              {visuals[i]}
            </Step>
          ))}
        </div>
      </div>
    </section>
  );
}
