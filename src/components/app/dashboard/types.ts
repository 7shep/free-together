import type { MutableRefObject } from 'react';
import type { CalendarDay, CalendarSlot } from '../../../lib/calendar';
import type { GroupChatMessage, GroupInvite, GroupListItem, GroupMember } from '../../../lib/appData';

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
  hiddenMemberIds: Set<string>;
  members: DecoratedMember[];
  quickAddBusy: boolean;
  quickAddDayKey: string;
  quickAddOpen: boolean;
  quickAddSlotIndex: number;
  rankedWindows: RankedWindow[];
  selectedGroupId: string | null;
  onClearWeek: () => void;
  onOpenWindow: (window: RankedWindow) => void;
  onQuickAddDayChange: (value: string) => void;
  onQuickAddOpenChange: (nextOpen: boolean) => void;
  onQuickAddSave: () => void;
  onQuickAddSlotIndexChange: (value: number) => void;
  onOpenScheduleModal: () => void;
  onToggleMember: (memberId: string) => void;
}

export interface DashboardTopbarProps {
  chatDisabled: boolean;
  groupName: string;
  groupSubtitle: string;
  groupsOpen: boolean;
  inviteDisabled: boolean;
  members: DecoratedMember[];
  mode?: 'chat' | 'dashboard';
  scheduleDisabled: boolean;
  weekLabel: string;
  onBackToDashboard?: () => void;
  onNextWeek: () => void;
  onOpenGroupChat: () => void;
  onOpenGroups: () => void;
  onOpenInvite: () => void;
  onOpenSchedule: () => void;
  onPrevWeek: () => void;
  onSignOut: () => void;
  userLabel: string;
}

export interface GroupChatPageProps {
  busy: boolean;
  draft: string;
  groupName: string;
  loading: boolean;
  members: DecoratedMember[];
  messages: GroupChatMessage[];
  onBack: () => void;
  onDraftChange: (value: string) => void;
  onSendMessage: () => void;
  userId: string;
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

export interface GroupsModalProps {
  createBusy: boolean;
  createGroupName: string;
  groups: GroupListItem[];
  incomingInvites: GroupInvite[];
  open: boolean;
  selectedGroupId: string | null;
  workingInviteId: string | null;
  onAcceptInvite: (inviteId: string) => void;
  onClose: () => void;
  onCreateGroup: () => void;
  onCreateGroupNameChange: (value: string) => void;
  onSelectGroup: (groupId: string) => void;
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
