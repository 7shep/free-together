import Logo from '../ui/Logo';
import styles from './Footer.module.css';

/** Slim footer: brand, quick links, and a closing line. */
export default function Footer() {
  return (
    <footer className={styles.ft}>
      <div className={`wrap ${styles.inner}`}>
        <a href="#top" className={styles.brand}>
          <Logo width={30} height={26} />
          Free Together
        </a>

        <nav className={styles.links}>
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#/auth">Get started</a>
          <a href="/terms/">Terms</a>
          <a href="/privacy/">Privacy</a>
        </nav>

        <span className={styles.copy}>Made for crews who keep missing each other.</span>
      </div>
    </footer>
  );
}
