import styles from './Dashboard.module.css';
import type { InviteModalProps } from './types';

export default function InviteModal({
  groupName,
  inviteBusy,
  inviteEmail,
  inviteLink,
  inviteName,
  open,
  pendingInvites,
  shareLinkBusy,
  onClose,
  onCopyInviteLink,
  onInviteEmailChange,
  onInviteMember,
  onInviteNameChange,
  onShareInviteLink,
}: InviteModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} role="presentation" onClick={onClose}>
      <div
        className={`${styles.modalCard} ${styles.inviteModalCard}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close">
          x
        </button>

        <div className={`${styles.modalIcon} ${styles.inviteModalIcon}`}>+</div>
        <p className={styles.modalEyebrow}>Invite friends</p>
        <h3 id="invite-modal-title">Invite to {groupName}</h3>
        <p className={styles.modalSubcopy}>
          Share a link with the whole crew or save a direct email invite for someone specific.
        </p>

        <div className={styles.formBlock}>
          <label htmlFor="invite-link">Share this invite link</label>
          <input id="invite-link" className={styles.textInput} type="text" value={inviteLink} readOnly />
          <div className={styles.buttonRow}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={onCopyInviteLink}
              disabled={shareLinkBusy}
            >
              {shareLinkBusy ? 'Working...' : 'Copy invite link'}
            </button>
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={onShareInviteLink}
              disabled={shareLinkBusy}
            >
              Share link
            </button>
          </div>
        </div>

        <div className={styles.formBlock}>
          <label htmlFor="invite-name">Save an email invite too</label>
          <input
            id="invite-name"
            className={styles.textInput}
            type="text"
            placeholder="Friend name"
            value={inviteName}
            onChange={(event) => onInviteNameChange(event.target.value)}
          />
          <input
            className={styles.textInput}
            type="email"
            placeholder="friend@email.com"
            value={inviteEmail}
            onChange={(event) => onInviteEmailChange(event.target.value)}
          />
          <button type="button" className={styles.primaryButton} onClick={onInviteMember} disabled={inviteBusy}>
            {inviteBusy ? 'Saving invite...' : 'Save email invite'}
          </button>
        </div>

        {pendingInvites.length > 0 && (
          <div className={styles.formBlock}>
            <label>Pending email invites</label>
            <div className={styles.inlineList}>
              {pendingInvites.map((invite) => (
                <div key={invite.id} className={styles.inlineCard}>
                  <span>
                    <strong>{invite.inviteeName || invite.email}</strong>
                    <small>{invite.email}</small>
                  </span>
                  <em>{invite.status}</em>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
