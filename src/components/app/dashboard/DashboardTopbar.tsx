import Avatar from '../../ui/Avatar';
import AvatarStack from '../../ui/AvatarStack';
import Logo from '../../ui/Logo';
import styles from './Dashboard.module.css';
import type { DashboardTopbarProps } from './types';

export default function DashboardTopbar({
  groupName,
  groupSubtitle,
  inviteDisabled,
  members,
  weekLabel,
  onNextWeek,
  onOpenGroups,
  onOpenInvite,
  onPrevWeek,
  onSignOut,
  userLabel,
}: DashboardTopbarProps) {
  return (
    <header className={styles.topbar}>
      <a href="#/app" className={styles.brand} aria-label="Free Together home">
        <Logo width={28} height={24} />
        Free Together
      </a>

      <div className={styles.topbarDivider} />

      <button type="button" className={styles.groupPicker} onClick={onOpenGroups}>
        <AvatarStack overlap={7}>
          {members.slice(0, 4).map((member) => (
            <Avatar
              key={member.userId}
              label={member.label}
              color={member.color}
              size={26}
              borderColor="var(--surface)"
            />
          ))}
        </AvatarStack>

        <span className={styles.groupPickerCopy}>
          <strong>{groupName}</strong>
          <small>{groupSubtitle}</small>
        </span>

        <span className={styles.groupChevron} aria-hidden="true">
          v
        </span>
      </button>

      <div className={styles.topbarFill} />

      <div className={styles.weekNav}>
        <button type="button" className={styles.weekButton} onClick={onPrevWeek} aria-label="Previous week">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <span className={styles.weekLabel}>{weekLabel}</span>

        <button type="button" className={styles.weekButton} onClick={onNextWeek} aria-label="Next week">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className={styles.topbarFill} />

      <button
        type="button"
        className={styles.inviteButton}
        onClick={onOpenInvite}
        disabled={inviteDisabled}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        Invite
      </button>

      <button type="button" className={styles.signOutButton} onClick={onSignOut}>
        Log out
      </button>

      <span className={styles.userAvatar} aria-hidden="true">
        {userLabel}
      </span>
    </header>
  );
}
