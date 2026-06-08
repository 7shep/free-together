import { useEffect, useRef, useState } from 'react';
import Avatar from '../../ui/Avatar';
import AvatarStack from '../../ui/AvatarStack';
import Logo from '../../ui/Logo';
import styles from './Dashboard.module.css';
import type { DashboardTopbarProps } from './types';

export default function DashboardTopbar({
  groups,
  groupName,
  groupSubtitle,
  inviteDisabled,
  members,
  selectedGroupId,
  weekLabel,
  onNextWeek,
  onOpenInvite,
  onPrevWeek,
  onSelectGroup,
  onSignOut,
  userLabel,
}: DashboardTopbarProps) {
  const [groupMenuOpen, setGroupMenuOpen] = useState(false);
  const groupMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!groupMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!groupMenuRef.current?.contains(event.target as Node)) {
        setGroupMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, [groupMenuOpen]);

  return (
    <header className={styles.topbar}>
      <a href="#/app" className={styles.brand} aria-label="Free Together home">
        <Logo width={28} height={24} />
        Free Together
      </a>

      <div className={styles.topbarDivider} />

      <div ref={groupMenuRef} className={styles.groupPickerWrap}>
        <button
          type="button"
          className={`${styles.groupPicker} ${groupMenuOpen ? styles.groupPickerOpen : ''}`}
          onClick={() => setGroupMenuOpen((current) => !current)}
          aria-expanded={groupMenuOpen}
          aria-haspopup="menu"
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
            {groupMenuOpen ? '^' : 'v'}
          </span>
        </button>

        {groupMenuOpen && (
          <div className={styles.groupDropdown} role="menu" aria-label="Your groups">
            {groups.length === 0 ? (
              <div className={styles.groupDropdownEmpty}>No groups yet</div>
            ) : (
              groups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  role="menuitemradio"
                  aria-checked={selectedGroupId === group.id}
                  className={`${styles.groupDropdownItem} ${
                    selectedGroupId === group.id ? styles.groupDropdownItemActive : ''
                  }`}
                  onClick={() => {
                    onSelectGroup(group.id);
                    setGroupMenuOpen(false);
                  }}
                >
                  <span className={styles.groupDropdownText}>
                    <strong>{group.name}</strong>
                    <small>{group.role}</small>
                  </span>
                  {selectedGroupId === group.id && <span className={styles.groupDropdownCheck}>✓</span>}
                </button>
              ))
            )}
          </div>
        )}
      </div>

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
