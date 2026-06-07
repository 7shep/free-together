import styles from './Avatar.module.css';

interface AvatarProps {
  label: string;
  color: string;
  size?: number;
  /** Faint outer ring used on the larger hero-calendar avatars. */
  ring?: boolean;
}

/** A circular friend avatar showing an initial on a solid colour. */
export default function Avatar({ label, color, size = 34, ring = false }: AvatarProps) {
  return (
    <span
      className={styles.av}
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.4,
        boxShadow: ring ? '0 0 0 1px color-mix(in srgb, var(--ink) 18%, transparent)' : undefined,
      }}
    >
      {label}
    </span>
  );
}
