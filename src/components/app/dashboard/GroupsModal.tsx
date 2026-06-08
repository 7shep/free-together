import styles from './Dashboard.module.css';
import type { GroupsModalProps } from './types';

export default function GroupsModal({
  createBusy,
  createGroupName,
  groups,
  incomingInvites,
  open,
  selectedGroupId,
  workingInviteId,
  onAcceptInvite,
  onClose,
  onCreateGroup,
  onCreateGroupNameChange,
  onSelectGroup,
}: GroupsModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} role="presentation" onClick={onClose}>
      <div
        className={`${styles.modalCard} ${styles.groupsModalCard}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="groups-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close">
          x
        </button>

        <div className={`${styles.modalIcon} ${styles.groupsModalIcon}`}>#</div>
        <p className={styles.modalEyebrow}>Groups</p>
        <h3 id="groups-modal-title">Manage your crews</h3>
        <p className={styles.modalSubcopy}>
          Switch groups, start a new crew, or accept pending invites from one place.
        </p>

        <div className={styles.formBlock}>
          <label>Your groups</label>
          <div className={styles.groupList}>
            {groups.length === 0 ? (
              <div className={styles.emptyCard}>No groups yet. Create your first crew below.</div>
            ) : (
              groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={`${styles.groupButton} ${
                    selectedGroupId === group.id ? styles.groupButtonActive : ''
                  }`}
                  onClick={() => onSelectGroup(group.id)}
                >
                  <span>
                    <strong>{group.name}</strong>
                    <small>Invite code {group.inviteCode}</small>
                  </span>
                  <em>{group.role}</em>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={styles.formBlock}>
          <label htmlFor="create-group-name">Create a new group</label>
          <input
            id="create-group-name"
            className={styles.textInput}
            type="text"
            placeholder="Weekend Crew"
            value={createGroupName}
            onChange={(event) => onCreateGroupNameChange(event.target.value)}
          />
          <button type="button" className={styles.primaryButton} onClick={onCreateGroup} disabled={createBusy}>
            {createBusy ? 'Creating...' : 'Create group'}
          </button>
        </div>

        {incomingInvites.length > 0 && (
          <div className={styles.formBlock}>
            <label>Pending invites for you</label>
            <div className={styles.inlineList}>
              {incomingInvites.map((invite) => (
                <div key={invite.id} className={styles.inlineCard}>
                  <span>
                    <strong>{invite.groupName ?? 'Group invite'}</strong>
                    <small>{invite.email}</small>
                  </span>
                  <button
                    type="button"
                    className={styles.inlineButton}
                    onClick={() => onAcceptInvite(invite.id)}
                    disabled={workingInviteId === invite.id}
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
