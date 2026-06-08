import { slotTemplates } from '../../../lib/calendar';
import styles from './Dashboard.module.css';
import type { DashboardSidebarProps } from './types';

export default function DashboardSidebar({
  calendarDays,
  clearDisabled,
  hiddenMemberIds,
  members,
  quickAddBusy,
  quickAddDayKey,
  quickAddOpen,
  quickAddSlotIndex,
  rankedWindows,
  selectedGroupId,
  onClearWeek,
  onOpenWindow,
  onQuickAddDayChange,
  onQuickAddOpenChange,
  onQuickAddSave,
  onQuickAddSlotIndexChange,
  onOpenScheduleModal,
  onToggleMember,
}: DashboardSidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <section className={styles.sidebarSection}>
        <div className={styles.sectionHead}>
          <span>Members</span>
          <div className={styles.sectionActions}>
            <button type="button" onClick={() => onQuickAddOpenChange(!quickAddOpen)}>
              {quickAddOpen ? 'Hide add time' : '+ Add time'}
            </button>
            <button type="button" onClick={onOpenScheduleModal} disabled={!selectedGroupId}>
              Add Schedule
            </button>
          </div>
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
            <article key={window.key} className={`${styles.freeCard} ${index === 0 ? styles.freeCardBest : ''}`}>
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
