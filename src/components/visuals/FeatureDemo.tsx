import { palette as c } from '../../theme/colors';
import styles from './FeatureDemo.module.css';

const dim = (color: string) => `color-mix(in srgb, ${color} 30%, transparent)`;
const dimFree = `color-mix(in srgb, ${c.free} 22%, transparent)`;

/** Three friends' schedule stacks plus the highlighted "all free" column, shown
 *  inside the big "stacked in one view" feature card. */
const columns = [
  { name: 'Maya', free: false, blocks: [c.coral, dim(c.coral), c.coral] },
  { name: 'Theo', free: false, blocks: [dim(c.violet), c.violet, c.violet] },
  { name: 'Jess', free: false, blocks: [c.sky, c.sky, dim(c.sky)] },
  { name: 'All free', free: true, blocks: [dimFree, c.free, dimFree] },
];

export default function FeatureDemo() {
  return (
    <div className={styles.demo} aria-hidden="true">
      {columns.map((col) => (
        <div key={col.name} className={styles.col}>
          <div className={col.free ? `${styles.stack} ${styles.freeStack}` : styles.stack}>
            {col.blocks.map((bg, i) => (
              <i key={i} style={{ background: bg }} />
            ))}
          </div>
          <span className={col.free ? `${styles.name} ${styles.freeName}` : styles.name}>
            {col.name}
          </span>
        </div>
      ))}
    </div>
  );
}
