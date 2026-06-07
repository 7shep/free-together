import type { AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'neutral' | 'ghost';

interface ButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: 'md' | 'lg';
  /** Restyle for placement on the dark closing-CTA card. */
  onDark?: boolean;
}

/** Pill button rendered as an anchor (every CTA on the page is a jump link). */
export default function Button({
  href,
  children,
  variant = 'neutral',
  size = 'md',
  onDark = false,
  className,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.btn,
    variant === 'primary' && styles.primary,
    variant === 'ghost' && styles.ghost,
    size === 'lg' && styles.lg,
    onDark && styles.onDark,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}
