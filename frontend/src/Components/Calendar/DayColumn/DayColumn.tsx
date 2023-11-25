import { CalendarEvent } from '../utils';
import styles from './DayColumn.module.scss';

type DayCalendarProps = {
  events: CalendarEvent[];
  showHours?: boolean;
};

const HOURS_IN_DAY = Array.from({ length: 24 });

function getIntervalFromDate(date: Date): number {
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  return hour * 12 + Math.floor(minute / 5);
}

function overlaps(event1: CalendarEvent, event2: CalendarEvent): boolean {
  const start1 = getIntervalFromDate(event1.start);
  const end1 = getIntervalFromDate(event1.end);
  const start2 = getIntervalFromDate(event2.start);
  const end2 = getIntervalFromDate(event2.end);

  return (start1 >= start2 && start1 < end2) || (end1 > start2 && end1 <= end2) || (start1 <= start2 && end1 >= end2);
}

function getOverlaps(event: CalendarEvent, events: CalendarEvent[]): number {
  return events.filter((otherEvent) => otherEvent !== event && overlaps(event, otherEvent)).length;
}

function getMaxSimultaneousOverlap(event: CalendarEvent, sortedEvents: CalendarEvent[], uptoIndex: number): number {
  const startInterval = getIntervalFromDate(event.start);
  const endInterval = getIntervalFromDate(event.end);
  let maxOverlap = 0;

  for (let minute = startInterval; minute < endInterval; minute++) {
    let currentOverlap = 0;
    for (let i = 0; i < uptoIndex; i++) {
      const otherStart = getIntervalFromDate(sortedEvents[i].start);
      const otherEnd = getIntervalFromDate(sortedEvents[i].end);
      if (minute >= otherStart && minute < otherEnd) {
        currentOverlap += 1;
      }
    }
    maxOverlap = Math.max(maxOverlap, currentOverlap);
  }
  return maxOverlap;
}

function EventBlock({
  event,
  index,
  sortedEvents,
}: {
  event: CalendarEvent;
  index: number;
  sortedEvents: CalendarEvent[];
}) {
  const startInterval = getIntervalFromDate(event.start);
  const endInterval = getIntervalFromDate(event.end);
  const span = endInterval - startInterval;
  const maxSimultaneousOverlap = getMaxSimultaneousOverlap(event, sortedEvents, index);

  return (
    <div
      key={index}
      className={styles.event}
      style={{
        gridRow: `${startInterval + 1} / span ${span}`,
        gridColumn: 2 + maxSimultaneousOverlap,
      }}
    >
      {event.title}
    </div>
  );
}

function processEvents(events: CalendarEvent[]) {
  const sortedEvents = [...events].sort((a, b) => getOverlaps(a, events) - getOverlaps(b, events));

  const maxOverlap = sortedEvents.reduce((acc, event, index) => {
    const overlapForEvent = getMaxSimultaneousOverlap(event, sortedEvents, index);
    return Math.max(acc, overlapForEvent);
  }, 0);

  return { sortedEvents, maxOverlap };
}

function HourColumn({ hour }: { hour: number }) {
  return (
    <div key={hour} className={styles.hour}>
      {hour}:00
    </div>
  );
}

function BlankHourBackground({ hour }: { hour: number }) {
  return (
    <div
      key={hour}
      className={styles.blank}
      style={{
        gridRow: `${hour * 12 + 1} / span 12`,
      }}
    ></div>
  );
}

export function DayColumn({ events, showHours = true }: DayCalendarProps) {
  const { sortedEvents, maxOverlap } = processEvents(events);
  const columnStyles = Array(maxOverlap + 1)
    .fill('1fr')
    .join(' ');

  return (
    <div className={styles.calendar} style={{ gridTemplateColumns: `auto ${columnStyles}` }}>
      {HOURS_IN_DAY.map((_, hour) => (
        <HourColumn key={hour} hour={hour} />
      ))}
      {HOURS_IN_DAY.map((_, hour) => (
        <BlankHourBackground key={hour} hour={hour} />
      ))}
      {sortedEvents.map((event, index) => (
        <EventBlock key={index} event={event} index={index} sortedEvents={sortedEvents} />
      ))}
    </div>
  );
}
