import Button from '../ui/Button';
import Confetti from '../visuals/Confetti';
import styles from './ClosingCTA.module.css';

/** Closing call-to-action: a dark confetti-filled card with the final pitch. */
export default function ClosingCTA() {
  return (
    <section className={styles.band} id="start">
      <div className="wrap">
        <div className={`reveal ${styles.card}`}>
          <Confetti />
          <h2>
            Stop saying
            <br />
            "we should hang out."
          </h2>
          <p>
            Start a group, share the link, and find your next free night in under two minutes.
          </p>
          <div className={styles.actions}>
            <Button href="#" variant="primary" size="lg" onDark>
              Create your group →
            </Button>
            <Button href="#how" size="lg" onDark>
              See how it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
