import styles from './DayColumn.module.scss';

type Event = {
  start: Date;
  end: Date;
  title: string;
};

type DayCalendarProps = {
  events: Event[];
};

const HOURS_IN_DAY = Array.from({ length: 24 });

function getIntervalFromDate(date: Date): number {
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  return hour * 12 + Math.floor(minute / 5);
}

function overlaps(event1: Event, event2: Event): boolean {
  const start1 = getIntervalFromDate(event1.start);
  const end1 = getIntervalFromDate(event1.end);
  const start2 = getIntervalFromDate(event2.start);
  const end2 = getIntervalFromDate(event2.end);

  return (start1 >= start2 && start1 < end2) || (end1 > start2 && end1 <= end2) || (start1 <= start2 && end1 >= end2);
}

function getOverlaps(event: Event, events: Event[]): number {
  return events.filter((otherEvent) => otherEvent !== event && overlaps(event, otherEvent)).length;
}

function getMaxSimultaneousOverlap(event: Event, sortedEvents: Event[], uptoIndex: number): number {
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

function EventBlock({ event, index, sortedEvents }: { event: Event; index: number; sortedEvents: Event[] }) {
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

function processEvents(events: Event[]) {
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

export function DayColumn({ events }: DayCalendarProps) {
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
