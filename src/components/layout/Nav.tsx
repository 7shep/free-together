import { useNavScrolled } from '../../hooks/useNavScrolled';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import styles from './Nav.module.css';

/** Sticky top navigation. Gains a bottom border once the page is scrolled. */
export default function Nav() {
  const scrolled = useNavScrolled();

  return (
    <header className={scrolled ? `${styles.nav} ${styles.scrolled}` : styles.nav}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#top" className={styles.brand} aria-label="Free Together home">
          <Logo />
          Free Together
        </a>

        <nav className={styles.links}>
          <a href="#how" className={styles.link}>
            How it works
          </a>
          <a href="#features" className={styles.link}>
            Features
          </a>
        </nav>

        <div className={styles.cta}>
          <a href="#/auth/login" className={styles.link}>
            Log in
          </a>
          <Button href="#/auth" variant="primary">
            Create your <span className={styles.full}>group</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
