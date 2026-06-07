import { overlapBars } from '../../data/steps';
import styles from './OverlapViz.module.css';

/** Step 3 visual: everyone's availability bars with the shared "all free"
 *  window highlighted. */
export default function OverlapViz() {
  return (
    <div className={styles.overlap}>
      <div className={styles.bars}>
        {overlapBars.map((b, i) => (
          <div key={i} className={styles.bar}>
            <i style={{ background: b.color, left: `${b.left}%`, width: `${b.width}%` }} />
          </div>
        ))}
        <div className={styles.freeCol}>
          <span>all free</span>
        </div>
      </div>
    </div>
  );
}
