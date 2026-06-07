import Avatar from '../../ui/Avatar';
import AvatarStack from '../../ui/AvatarStack';
import styles from './Dashboard.module.css';
import type { LockInModalProps } from './types';

export default function LockInModal({ groupName, openWindow, onClose, onConfirm }: LockInModalProps) {
  if (!openWindow) {
    return null;
  }

  const everyoneFree = openWindow.count === openWindow.total && openWindow.total > 1;

  return (
    <div className={styles.modalBackdrop} role="presentation" onClick={onClose}>
      <div
        className={styles.modalCard}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lock-in-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close">
          x
        </button>

        <div className={styles.modalIcon}>OK</div>
        <h3 id="lock-in-title">Lock it in!</h3>
        <p className={styles.modalTime}>{openWindow.slot.fullLabel}</p>

        <AvatarStack overlap={10}>
          {openWindow.openMembers.map((member) => (
            <Avatar
              key={member.userId}
              label={member.label}
              color={member.color}
              size={40}
              borderColor="var(--surface)"
            />
          ))}
        </AvatarStack>

        <p className={styles.modalSubcopy}>
          {everyoneFree
            ? `Everyone visible in ${groupName} is free for this window.`
            : `${openWindow.count} of ${openWindow.total} visible friends are free for this window.`}
        </p>

        <div className={styles.modalActions}>
          <button type="button" className={styles.modalPrimary} onClick={onConfirm}>
            Send to group chat
          </button>
          <button type="button" className={styles.modalSecondary} onClick={onClose}>
            Not this one
          </button>
        </div>
      </div>
    </div>
  );
}
