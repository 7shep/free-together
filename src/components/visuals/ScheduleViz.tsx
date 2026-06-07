import { scheduleCols } from '../../data/steps';
import styles from './ScheduleViz.module.css';

/** Step 2 visual: a compact week of busy blocks being dropped in. */
export default function ScheduleViz() {
  return (
    <div className={styles.sched}>
      {scheduleCols.map((blocks, i) => (
        <div key={i} className={styles.col}>
          {blocks.map((b, j) => (
            <div
              key={j}
              className={styles.blk}
              style={{ top: b.top, height: b.height, background: b.color }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
