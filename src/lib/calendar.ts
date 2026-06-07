export interface SlotTemplate {
  id: string;
  label: string;
  detail: string;
  startsAt: string;
  endsAt: string;
}

export interface CalendarSlot extends SlotTemplate {
  dateKey: string;
  fullLabel: string;
  key: string;
  slotIndex: number;
}

export interface CalendarDay {
  dateKey: string;
  short: string;
  full: string;
  slots: CalendarSlot[];
}

export const slotTemplates: SlotTemplate[] = [
  { id: '09', label: '9 AM', detail: 'Morning', startsAt: '09:00:00', endsAt: '11:00:00' },
  { id: '12', label: '12 PM', detail: 'Midday', startsAt: '12:00:00', endsAt: '14:00:00' },
  { id: '15', label: '3 PM', detail: 'Afternoon', startsAt: '15:00:00', endsAt: '17:00:00' },
  { id: '18', label: '6 PM', detail: 'Dinner', startsAt: '18:00:00', endsAt: '20:00:00' },
  { id: '20', label: '8 PM', detail: 'Prime time', startsAt: '20:00:00', endsAt: '22:00:00' },
  { id: '22', label: '10 PM', detail: 'Late', startsAt: '22:00:00', endsAt: '23:59:00' },
];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildCalendarWindow(startDate = new Date(), dayCount = 7): CalendarDay[] {
  const anchor = startOfDay(startDate);

  return Array.from({ length: dayCount }, (_value, dayOffset) => {
    const date = new Date(anchor);
    date.setDate(anchor.getDate() + dayOffset);

    const dateKey = formatDateKey(date);
    const short = date.toLocaleDateString(undefined, { weekday: 'short' });
    const full = date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    return {
      dateKey,
      short,
      full,
      slots: slotTemplates.map((template, slotIndex) => ({
        ...template,
        dateKey,
        fullLabel: `${full} at ${template.label}`,
        key: `${dateKey}-${template.id}`,
        slotIndex,
      })),
    };
  });
}
