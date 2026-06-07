import { useEffect, useMemo, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  acceptInvite,
  clearAvailabilityRange,
  createGroup,
  inviteMember,
  joinGroupByInviteCode,
  listIncomingInvites,
  listMyGroups,
  loadGroupSnapshot,
  setAvailability,
  type AvailabilityRecord,
  type GroupInvite,
  type GroupListItem,
  type GroupMember,
  type GroupSnapshot,
} from '../../lib/appData';
import { buildCalendarWindow } from '../../lib/calendar';
import { requireSupabase } from '../../lib/supabase';
import DashboardCalendar from './dashboard/DashboardCalendar';
import styles from './dashboard/Dashboard.module.css';
import DashboardSidebar from './dashboard/DashboardSidebar';
import DashboardTopbar from './dashboard/DashboardTopbar';
import LockInModal from './dashboard/LockInModal';
import type { DecoratedMember, RankedWindow } from './dashboard/types';

interface NoticeState {
  text: string;
  tone: 'error' | 'success';
}

const avatarPalette = ['var(--coral)', 'var(--violet)', 'var(--sky)', 'var(--pink)', 'var(--sun)', 'var(--mint)'];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function paletteIndex(seed: string) {
  return [...seed].reduce((sum, character) => sum + character.charCodeAt(0), 0) % avatarPalette.length;
}

function messageFromError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function replaceAvailability(current: GroupSnapshot | null, nextRecord: AvailabilityRecord, available: boolean) {
  if (!current) return current;

  const filtered = current.availability.filter(
    (item) =>
      !(
        item.userId === nextRecord.userId &&
        item.slotDate === nextRecord.slotDate &&
        item.slotIndex === nextRecord.slotIndex
      ),
  );

  return {
    ...current,
    availability: available ? [...filtered, nextRecord] : filtered,
  };
}

function startOfWeek(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  const offset = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - offset);
  return next;
}

function shiftWeek(date: Date, weeks: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + weeks * 7);
  return next;
}

function formatWeekLabel(startDate: Date) {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const startLabel = startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const endLabel = endDate.toLocaleDateString(undefined, sameMonth ? { day: 'numeric' } : { month: 'short', day: 'numeric' });

  return `${startLabel} - ${endLabel}`;
}

interface AppHomeProps {
  joinInviteCode?: string;
  user: User;
}

