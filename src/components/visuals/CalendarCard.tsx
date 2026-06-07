import { heroAvatars, weekDays } from '../../data/calendar';
import Avatar from '../ui/Avatar';
import AvatarStack from '../ui/AvatarStack';
import styles from './CalendarCard.module.css';

/** The hero visual: a week calendar with four friends' busy blocks and the
 *  glowing Friday "all free" window, plus a "lock it in" footer. */
export default function CalendarCard() {
  return (
    <div className={`reveal ${styles.calCard}`}>
      <div className={styles.calHead}>
        <div className={styles.calTitle}>
          This week <small>4 people · 1 perfect window</small>
        </div>
        <AvatarStack>
          {heroAvatars.map((a) => (
            <Avatar key={a.label} label={a.label} color={a.color} ring />
          ))}
        </AvatarStack>
      </div>

      <div className={styles.calGrid}>
        {weekDays.map((day, i) => (
          <div key={i} className={day.free ? `${styles.day} ${styles.isFree}` : styles.day}>
            <div className={styles.dl}>{day.label}</div>
            <div className={styles.track}>
              {day.free ? (
                <>
                  {/* A faint earlier commitment, for realism. */}
                  <div
                    className={styles.busy}
                    style={{
                      top: 8,
                      height: 30,
                      background: 'color-mix(in srgb, var(--ink) 12%, transparent)',
                    }}
                  />
                  <div className={styles.freeSlot} style={{ top: 70, height: 66 }}>
                    <span className={styles.star}>★</span>
                    <span className={styles.ft}>
                      7:30
                      <br />
                      PM
                    </span>
                  </div>
                </>
              ) : (
                day.busy?.map((b, j) => (
                  <div
                    key={j}
                    className={styles.busy}
                    style={{ top: b.top, height: b.height, background: b.color }}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.calFoot}>
        <span className={styles.ico}>🎉</span>
        <span className={styles.txt}>
          You're all free
          <small>Friday · 7:30 – 10:00 PM</small>
        </span>
        <span className={styles.go}>Lock it in</span>
      </div>
    </div>
  );
}
