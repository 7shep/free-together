import Avatar from '../../ui/Avatar';
import AvatarStack from '../../ui/AvatarStack';
import Logo from '../../ui/Logo';
import styles from './Dashboard.module.css';
import type { DashboardTopbarProps } from './types';

export default function DashboardTopbar({
  chatDisabled,
  groupName,
  groupSubtitle,
  groupsOpen,
  inviteDisabled,
  members,
  mode = 'dashboard',
  scheduleDisabled,
  weekLabel,
  onBackToDashboard,
  onNextWeek,
  onOpenGroupChat,
  onOpenGroups,
  onOpenInvite,
  onOpenSchedule,
  onPrevWeek,
  onSignOut,
  userLabel,
}: DashboardTopbarProps) {
  const isChatMode = mode === 'chat';

  return (
    <header className={styles.topbar}>
      <a href="#/app" className={styles.brand} aria-label="Free Together home">
        <Logo width={28} height={24} />
        Free Together
      </a>

      <div className={styles.topbarDivider} />

      <button
        type="button"
        className={`${styles.groupPicker} ${groupsOpen ? styles.groupPickerOpen : ''}`}
        onClick={onOpenGroups}
        aria-expanded={groupsOpen}
        aria-haspopup="dialog"
      >
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
          {groupsOpen ? '^' : 'v'}
        </span>
      </button>

      <div className={styles.topbarFill} />

      {isChatMode ? (
        <button
          type="button"
          className={`${styles.secondaryButton} ${styles.chatBackButton}`}
          onClick={onBackToDashboard}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to calendar
        </button>
      ) : (
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
      )}

      <div className={styles.topbarFill} />

      <div className={styles.topbarActions}>
        {!isChatMode && (
          <button
            type="button"
            className={styles.iconActionButton}
            onClick={onOpenGroupChat}
            disabled={chatDisabled}
            aria-label="Group chat"
            title="Group chat"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3.2 4.4c0-1 0.8-1.8 1.8-1.8h6c1 0 1.8 0.8 1.8 1.8v3.9c0 1-0.8 1.8-1.8 1.8H7.5L4.7 12.5v-2.4H5c-1 0-1.8-0.8-1.8-1.8V4.4Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        <button type="button" className={styles.inviteButton} onClick={onOpenInvite} disabled={inviteDisabled}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          Invite
        </button>

        {!isChatMode && (
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onOpenSchedule}
            disabled={scheduleDisabled}
          >
            Add schedule
          </button>
        )}
      </div>

      <button type="button" className={styles.signOutButton} onClick={onSignOut}>
        Log out
      </button>

      <span className={styles.userAvatar} aria-hidden="true">
        {userLabel}
      </span>
    </header>
  );
}