export default function AppHome({ joinInviteCode, user }: AppHomeProps) {
  const [groups, setGroups] = useState<GroupListItem[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<GroupSnapshot | null>(null);
  const [incomingInvites, setIncomingInvites] = useState<GroupInvite[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [loadingGroup, setLoadingGroup] = useState(false);
  const [workingKey, setWorkingKey] = useState<string | null>(null);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [createGroupName, setCreateGroupName] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddDayKey, setQuickAddDayKey] = useState('');
  const [quickAddSlotIndex, setQuickAddSlotIndex] = useState(0);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [hiddenMemberIds, setHiddenMemberIds] = useState<Set<string>>(new Set());
  const [activeWindow, setActiveWindow] = useState<RankedWindow | null>(null);

  const groupsSectionRef = useRef<HTMLDivElement>(null);
  const inviteSectionRef = useRef<HTMLDivElement>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const joinedInviteCodeRef = useRef<string | null>(null);

  const calendarDays = useMemo(() => buildCalendarWindow(weekStart, 7), [weekStart]);
  const weekLabel = useMemo(() => formatWeekLabel(weekStart), [weekStart]);
  const rangeStart = calendarDays[0]?.dateKey ?? '';
  const rangeEnd = calendarDays[calendarDays.length - 1]?.dateKey ?? '';
  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? null;
  const inviteLink = selectedGroup
    ? `${window.location.origin}${window.location.pathname}#/join/${encodeURIComponent(selectedGroup.inviteCode)}`
    : '';

  useEffect(() => {
    document.title = selectedGroup ? `Free Together - ${selectedGroup.name}` : 'Free Together - your live calendar';
    window.scrollTo(0, 0);
  }, [selectedGroup]);

  useEffect(() => {
    if (!calendarDays.some((day) => day.dateKey === quickAddDayKey)) {
      setQuickAddDayKey(calendarDays[0]?.dateKey ?? '');
    }
  }, [calendarDays, quickAddDayKey]);

  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = (17 - 8) * 52 - 80;
    }
  }, [weekStart]);

  useEffect(() => {
    if (!toast) return;

    const timeoutId = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  useEffect(() => {
    if (!notice) return;

    const timeoutId = window.setTimeout(() => setNotice(null), 4200);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const refreshSnapshot = async (groupId: string) => {
    setLoadingGroup(true);

    try {
      const nextSnapshot = await loadGroupSnapshot(groupId, rangeStart, rangeEnd);
      setSnapshot(nextSnapshot);
    } catch (error) {
      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to load group availability right now.'),
      });
    } finally {
      setLoadingGroup(false);
    }
  };

  const refreshDashboard = async (preferredGroupId?: string) => {
    setLoadingDashboard(true);

    try {
      const [nextGroups, nextIncomingInvites] = await Promise.all([
        listMyGroups(user.id),
        user.email ? listIncomingInvites(user.email) : Promise.resolve([]),
      ]);

      setGroups(nextGroups);
      setIncomingInvites(nextIncomingInvites);
      setSelectedGroupId((current) => {
        if (preferredGroupId && nextGroups.some((group) => group.id === preferredGroupId)) {
          return preferredGroupId;
        }

        if (current && nextGroups.some((group) => group.id === current)) {
          return current;
        }

        return nextGroups[0]?.id ?? null;
      });
    } catch (error) {
      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to load your Supabase dashboard.'),
      });
    } finally {
      setLoadingDashboard(false);
    }
  };

  useEffect(() => {
    void refreshDashboard();
  }, [user.email, user.id]);

  useEffect(() => {
    if (!selectedGroupId) {
      setSnapshot(null);
      return;
    }

    void refreshSnapshot(selectedGroupId);
  }, [selectedGroupId, rangeEnd, rangeStart]);

  useEffect(() => {
    if (!joinInviteCode || joinedInviteCodeRef.current === joinInviteCode) {
      return;
    }

    joinedInviteCodeRef.current = joinInviteCode;
    setWorkingKey('join-group');

    let cancelled = false;

    void (async () => {
      try {
        const joinedGroup = await joinGroupByInviteCode(user, joinInviteCode);
        if (cancelled) return;

        await refreshDashboard(joinedGroup.groupId);
        if (cancelled) return;

        setShowInviteForm(false);
        setNotice({
          tone: 'success',
          text: `You joined ${joinedGroup.groupName}. Add your availability to get the group moving.`,
        });
        setToast('Group joined');
        window.location.hash = '#/app';
      } catch (error) {
        if (cancelled) return;

        setNotice({
          tone: 'error',
          text: messageFromError(error, 'Unable to join that group from the invite link.'),
        });
      } finally {
        if (!cancelled) {
          setWorkingKey(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [joinInviteCode, user]);

  const members = useMemo<DecoratedMember[]>(
    () =>
      (snapshot?.members ?? []).map((member: GroupMember) => ({
        ...member,
        color: avatarPalette[paletteIndex(member.userId)],
        isMe: member.userId === user.id,
        label: initials(member.fullName || member.email || 'F'),
      })),
    [snapshot, user.id],
  );

  const availabilityBySlot = useMemo(() => {
    const nextMap = new Map<string, Set<string>>();

    (snapshot?.availability ?? []).forEach((item) => {
      const key = `${item.slotDate}-${item.slotIndex}`;
      const current = nextMap.get(key) ?? new Set<string>();
      current.add(item.userId);
      nextMap.set(key, current);
    });

    return nextMap;
  }, [snapshot]);

  const mySlotKeys = useMemo(
    () =>
      new Set(
        (snapshot?.availability ?? [])
          .filter((item) => item.userId === user.id)
          .map((item) => `${item.slotDate}-${item.slotIndex}`),
      ),
    [snapshot, user.id],
  );

  const visibleMembers = useMemo(
    () => members.filter((member) => !hiddenMemberIds.has(member.userId)),
    [hiddenMemberIds, members],
  );

  const visibleMemberIds = useMemo(
    () => new Set(visibleMembers.map((member) => member.userId)),
    [visibleMembers],
  );

  const rankedWindows = useMemo<RankedWindow[]>(() => {
    if (visibleMembers.length === 0) {
      return [];
    }

    return calendarDays
      .flatMap((day) =>
        day.slots.map((slot) => {
          const key = `${slot.dateKey}-${slot.slotIndex}`;
          const openIds = availabilityBySlot.get(key) ?? new Set<string>();
          const openMembers = visibleMembers.filter((member) => openIds.has(member.userId));

          return {
            count: openMembers.length,
            key,
            openMembers,
            slot,
            total: visibleMembers.length,
          };
        }),
      )
      .filter((window) => window.count > 0)
      .sort((left, right) => right.count - left.count || left.slot.key.localeCompare(right.slot.key))
      .slice(0, 6);
  }, [availabilityBySlot, calendarDays, visibleMembers]);

  const perfectWindows = useMemo(
    () => rankedWindows.filter((window) => window.total > 1 && window.count === window.total),
    [rankedWindows],
  );

  const pendingGroupInvites = (snapshot?.invites ?? []).filter((invite) => invite.status === 'pending');

  const openGroupsPanel = () => {
    groupsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openInvitePanel = () => {
    if (!selectedGroupId) {
      setNotice({ tone: 'error', text: 'Create or select a group before you invite someone.' });
      return;
    }

    setShowInviteForm(true);
    window.setTimeout(() => {
      inviteSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleCreateGroup = async () => {
    if (!createGroupName.trim()) return;

    setWorkingKey('create-group');

    try {
      const groupId = await createGroup(user, createGroupName);
      setCreateGroupName('');
      setNotice({ tone: 'success', text: 'Group created. Start inviting friends or add your own schedule.' });
      setToast('Group created');
      await refreshDashboard(groupId);
      setShowInviteForm(true);
    } catch (error) {
      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to create that group right now.'),
      });
    } finally {
      setWorkingKey(null);
    }
  };

  const handleInviteMember = async () => {
    if (!selectedGroupId || !inviteEmail.trim()) return;

    setWorkingKey('invite-member');

    try {
      await inviteMember(selectedGroupId, inviteEmail, inviteName);
      setInviteEmail('');
      setInviteName('');
      setNotice({ tone: 'success', text: 'Invite saved. Your friend can accept it after they sign in.' });
      setToast('Invite saved');
      await refreshSnapshot(selectedGroupId);
    } catch (error) {
      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to create that invite.'),
      });
    } finally {
      setWorkingKey(null);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!inviteLink) return;

    setWorkingKey('share-link');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        window.prompt('Copy this invite link', inviteLink);
      }

      setNotice({ tone: 'success', text: 'Invite link copied. Send it to your friends.' });
      setToast('Invite link copied');
    } catch (error) {
      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to copy that invite link right now.'),
      });
    } finally {
      setWorkingKey(null);
    }
  };

  const handleShareInviteLink = async () => {
    if (!selectedGroup || !inviteLink) return;

    setWorkingKey('share-link');

    try {
      if (navigator.share) {
        await navigator.share({
          text: `Join ${selectedGroup.name} on Free Together.`,
          title: `${selectedGroup.name} invite`,
          url: inviteLink,
        });
        setNotice({ tone: 'success', text: 'Invite link ready to send.' });
        setToast('Invite link shared');
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        window.prompt('Copy this invite link', inviteLink);
      }

      setNotice({ tone: 'success', text: 'Invite link copied. Send it to your friends.' });
      setToast('Invite link copied');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to share that invite link right now.'),
      });
    } finally {
      setWorkingKey(null);
    }
  };

  const handleAcceptInvite = async (inviteId: string) => {
    setWorkingKey(`accept-${inviteId}`);

    try {
      const joinedGroupId = await acceptInvite(user, inviteId);
      setNotice({ tone: 'success', text: 'Invite accepted. That group is now in your dashboard.' });
      setToast('Invite accepted');
      await refreshDashboard(joinedGroupId);
    } catch (error) {
      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to accept that invite.'),
      });
    } finally {
      setWorkingKey(null);
    }
  };

  const handleToggleAvailability = async (slot: (typeof calendarDays)[number]['slots'][number]) => {
    if (!selectedGroupId) return;

    const key = `${slot.dateKey}-${slot.slotIndex}`;
    const nextAvailable = !mySlotKeys.has(key);
    setWorkingKey(key);

    try {
      await setAvailability(
        selectedGroupId,
        user.id,
        slot.dateKey,
        slot.slotIndex,
        slot.startsAt,
        slot.endsAt,
        nextAvailable,
      );

      setSnapshot((current) =>
        replaceAvailability(
          current,
          {
            slotDate: slot.dateKey,
            slotIndex: slot.slotIndex,
            userId: user.id,
          },
          nextAvailable,
        ),
      );
    } catch (error) {
      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to save that availability update.'),
      });
    } finally {
      setWorkingKey(null);
    }
  };

  const handleQuickAdd = async () => {
    const day = calendarDays.find((item) => item.dateKey === quickAddDayKey) ?? calendarDays[0];
    const slot = day?.slots[quickAddSlotIndex];

    if (!day || !slot) return;

    const key = `${slot.dateKey}-${slot.slotIndex}`;
    if (mySlotKeys.has(key)) {
      setToast('That window is already on your schedule');
      return;
    }

    setWorkingKey('quick-add');

    try {
      await setAvailability(
        selectedGroupId!,
        user.id,
        slot.dateKey,
        slot.slotIndex,
        slot.startsAt,
        slot.endsAt,
        true,
      );

      setSnapshot((current) =>
        replaceAvailability(
          current,
          {
            slotDate: slot.dateKey,
            slotIndex: slot.slotIndex,
            userId: user.id,
          },
          true,
        ),
      );
      setQuickAddOpen(false);
      setToast(`Added ${slot.label}`);
    } catch (error) {
      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to add that availability block.'),
      });
    } finally {
      setWorkingKey(null);
    }
  };

  const handleClearWeek = async () => {
    if (!selectedGroupId) return;

    setWorkingKey('clear-week');

    try {
      await clearAvailabilityRange(selectedGroupId, user.id, rangeStart, rangeEnd);
      setSnapshot((current) =>
        current
          ? {
              ...current,
              availability: current.availability.filter((item) => item.userId !== user.id),
            }
          : current,
      );
      setNotice({ tone: 'success', text: 'Your availability for this week was cleared.' });
      setToast('Week cleared');
    } catch (error) {
      setNotice({
        tone: 'error',
        text: messageFromError(error, 'Unable to clear your availability.'),
      });
    } finally {
      setWorkingKey(null);
    }
  };

  const handleToggleMember = (memberId: string) => {
    setHiddenMemberIds((current) => {
      const next = new Set(current);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  const handleShareWindow = async () => {
    if (!activeWindow) return;

    const message = `${selectedGroup?.name ?? 'Free Together'}: ${activeWindow.slot.fullLabel} works for ${activeWindow.count}/${activeWindow.total} visible friends.`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
      }
      setToast('Copied suggestion for your group chat');
      setNotice({ tone: 'success', text: 'That time was copied so you can drop it in the group chat.' });
    } catch {
      setToast('Time picked for the group');
    } finally {
      setActiveWindow(null);
    }
  };

  const handleSignOut = async () => {
    const supabase = requireSupabase();
    await supabase.auth.signOut();
    window.location.hash = '#/auth/login';
  };

  const calendarHint = selectedGroup
    ? 'Click any outlined window to mark yourself free. Bright green overlays mean every visible friend overlaps there.'
    : 'Create or join a group to unlock the timeline.';

  return (
    <div className={styles.appShell}>
      <DashboardTopbar
        groupName={selectedGroup?.name ?? 'Pick a group'}
        groupSubtitle={selectedGroup ? `${visibleMembers.length} visible members` : user.email ?? 'Signed in'}
        inviteDisabled={!selectedGroupId}
        members={members}
        weekLabel={weekLabel}
        onNextWeek={() => setWeekStart((current) => shiftWeek(current, 1))}
        onOpenGroups={openGroupsPanel}
        onOpenInvite={openInvitePanel}
        onPrevWeek={() => setWeekStart((current) => shiftWeek(current, -1))}
        onSignOut={handleSignOut}
        userLabel={initials(user.email ?? 'Y')}
      />

      <div className={styles.dashboardBody}>
        <DashboardSidebar
          calendarDays={calendarDays}
          clearDisabled={!selectedGroupId || workingKey === 'clear-week'}
          createBusy={workingKey === 'create-group'}
          createGroupName={createGroupName}
          groups={groups}
          groupsSectionRef={groupsSectionRef}
          hiddenMemberIds={hiddenMemberIds}
          incomingInvites={incomingInvites}
          inviteBusy={workingKey === 'invite-member'}
          inviteEmail={inviteEmail}
          inviteLink={inviteLink}
          inviteName={inviteName}
          inviteSectionRef={inviteSectionRef}
          members={members}
          pendingGroupInvites={pendingGroupInvites}
          quickAddBusy={workingKey === 'quick-add'}
          quickAddDayKey={quickAddDayKey}
          quickAddOpen={quickAddOpen}
          quickAddSlotIndex={quickAddSlotIndex}
          rankedWindows={rankedWindows}
          selectedGroup={selectedGroup}
          selectedGroupId={selectedGroupId}
          shareLinkBusy={workingKey === 'share-link'}
          showInviteForm={showInviteForm}
          workingInviteId={workingKey?.startsWith('accept-') ? workingKey.replace('accept-', '') : null}
          onAcceptInvite={handleAcceptInvite}
          onCopyInviteLink={handleCopyInviteLink}
          onClearWeek={handleClearWeek}
          onCreateGroup={handleCreateGroup}
          onCreateGroupNameChange={setCreateGroupName}
          onInviteEmailChange={setInviteEmail}
          onInviteMember={handleInviteMember}
          onInviteNameChange={setInviteName}
          onOpenWindow={setActiveWindow}
          onQuickAddDayChange={setQuickAddDayKey}
          onQuickAddOpenChange={setQuickAddOpen}
          onQuickAddSave={handleQuickAdd}
          onQuickAddSlotIndexChange={setQuickAddSlotIndex}
          onSelectGroup={setSelectedGroupId}
          onShareInviteLink={handleShareInviteLink}
          onShowInviteFormChange={setShowInviteForm}
          onToggleMember={handleToggleMember}
        />

        <DashboardCalendar
          availabilityBySlot={availabilityBySlot}
          calendarDays={calendarDays}
          emptyMessage={
            loadingDashboard
              ? 'Loading your groups from Supabase...'
              : loadingGroup
                ? 'Refreshing live availability...'
                : calendarHint
          }
          loading={loadingGroup}
          members={members}
          mySlotKeys={mySlotKeys}
          openWindow={setActiveWindow}
          perfectWindows={perfectWindows}
          scrollRef={mainScrollRef}
          selectedGroupName={selectedGroup?.name ?? null}
          toggleAvailability={handleToggleAvailability}
          visibleMemberIds={visibleMemberIds}
          workingKey={workingKey}
        />
      </div>

      {notice && (
        <div
          className={styles.toast}
          style={{
            background: notice.tone === 'error' ? 'var(--coral)' : 'var(--ink)',
            color: 'var(--primary-ink)',
          }}
        >
          {notice.text}
        </div>
      )}

      {toast && !notice && <div className={styles.toast}>{toast}</div>}

      <LockInModal
        groupName={selectedGroup?.name ?? 'your group'}
        openWindow={activeWindow}
        onClose={() => setActiveWindow(null)}
        onConfirm={() => void handleShareWindow()}
      />
    </div>
  );
}
