import { useEffect, useMemo, useState } from 'react';
import {
  days,
  defaultWorkPresetId,
  groups,
  slots,
  workPresets,
  type FriendSchedule,
} from '../../data/groupSchedule';
import Avatar from '../ui/Avatar';
import AvatarStack from '../ui/AvatarStack';
import Logo from '../ui/Logo';
import styles from './AppHome.module.css';

type Panel = 'workdays' | 'friends' | 'groups';

interface RankedWindow {
  dayIndex: number;
  slotIndex: number;
  count: number;
  openMembers: FriendSchedule[];
}

const panelLabels: Record<Panel, string> = {
  workdays: 'Add workdays',
  friends: 'Add friends',
  groups: 'Switch group',
};

function formatWindow(dayIndex: number, slotIndex: number) {
  return `${days[dayIndex].full} at ${slots[slotIndex].label}`;
}

function toneForCount(count: number, total: number) {
  if (count === 0) return 'color-mix(in srgb, var(--ink) 4%, white)';

  const ratio = count / total;
  if (ratio < 0.4) return 'color-mix(in srgb, var(--coral) 22%, white)';
  if (ratio < 0.7) return 'color-mix(in srgb, var(--sun) 48%, white)';
  if (ratio < 1) return 'color-mix(in srgb, var(--sky) 36%, white)';
  return 'color-mix(in srgb, var(--mint) 84%, white)';
}

function textTone(count: number, total: number) {
  return count / total > 0.82 ? 'white' : 'var(--ink)';
}

function availabilityLabel(count: number, total: number) {
  if (count === 0) return 'No overlap';
  if (count === total) return 'All free';

  const ratio = count / total;
  if (ratio < 0.4) return 'A few free';
  if (ratio < 0.7) return 'Good shot';
  return 'Almost everyone';
}

