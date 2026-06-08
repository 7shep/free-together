import styles from './Dashboard.module.css';
import type { ScheduleModalProps } from './types';

export default function ScheduleModal({
  calendarDays,
  endTime,
  onClose,
  onConfirm,
  onDayChange,
  onEndTimeChange,
  onStartTimeChange,
  open,
  selectedDayKey,
  startTime,
  submitting,
}: ScheduleModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop} role="presentation" onClick={onClose}>
      <div
        className={`${styles.modalCard} ${styles.scheduleModalCard}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Close">
          x
        </button>

        <div className={`${styles.modalIcon} ${styles.scheduleModalIcon}`}>+</div>
        <p className={styles.modalEyebrow}>Work hours</p>
        <h3 id="schedule-modal-title">Add Schedule</h3>
        <p className={styles.modalSubcopy}>
          Tell Free Together when you are working and it will keep only the free slots outside that shift.
        </p>

        <div className={styles.scheduleForm}>
          <label htmlFor="schedule-day" className={styles.scheduleField}>
            <span>Day</span>
            <select
              id="schedule-day"
              className={styles.textInput}
              value={selectedDayKey}
              onChange={(event) => onDayChange(event.target.value)}
            >
              {calendarDays.map((day) => (
                <option key={day.dateKey} value={day.dateKey}>
                  {day.full}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.scheduleTimeRow}>
            <label htmlFor="schedule-start" className={styles.scheduleField}>
              <span>Start time</span>
              <input
                id="schedule-start"
                className={styles.textInput}
                type="time"
                value={startTime}
                step={1800}
                onChange={(event) => onStartTimeChange(event.target.value)}
              />
            </label>

            <label htmlFor="schedule-end" className={styles.scheduleField}>
              <span>End time</span>
              <input
                id="schedule-end"
                className={styles.textInput}
                type="time"
                value={endTime}
                step={1800}
                onChange={(event) => onEndTimeChange(event.target.value)}
              />
            </label>
          </div>
        </div>

        <p className={styles.scheduleNote}>
          Existing availability for that day will be recalculated from this work block.
        </p>

        <div className={styles.modalActions}>
          <button type="button" className={styles.modalPrimary} onClick={onConfirm} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save schedule'}
          </button>
          <button type="button" className={styles.modalSecondary} onClick={onClose} disabled={submitting}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
