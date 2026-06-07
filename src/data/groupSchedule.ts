export interface Slot {
  id: string;
  label: string;
  detail: string;
}

export interface Day {
  short: string;
  full: string;
}

export type AvailabilityMatrix = boolean[][];

export interface FriendSchedule {
  id: string;
  name: string;
  label: string;
  role: string;
  color: string;
  availability: AvailabilityMatrix;
}

export interface GroupDefinition {
  id: string;
  name: string;
  vibe: string;
  members: FriendSchedule[];
  suggestions: FriendSchedule[];
}

export interface WorkPreset {
  id: string;
  label: string;
  detail: string;
  accent: string;
  availability: AvailabilityMatrix;
}

function matrix(...rows: string[]): AvailabilityMatrix {
  return rows.map((row) => [...row].map((cell) => cell === '1'));
}

export const days: Day[] = [
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
  { short: 'Sun', full: 'Sunday' },
];

export const slots: Slot[] = [
  { id: '9am', label: '9 AM', detail: 'Morning' },
  { id: '12pm', label: '12 PM', detail: 'Midday' },
  { id: '3pm', label: '3 PM', detail: 'Afternoon' },
  { id: '6pm', label: '6 PM', detail: 'Dinner' },
  { id: '8pm', label: '8 PM', detail: 'Prime time' },
  { id: '10pm', label: '10 PM', detail: 'Late' },
];

export const workPresets: WorkPreset[] = [
  {
    id: 'hybrid',
    label: 'Hybrid office',
    detail: 'Busy in the day, open after work and most weekends.',
    accent: 'var(--mint)',
    availability: matrix(
      '000111',
      '000111',
      '001111',
      '000111',
      '001111',
      '111111',
      '111110',
    ),
  },
  {
    id: 'closer',
    label: 'Cafe closer',
    detail: 'Late starts, with weekends almost fully open.',
    accent: 'var(--sun)',
    availability: matrix(
      '011111',
      '011111',
      '011111',
      '011111',
      '011111',
      '111111',
      '111110',
    ),
  },
  {
    id: 'rounds',
    label: 'Hospital rounds',
    detail: 'Mostly evenings, with a few wider Friday and Saturday windows.',
    accent: 'var(--sky)',
    availability: matrix(
      '000011',
      '000011',
      '000111',
      '000011',
      '001111',
      '011111',
      '001111',
    ),
  },
];

export const defaultWorkPresetId = workPresets[0].id;

export const groups: GroupDefinition[] = [
  {
    id: 'weekend-crew',
    name: 'Weekend Crew',
    vibe: 'Your go-to dinner and movie group.',
    members: [
      {
        id: 'talia',
        name: 'Talia Brooks',
        label: 'T',
        role: 'Design lead',
        color: 'var(--coral)',
        availability: matrix(
          '000111',
          '001111',
          '000111',
          '001111',
          '001111',
          '111111',
          '011110',
        ),
      },
      {
        id: 'jordan',
        name: 'Jordan Kim',
        label: 'J',
        role: 'PT coach',
        color: 'var(--violet)',
        availability: matrix(
          '000011',
          '000111',
          '001111',
          '000111',
          '001111',
          '111111',
          '011111',
        ),
      },
      {
        id: 'yasmin',
        name: 'Yasmin Ali',
        label: 'Y',
        role: 'Grad student',
        color: 'var(--pink)',
        availability: matrix(
          '000111',
          '000011',
          '000111',
          '000111',
          '001111',
          '111111',
          '001111',
        ),
      },
    ],
    suggestions: [
      {
        id: 'luca',
        name: 'Luca Moss',
        label: 'L',
        role: 'Photographer',
        color: 'var(--sky)',
        availability: matrix(
          '000111',
          '000111',
          '000111',
          '000111',
          '001111',
          '011111',
          '001110',
        ),
      },
      {
        id: 'priya',
        name: 'Priya Shah',
        label: 'P',
        role: 'PM',
        color: 'var(--sun)',
        availability: matrix(
          '001111',
          '001111',
          '000111',
          '001111',
          '001111',
          '111111',
          '011110',
        ),
      },
    ],
  },
  {
    id: 'studio-nights',
    name: 'Studio Nights',
    vibe: 'Late-night makers syncing around project sessions.',
    members: [
      {
        id: 'niko',
        name: 'Niko Hale',
        label: 'N',
        role: 'Animator',
        color: 'var(--sky)',
        availability: matrix(
          '000011',
          '000011',
          '000111',
          '000011',
          '001111',
          '111111',
          '001111',
        ),
      },
      {
        id: 'sora',
        name: 'Sora Patel',
        label: 'S',
        role: 'Producer',
        color: 'var(--coral)',
        availability: matrix(
          '000111',
          '000011',
          '000111',
          '000011',
          '001111',
          '111111',
          '011110',
        ),
      },
      {
        id: 'dev',
        name: 'Dev Lennon',
        label: 'D',
        role: 'Writer',
        color: 'var(--violet)',
        availability: matrix(
          '000011',
          '000111',
          '001111',
          '000111',
          '001111',
          '111111',
          '001111',
        ),
      },
    ],
    suggestions: [
      {
        id: 'mina',
        name: 'Mina Sol',
        label: 'M',
        role: 'Editor',
        color: 'var(--pink)',
        availability: matrix(
          '000011',
          '000011',
          '000111',
          '000111',
          '001111',
          '111111',
          '001111',
        ),
      },
      {
        id: 'omar',
        name: 'Omar Lee',
        label: 'O',
        role: 'Composer',
        color: 'var(--mint)',
        availability: matrix(
          '000111',
          '000011',
          '000111',
          '000111',
          '001111',
          '111111',
          '011110',
        ),
      },
    ],
  },
  {
    id: 'family-table',
    name: 'Family Table',
    vibe: 'Coordinating the next everyone-can-make-it dinner.',
    members: [
      {
        id: 'cam',
        name: 'Cam Rivera',
        label: 'C',
        role: 'Teacher',
        color: 'var(--coral)',
        availability: matrix(
          '000111',
          '000111',
          '000111',
          '000111',
          '001111',
          '111111',
          '111110',
        ),
      },
      {
        id: 'leo',
        name: 'Leo Rivera',
        label: 'L',
        role: 'College student',
        color: 'var(--sky)',
        availability: matrix(
          '001111',
          '000111',
          '001111',
          '000111',
          '001111',
          '111111',
          '011111',
        ),
      },
      {
        id: 'ana',
        name: 'Ana Rivera',
        label: 'A',
        role: 'Night shift nurse',
        color: 'var(--violet)',
        availability: matrix(
          '110000',
          '110000',
          '110000',
          '110000',
          '111100',
          '111111',
          '111110',
        ),
      },
    ],
    suggestions: [
      {
        id: 'zoe',
        name: 'Zoe Rivera',
        label: 'Z',
        role: 'Soccer captain',
        color: 'var(--pink)',
        availability: matrix(
          '000111',
          '000111',
          '000111',
          '000111',
          '001111',
          '111111',
          '011110',
        ),
      },
      {
        id: 'elliot',
        name: 'Elliot Rivera',
        label: 'E',
        role: 'Remote dev',
        color: 'var(--sun)',
        availability: matrix(
          '001111',
          '001111',
          '001111',
          '001111',
          '001111',
          '111111',
          '111110',
        ),
      },
    ],
  },
];
