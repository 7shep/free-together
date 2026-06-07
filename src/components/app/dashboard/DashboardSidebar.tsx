import { slotTemplates } from '../../../lib/calendar';
import styles from './Dashboard.module.css';
import type { DashboardSidebarProps } from './types';

export default function DashboardSidebar({
  calendarDays,
  clearDisabled,
  createBusy,
  createGroupName,
  groups,
  groupsSectionRef,
  hiddenMemberIds,
  incomingInvites,
  inviteBusy,
  inviteEmail,
  inviteLink,
  inviteName,
  inviteSectionRef,
  members,
  pendingGroupInvites,
  quickAddBusy,
  quickAddDayKey,
  quickAddOpen,
  quickAddSlotIndex,
  rankedWindows,
  selectedGroup,
  selectedGroupId,
  shareLinkBusy,
  showInviteForm,
  workingInviteId,
  onAcceptInvite,
  onCopyInviteLink,
  onClearWeek,
  onCreateGroup,
  onCreateGroupNameChange,
  onInviteEmailChange,
  onInviteMember,
  onInviteNameChange,
  onOpenWindow,
  onQuickAddDayChange,
  onQuickAddOpenChange,
  onQuickAddSave,
  onQuickAddSlotIndexChange,
  onSelectGroup,
  onShareInviteLink,
  onShowInviteFormChange,
  onToggleMember,
}: DashboardSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <section ref={groupsSectionRef} className={styles.sidebarSection}>
        <div className={styles.sectionHead}>
          <span>Groups</span>
          <button type="button" onClick={() => onShowInviteFormChange(!showInviteForm)}>
            {showInviteForm ? 'Hide invite' : 'Invite friend'}
          </button>
        </div>

        <div className={styles.groupPanel}>
          <div className={styles.groupPanelHeader}>
            <strong>{selectedGroup?.name ?? 'No group selected'}</strong>
            <small>
              {selectedGroup ? `Invite code ${selectedGroup.inviteCode}` : 'Create one to start syncing.'}
            </small>
          </div>

          <div className={styles.groupList}>
            {groups.length === 0 && (
              <div className={styles.emptyCard}>No groups yet. Create your first crew below.</div>
            )}

            {groups.map((group) => (
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
            ))}
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

          {showInviteForm && (
            <div ref={inviteSectionRef} className={styles.formBlock}>
              <label htmlFor="invite-link">Share this invite link</label>
              <input
                id="invite-link"
                className={styles.textInput}
                type="text"
                value={inviteLink}
                readOnly
                disabled={!selectedGroup}
              />
              <div className={styles.buttonRow}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={onCopyInviteLink}
                  disabled={!selectedGroup || shareLinkBusy}
                >
                  {shareLinkBusy ? 'Working...' : 'Copy invite link'}
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={onShareInviteLink}
                  disabled={!selectedGroup || shareLinkBusy}
                >
                  Share link
                </button>
              </div>

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
              <button
                type="button"
                className={styles.primaryButton}
                onClick={onInviteMember}
                disabled={!selectedGroupId || inviteBusy}
              >
                {inviteBusy ? 'Saving invite...' : 'Save email invite'}
              </button>

              {pendingGroupInvites.length > 0 && (
                <div className={styles.inlineList}>
                  {pendingGroupInvites.map((invite) => (
                    <div key={invite.id} className={styles.inlineCard}>
                      <span>
                        <strong>{invite.inviteeName || invite.email}</strong>
                        <small>{invite.email}</small>
                      </span>
                      <em>{invite.status}</em>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className={styles.sidebarSection}>
        <div className={styles.sectionHead}>
          <span>Members</span>
          <button type="button" onClick={() => onQuickAddOpenChange(!quickAddOpen)}>
            {quickAddOpen ? 'Hide add time' : '+ Add time'}
          </button>
        </div>

        <div className={styles.memberList}>
          {members.map((member) => {
            const hidden = hiddenMemberIds.has(member.userId);

            return (
              <button
                key={member.userId}
                type="button"
                className={`${styles.memberRow} ${hidden ? styles.memberRowHidden : ''}`}
                onClick={() => onToggleMember(member.userId)}
              >
                <span className={styles.memberAvatar} style={{ background: member.color }}>
                  {member.label}
                </span>

                <span className={styles.memberInfo}>
                  <strong>{member.fullName}</strong>
                  <small>{member.isMe ? 'You' : member.role}</small>
                </span>

                <span className={styles.memberCheck} aria-hidden="true">
                  {!hidden && (
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path
                        d="M2 5.6l2.2 2.2L9 3"
                        stroke="#fff"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {quickAddOpen && (
          <div className={styles.formBlock}>
            <label htmlFor="quick-add-day">Add free time</label>
            <select
              id="quick-add-day"
              className={styles.textInput}
              value={quickAddDayKey}
              onChange={(event) => onQuickAddDayChange(event.target.value)}
            >
              {calendarDays.map((day) => (
                <option key={day.dateKey} value={day.dateKey}>
                  {day.full}
                </option>
              ))}
            </select>
            <select
              className={styles.textInput}
              value={quickAddSlotIndex}
              onChange={(event) => onQuickAddSlotIndexChange(Number(event.target.value))}
            >
              {slotTemplates.map((slot, index) => (
                <option key={slot.id} value={index}>
                  {slot.label} - {slot.detail}
                </option>
              ))}
            </select>
            <button type="button" className={styles.primaryButton} onClick={onQuickAddSave} disabled={quickAddBusy}>
              {quickAddBusy ? 'Saving...' : 'Add to my schedule'}
            </button>
            <button type="button" className={styles.secondaryButton} onClick={onClearWeek} disabled={clearDisabled}>
              Clear my week
            </button>
          </div>
        )}
      </section>

      <section className={styles.sidebarSection}>
        <div className={styles.sectionHead}>
          <span>Free this week</span>
        </div>

        <div className={styles.freeCardList}>
          {rankedWindows.length === 0 && (
            <div className={styles.emptyCard}>No overlap yet. Start by marking your own availability.</div>
          )}

          {rankedWindows.map((window, index) => (
            <article
              key={window.key}
              className={`${styles.freeCard} ${index === 0 ? styles.freeCardBest : ''}`}
            >
              {index === 0 && <span className={styles.freeBadge}>Best</span>}
              <div className={styles.freeCardTime}>{window.slot.fullLabel}</div>
              <div className={styles.freeCardMeta}>
                {window.count}/{window.total} visible friends free
              </div>
              <button type="button" className={styles.lockButton} onClick={() => onOpenWindow(window)}>
                Lock it in
              </button>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}