export default function AppHome() {
  const [activePanel, setActivePanel] = useState<Panel>('workdays');
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0]?.id ?? '');
  const [selectedWorkPresetId, setSelectedWorkPresetId] = useState(defaultWorkPresetId);
  const [addedByGroup, setAddedByGroup] = useState<Record<string, string[]>>({});

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0];
  const selectedWorkPreset =
    workPresets.find((preset) => preset.id === selectedWorkPresetId) ?? workPresets[0];

  const addedFriendIds = addedByGroup[selectedGroup.id] ?? [];

  const members = useMemo(() => {
    const you: FriendSchedule = {
      id: 'maya',
      name: 'Maya Rivera',
      label: 'M',
      role: selectedWorkPreset.label,
      color: selectedWorkPreset.accent,
      availability: selectedWorkPreset.availability,
    };

    const addedFriends = selectedGroup.suggestions.filter((friend) =>
      addedFriendIds.includes(friend.id),
    );

    return [you, ...selectedGroup.members, ...addedFriends];
  }, [addedFriendIds, selectedGroup, selectedWorkPreset]);

  const availabilityCounts = useMemo(
    () =>
      days.map((_, dayIndex) =>
        slots.map((_, slotIndex) =>
          members.reduce(
            (count, member) => count + Number(member.availability[dayIndex][slotIndex]),
            0,
          ),
        ),
      ),
    [members],
  );

  const rankedWindows = useMemo(() => {
    const windows: RankedWindow[] = [];

    availabilityCounts.forEach((dayCounts, dayIndex) => {
      dayCounts.forEach((count, slotIndex) => {
        if (count === 0) return;
        const openMembers = members.filter((member) => member.availability[dayIndex][slotIndex]);
        windows.push({ dayIndex, slotIndex, count, openMembers });
      });
    });

    return windows
      .sort((a, b) => b.count - a.count || a.dayIndex - b.dayIndex || a.slotIndex - b.slotIndex)
      .slice(0, 3);
  }, [availabilityCounts, members]);

  const bestWindow = rankedWindows[0];
  const availableSuggestions = selectedGroup.suggestions.filter(
    (friend) => !addedFriendIds.includes(friend.id),
  );

  useEffect(() => {
    document.title = 'Free Together - your group calendar';
    window.scrollTo(0, 0);
  }, []);

  const toggleSuggestedFriend = (friendId: string) => {
    setAddedByGroup((current) => {
      const nextForGroup = current[selectedGroup.id] ?? [];
      const hasFriend = nextForGroup.includes(friendId);

      return {
        ...current,
        [selectedGroup.id]: hasFriend
          ? nextForGroup.filter((id) => id !== friendId)
          : [...nextForGroup, friendId],
      };
    });
  };

  return (
    <div className={styles.appShell}>
      <header className={styles.topbar}>
        <div className={`wrap ${styles.topbarInner}`}>
          <a href="#/app" className={styles.brand} aria-label="Free Together home">
            <Logo width={34} height={28} />
            Free Together
          </a>

          <div className={styles.topActions}>
            {(Object.keys(panelLabels) as Panel[]).map((panel) => (
              <button
                key={panel}
                type="button"
                className={`${styles.actionButton} ${
                  activePanel === panel ? styles.actionButtonActive : ''
                }`}
                onClick={() => setActivePanel(panel)}
              >
                {panelLabels[panel]}
              </button>
            ))}

            <a href="#top" className={styles.signOut}>
              Log out
            </a>
          </div>
        </div>
      </header>

      <main className={`wrap ${styles.page}`}>
        <section className={styles.summaryCard}>
          <div className={styles.summaryText}>
            <p className={styles.kicker}>Signed in and synced</p>
            <h1>See when the whole group is actually free.</h1>
            <p className={styles.lead}>
              Color tells you the overlap level instantly, so the best nights stand out before the
              group chat starts spiraling.
            </p>
          </div>

          <div className={styles.summaryMeta}>
            <div className={styles.groupChip}>
              <span>{selectedGroup.name}</span>
              <small>{selectedGroup.vibe}</small>
            </div>

            <AvatarStack overlap={10}>
              {members.map((member) => (
                <Avatar
                  key={member.id}
                  label={member.label}
                  color={member.color}
                  size={40}
                  borderColor="var(--ink)"
                />
              ))}
            </AvatarStack>
          </div>
        </section>

        <section className={styles.board}>
          <aside className={styles.leftRail}>
            <div className={styles.panelCard}>
              <p className={styles.panelEyebrow}>{panelLabels[activePanel]}</p>

              {activePanel === 'workdays' && (
                <>
                  <h2>Update your shifts</h2>
                  <p className={styles.panelLead}>
                    Choose the work pattern that matches your week. The calendar will recalculate
                    around your availability.
                  </p>

                  <div className={styles.choiceList}>
                    {workPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        className={`${styles.choiceCard} ${
                          selectedWorkPresetId === preset.id ? styles.choiceCardActive : ''
                        }`}
                        onClick={() => setSelectedWorkPresetId(preset.id)}
                      >
                        <span
                          className={styles.choiceDot}
                          style={{ background: preset.accent }}
                          aria-hidden="true"
                        />
                        <span className={styles.choiceText}>
                          <strong>{preset.label}</strong>
                          <small>{preset.detail}</small>
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activePanel === 'friends' && (
                <>
                  <h2>Build the group</h2>
                  <p className={styles.panelLead}>
                    Add a friend and the heatmap updates to reflect the harder scheduling math.
                  </p>

                  <div className={styles.choiceList}>
                    {selectedGroup.suggestions.map((friend) => {
                      const added = addedFriendIds.includes(friend.id);
                      return (
                        <button
                          key={friend.id}
                          type="button"
                          className={`${styles.choiceCard} ${
                            added ? styles.choiceCardActive : ''
                          }`}
                          onClick={() => toggleSuggestedFriend(friend.id)}
                        >
                          <Avatar
                            label={friend.label}
                            color={friend.color}
                            size={38}
                            borderColor="var(--ink)"
                          />
                          <span className={styles.choiceText}>
                            <strong>{friend.name}</strong>
                            <small>{friend.role}</small>
                          </span>
                          <span className={styles.choiceTag}>{added ? 'Added' : 'Add'}</span>
                        </button>
                      );
                    })}
                  </div>

                  {availableSuggestions.length === 0 && (
                    <p className={styles.helperNote}>
                      Everyone from the invite list is already in this group.
                    </p>
                  )}
                </>
              )}

              {activePanel === 'groups' && (
                <>
                  <h2>Jump between crews</h2>
                  <p className={styles.panelLead}>
                    Each group keeps its own added friends, so switching contexts feels immediate.
                  </p>

                  <div className={styles.choiceList}>
                    {groups.map((group) => (
                      <button
                        key={group.id}
                        type="button"
                        className={`${styles.choiceCard} ${
                          selectedGroupId === group.id ? styles.choiceCardActive : ''
                        }`}
                        onClick={() => setSelectedGroupId(group.id)}
                      >
                        <span className={styles.choiceText}>
                          <strong>{group.name}</strong>
                          <small>{group.vibe}</small>
                        </span>
                        <span className={styles.choiceTag}>
                          {group.members.length + 1 + (addedByGroup[group.id]?.length ?? 0)} people
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className={styles.noteCard}>
              <p className={styles.panelEyebrow}>How colors work</p>
              <div className={styles.legend}>
                <span className={styles.legendItem}>
                  <i style={{ background: toneForCount(1, 4) }} />
                  A few free
                </span>
                <span className={styles.legendItem}>
                  <i style={{ background: toneForCount(2, 4) }} />
                  Good overlap
                </span>
                <span className={styles.legendItem}>
                  <i style={{ background: toneForCount(3, 4) }} />
                  Strong overlap
                </span>
                <span className={styles.legendItem}>
                  <i style={{ background: toneForCount(4, 4) }} />
                  Everyone free
                </span>
              </div>
            </div>
          </aside>

          <section className={styles.calendarCard}>
            <div className={styles.calendarHead}>
              <div>
                <p className={styles.panelEyebrow}>Live group calendar</p>
                <h2>{selectedGroup.name}</h2>
              </div>

              <div className={styles.highlightPill}>
                <strong>
                  {bestWindow ? `${bestWindow.count}/${members.length} free` : 'No matches yet'}
                </strong>
                <small>
                  {bestWindow
                    ? `Best overlap: ${formatWindow(bestWindow.dayIndex, bestWindow.slotIndex)}`
                    : 'Try another workday pattern'}
                </small>
              </div>
            </div>

            <div className={styles.calendarScroll}>
              <div className={styles.calendarGrid}>
                <div className={styles.cornerCell}>Time</div>
                {days.map((day) => (
                  <div key={day.short} className={styles.dayHeader}>
                    <strong>{day.short}</strong>
                    <small>{day.full}</small>
                  </div>
                ))}

                {slots.map((slot, slotIndex) => (
                  <div className={styles.row} key={slot.id}>
                    <div className={styles.timeCell}>
                      <strong>{slot.label}</strong>
                      <small>{slot.detail}</small>
                    </div>

                    {days.map((day, dayIndex) => {
                      const count = availabilityCounts[dayIndex][slotIndex];
                      const openMembers = members.filter(
                        (member) => member.availability[dayIndex][slotIndex],
                      );
                      const title =
                        count === 0
                          ? `${day.full} ${slot.label}: no one is free`
                          : `${day.full} ${slot.label}: ${openMembers.map((member) => member.name).join(', ')}`;

                      return (
                        <div
                          key={`${day.short}-${slot.id}`}
                          className={`${styles.slotCell} ${
                            count === members.length ? styles.slotCellFull : ''
                          }`}
                          style={{
                            background: toneForCount(count, members.length),
                            color: textTone(count, members.length),
                          }}
                          title={title}
                        >
                          <strong>{count}</strong>
                          <small>{availabilityLabel(count, members.length)}</small>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className={styles.rightRail}>
            <div className={styles.panelCard}>
              <p className={styles.panelEyebrow}>Best windows</p>
              <h2>Start with the easiest yes</h2>

              <div className={styles.bestList}>
                {rankedWindows.map((window) => (
                  <div key={`${window.dayIndex}-${window.slotIndex}`} className={styles.bestItem}>
                    <div>
                      <strong>{formatWindow(window.dayIndex, window.slotIndex)}</strong>
                      <small>{window.openMembers.map((member) => member.name).join(', ')}</small>
                    </div>
                    <span className={styles.bestCount}>
                      {window.count}/{members.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.panelCard}>
              <p className={styles.panelEyebrow}>Who is in this group</p>
              <h2>{members.length} synced schedules</h2>

              <div className={styles.memberList}>
                {members.map((member) => (
                  <div key={member.id} className={styles.memberRow}>
                    <div className={styles.memberIdentity}>
                      <Avatar
                        label={member.label}
                        color={member.color}
                        size={38}
                        borderColor="var(--ink)"
                      />
                      <div>
                        <strong>{member.name}</strong>
                        <small>{member.role}</small>
                      </div>
                    </div>
                    <span className={styles.memberStatus}>Synced</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
