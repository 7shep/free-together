import type { MutableRefObject } from 'react';
import type { CalendarDay, CalendarSlot } from '../../../lib/calendar';
import type { GroupInvite, GroupListItem, GroupMember } from '../../../lib/appData';

export interface DecoratedMember extends GroupMember {
  color: string;
  isMe: boolean;
  label: string;
}

export interface RankedWindow {
  count: number;
  key: string;
  openMembers: DecoratedMember[];
  slot: CalendarSlot;
  total: number;
}

export interface DashboardSidebarProps {
  calendarDays: CalendarDay[];
  clearDisabled: boolean;
  createBusy: boolean;
  createGroupName: string;
  groups: GroupListItem[];
  groupsSectionRef: MutableRefObject<HTMLDivElement | null>;
  hiddenMemberIds: Set<string>;
  incomingInvites: GroupInvite[];
  members: DecoratedMember[];
  quickAddBusy: boolean;
  quickAddDayKey: string;
  quickAddOpen: boolean;
  quickAddSlotIndex: number;
  rankedWindows: RankedWindow[];
  selectedGroup: GroupListItem | null;
  selectedGroupId: string | null;
  workingInviteId: string | null;
  onAcceptInvite: (inviteId: string) => void;
  onClearWeek: () => void;
  onCreateGroup: () => void;
  onCreateGroupNameChange: (value: string) => void;
  onOpenWindow: (window: RankedWindow) => void;
  onQuickAddDayChange: (value: string) => void;
  onQuickAddOpenChange: (nextOpen: boolean) => void;
  onQuickAddSave: () => void;
  onQuickAddSlotIndexChange: (value: number) => void;
  onOpenScheduleModal: () => void;
  onSelectGroup: (groupId: string) => void;
  onToggleMember: (memberId: string) => void;
}

export interface DashboardTopbarProps {
  groups: GroupListItem[];
  groupName: string;
  groupSubtitle: string;
  inviteDisabled: boolean;
  members: DecoratedMember[];
  selectedGroupId: string | null;
  weekLabel: string;
  onNextWeek: () => void;
  onOpenInvite: () => void;
  onPrevWeek: () => void;
  onSelectGroup: (groupId: string) => void;
  onSignOut: () => void;
  userLabel: string;
}

export interface LockInModalProps {
  groupName: string;
  openWindow: RankedWindow | null;
  onClose: () => void;
  onConfirm: () => void;
}

export interface ScheduleModalProps {
  calendarDays: CalendarDay[];
  endTime: string;
  onClose: () => void;
  onConfirm: () => void;
  onDayChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  open: boolean;
  selectedDayKey: string;
  startTime: string;
  submitting: boolean;
}

export interface InviteModalProps {
  groupName: string;
  inviteBusy: boolean;
  inviteEmail: string;
  inviteLink: string;
  inviteName: string;
  open: boolean;
  pendingInvites: GroupInvite[];
  shareLinkBusy: boolean;
  onClose: () => void;
  onCopyInviteLink: () => void;
  onInviteEmailChange: (value: string) => void;
  onInviteMember: () => void;
  onInviteNameChange: (value: string) => void;
  onShareInviteLink: () => void;
}

export interface WeekCalendarProps {
  availabilityBySlot: Map<string, Set<string>>;
  calendarDays: CalendarDay[];
  emptyMessage: string;
  loading: boolean;
  members: DecoratedMember[];
  mySlotKeys: Set<string>;
  openWindow: (window: RankedWindow) => void;
  perfectWindows: RankedWindow[];
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  selectedGroupName: string | null;
  toggleAvailability: (slot: CalendarSlot) => void;
  visibleMemberIds: Set<string>;
  workingKey: string | null;
}
