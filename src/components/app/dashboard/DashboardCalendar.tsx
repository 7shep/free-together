import type { CSSVars } from '../../../types/css';
import styles from './Dashboard.module.css';
import type { WeekCalendarProps } from './types';

const CALENDAR_START_HOUR = 8;
const CALENDAR_END_HOUR = 23;
const HOUR_HEIGHT = 52;

function toTop(minutes: number) {
  return ((minutes - CALENDAR_START_HOUR * 60) / 60) * HOUR_HEIGHT;
}

function toHeight(startMinutes: number, endMinutes: number) {
  return ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;
}

function parseMinutes(value: string) {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
}

export default function DashboardCalendar({
  availabilityBySlot,
  calendarDays,
  emptyMessage,
  loading,
  members,
  mySlotKeys,
  openWindow,
  perfectWindows,
  scrollRef,
  selectedGroupName,
  toggleAvailability,
  visibleMemberIds,
  workingKey,
}: WeekCalendarProps) {
  const visibleMembers = members.filter((member) => visibleMemberIds.has(member.userId));
  const dayHasPerfectWindow = new Set(perfectWindows.map((window) => window.slot.dateKey));
  const gridHeight = (CALENDAR_END_HOUR - CALENDAR_START_HOUR) * HOUR_HEIGHT;
  const hourLines = Array.from({ length: CALENDAR_END_HOUR - CALENDAR_START_HOUR }, (_item, index) => {
    const hour = CALENDAR_START_HOUR + index;
    return {
      halfTop: index * HOUR_HEIGHT + HOUR_HEIGHT / 2,
      label: hour < 12 ? `${hour}am` : hour === 12 ? '12pm' : `${hour - 12}pm`,
      top: index * HOUR_HEIGHT,
    };
  });

  return (
    <main ref={scrollRef} className={styles.mainPanel}>
      {!selectedGroupName ? (
        <div className={styles.mainEmptyState}>
          <strong>No group selected yet.</strong>
          <p>Create a group or accept an invite to start loading your real crew calendar.</p>
        </div>
      ) : visibleMembers.length === 0 ? (
        <div className={styles.mainEmptyState}>
          <strong>All members are hidden.</strong>
          <p>Toggle at least one person back on in the sidebar to see the week timeline again.</p>
        </div>
      ) : (
        <>
          <div className={styles.calendarStickyHeader}>
            <div className={styles.calendarGutterHeader} />

            {calendarDays.map((day) => (
              <div
                key={day.dateKey}
                className={`${styles.calendarDayHeader} ${
                  dayHasPerfectWindow.has(day.dateKey) ? styles.calendarDayHeaderFree : ''
                }`}
              >
                <div className={styles.calendarDayDow}>
                  {day.short}
                  {dayHasPerfectWindow.has(day.dateKey) && <span className={styles.freePip} aria-hidden="true" />}
                </div>
                <div className={styles.calendarDayDate}>{day.full}</div>
                <div className={styles.calendarLegend}>
                  {visibleMembers.map((member) => (
                    <span
                      key={`${day.dateKey}-${member.userId}`}
                      className={styles.calendarLegendDot}
                      style={{ background: member.color }}
                      title={member.fullName}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.calendarGrid}>
            <div className={styles.calendarGutter} style={{ height: gridHeight }}>
              {hourLines.map((line) => (
                <div key={line.label} className={styles.timeLabel} style={{ top: line.top }}>
                  {line.label}
                </div>
              ))}
            </div>

            {calendarDays.map((day) => (
              <div key={day.dateKey} className={styles.dayColumn} style={{ height: gridHeight }}>
                {hourLines.map((line) => (
                  <div key={`hour-${day.dateKey}-${line.top}`} className={styles.hourLine} style={{ top: line.top }} />
                ))}

                {hourLines.slice(0, -1).map((line) => (
                  <div
                    key={`half-${day.dateKey}-${line.halfTop}`}
                    className={styles.halfLine}
                    style={{ top: line.halfTop }}
                  />
                ))}

                <div className={styles.slotActions}>
                  {day.slots.map((slot) => {
                    const slotKey = `${slot.dateKey}-${slot.slotIndex}`;
                    const openIds = availabilityBySlot.get(slotKey) ?? new Set<string>();
                    const mine = mySlotKeys.has(slotKey);
                    const startMinutes = parseMinutes(slot.startsAt);
                    const endMinutes = parseMinutes(slot.endsAt);
                    const openCount = visibleMembers.filter((member) => openIds.has(member.userId)).length;
                    const fullyOpen = openCount === visibleMembers.length && visibleMembers.length > 1;

                    return (
                      <button
                        key={slot.key}
                        type="button"
                        className={`${styles.slotAction} ${mine ? styles.slotActionMine : ''} ${
                          fullyOpen ? styles.slotActionFull : ''
                        }`}
                        style={{ top: toTop(startMinutes), height: toHeight(startMinutes, endMinutes) }}
                        onClick={() => toggleAvailability(slot)}
                        disabled={loading || workingKey === slotKey}
                        title={`${mine ? 'Remove' : 'Add'} your availability for ${slot.fullLabel}`}
                      >
                        {mine && <span className={styles.slotActionBadge}>You&apos;re free</span>}
                      </button>
                    );
                  })}
                </div>

                <div className={styles.lanes}>
                  {visibleMembers.map((member) => (
                    <div key={`${day.dateKey}-${member.userId}`} className={styles.lane}>
                      {day.slots.map((slot) => {
                          const slotKey = `${slot.dateKey}-${slot.slotIndex}`;
                          const openIds = availabilityBySlot.get(slotKey) ?? new Set<string>();
                          if (!openIds.has(member.userId)) {
                            return null;
                          }

                          const startMinutes = parseMinutes(slot.startsAt);
                          const endMinutes = parseMinutes(slot.endsAt);

                          return (
                            <div
                              key={`${member.userId}-${slot.key}`}
                              className={styles.eventBlock}
                              style={{
                                '--person-color': member.color,
                                top: toTop(startMinutes),
                                height: toHeight(startMinutes, endMinutes),
                              } as CSSVars}
                              title={`${member.fullName} is free ${slot.fullLabel}`}
                            >
                              {member.isMe ? 'You' : member.fullName}
                            </div>
                          );
                        })}
                    </div>
                  ))}
                </div>

                {perfectWindows
                  .filter((window) => window.slot.dateKey === day.dateKey)
                  .map((window) => {
                    const startMinutes = parseMinutes(window.slot.startsAt);
                    const endMinutes = parseMinutes(window.slot.endsAt);

                    return (
                      <button
                        key={window.key}
                        type="button"
                        className={styles.freeOverlay}
                        style={{ top: toTop(startMinutes), height: toHeight(startMinutes, endMinutes) }}
                        onClick={() => openWindow(window)}
                        title={`Open celebration for ${window.slot.fullLabel}`}
                      >
                        <span className={styles.freeOverlayStar}>*</span>
                        <span className={styles.freeOverlayLabel}>{window.slot.label}</span>
                      </button>
                    );
                  })}
              </div>
            ))}
          </div>
        </>
      )}

      {selectedGroupName && <p className={styles.calendarFootnote}>{emptyMessage}</p>}
    </main>
  );
}
