import { useEffect, useRef } from 'react';
import AvatarStack from '../../ui/AvatarStack';
import Avatar from '../../ui/Avatar';
import type { GroupChatMessage } from '../../../lib/appData';
import styles from './Dashboard.module.css';
import type { GroupChatPageProps } from './types';

/** Consecutive messages from the same person within this gap are grouped (avatar + name hidden). */
const RUN_GROUP_GAP_MS = 5 * 60 * 1000;

function initials(value: string) {
  return (
    value
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || '?'
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDayLabel(value: string) {
  const date = new Date(value);
  const diffDays = Math.round((startOfDay(new Date()).getTime() - startOfDay(date).getTime()) / 86_400_000);

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString(undefined, { weekday: 'long' });
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

type ThreadItem =
  | { kind: 'day'; key: string; label: string }
  | { kind: 'message'; key: string; message: GroupChatMessage; run: boolean };

/** Flatten the message list into render items, inserting day separators and run-grouping flags. */
function buildThread(messages: GroupChatMessage[]): ThreadItem[] {
  const items: ThreadItem[] = [];
  let prevSenderId: string | null = null;
  let prevTimeMs = 0;
  let prevDayKey = '';

  messages.forEach((message) => {
    const created = new Date(message.createdAt);
    const dayKey = created.toDateString();

    if (dayKey !== prevDayKey) {
      items.push({ kind: 'day', key: `day-${dayKey}`, label: formatDayLabel(message.createdAt) });
      prevDayKey = dayKey;
      prevSenderId = null;
      prevTimeMs = 0;
    }

    const run = message.userId === prevSenderId && created.getTime() - prevTimeMs < RUN_GROUP_GAP_MS;
    items.push({ kind: 'message', key: message.id, message, run });

    prevSenderId = message.userId;
    prevTimeMs = created.getTime();
  });

  return items;
}

export default function GroupChatPage({
  busy,
  draft,
  groupName,
  loading,
  members,
  messages,
  onBack,
  onDraftChange,
  onSendMessage,
  userId,
}: GroupChatPageProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!threadRef.current || loading) return;
    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [loading, messages.length]);

  // Grow the composer with its content, up to the CSS max-height.
  useEffect(() => {
    const field = inputRef.current;
    if (!field) return;
    field.style.height = 'auto';
    field.style.height = `${Math.min(160, field.scrollHeight)}px`;
  }, [draft]);

  const canSend = !busy && draft.trim().length > 0;

  const submit = () => {
    if (canSend) onSendMessage();
  };

  const threadItems = buildThread(messages);
  const memberCountLabel = `${members.length} ${members.length === 1 ? 'member' : 'members'}`;

  return (
    <main className={styles.chatScreen} aria-labelledby="group-chat-title">
      <header className={styles.chHead}>
        <AvatarStack overlap={10}>
          {members.slice(0, 5).map((member) => (
            <Avatar key={member.userId} borderColor="var(--surface)" color={member.color} label={member.label} size={34} />
          ))}
        </AvatarStack>

        <div className={styles.chTitle}>
          <h1 id="group-chat-title">{groupName}</h1>
          <span className={styles.chSub}>
            <b>{memberCountLabel}</b>
            <span aria-hidden="true">·</span>
            <span className={styles.chPresence}>
              <span className={styles.chPip} aria-hidden="true" />
              Live group chat
            </span>
          </span>
        </div>

        <div className={styles.chActions}>
          <button
            type="button"
            className={`${styles.chIconButton} ${styles.chIconButtonCalendar}`}
            onClick={onBack}
            aria-label="View calendar"
            title="View calendar"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="2.5" y="4" width="13" height="11.5" rx="1.8" stroke="currentColor" strokeWidth="2" />
              <path d="M2.5 7.5h13M6 2v3M12 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <rect x="10.5" y="10" width="3.5" height="3.5" rx="0.8" fill="currentColor" />
            </svg>
          </button>
        </div>
      </header>

      <div ref={threadRef} className={styles.thread} aria-live="polite">
        {loading ? (
          <div className={styles.threadState}>Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className={styles.threadState}>No messages yet — start the conversation for this group.</div>
        ) : (
          threadItems.map((item) => {
            if (item.kind === 'day') {
              return (
                <div key={item.key} className={styles.daySep}>
                  {item.label}
                </div>
              );
            }

            const { message, run } = item;
            const mine = message.userId === userId;
            const sender = members.find((member) => member.userId === message.userId);
            const color = sender?.color ?? 'var(--ink-soft)';
            const label = sender?.label ?? initials(message.senderName);
            const name = mine ? 'You' : sender?.fullName || message.senderName || 'Member';

            return (
              <article
                key={item.key}
                className={`${styles.msg} ${mine ? styles.msgMine : ''} ${run ? styles.msgRun : ''}`}
              >
                <span className={styles.msgAv} style={{ background: color }} aria-hidden="true">
                  {label}
                </span>
                <div className={styles.msgContent}>
                  <div className={styles.msgMeta}>
                    <b>{name}</b>
                    <span>{formatTime(message.createdAt)}</span>
                  </div>
                  <div className={styles.msgBubble}>{message.body}</div>
                </div>
              </article>
            );
          })
        )}
      </div>

      <footer className={styles.composer}>
        <form
          className={styles.inputRow}
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <textarea
            ref={inputRef}
            className={styles.composerInput}
            rows={1}
            aria-label="Message"
            placeholder={`Message ${groupName}…`}
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!canSend}
            aria-label={busy ? 'Sending…' : 'Send message'}
            title="Send"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 10l14-7-5 17-2.5-7L3 10z" fill="currentColor" />
            </svg>
          </button>
        </form>
      </footer>
    </main>
  );
}
