import styles from './DayColumn.module.scss';

type Event = {
  start: Date;
  end: Date;
  title: string;
};

type DayCalendarProps = {
  events: Event[];
};

function getIntervalFromDate(date: Date): number {
  const hour = date.getUTCHours();
  const minute = date.getUTCMinutes();
  return hour * 12 + Math.floor(minute / 5);
}

function getOverlaps(event: Event, events: Event[]): number {
  let overlapCount = 0;
  for (const otherEvent of events) {
    if (otherEvent !== event) {
      const otherStart = getIntervalFromDate(otherEvent.start);
      const otherEnd = getIntervalFromDate(otherEvent.end);
      const currentStart = getIntervalFromDate(event.start);
      const currentEnd = getIntervalFromDate(event.end);
      if (
        (currentStart >= otherStart && currentStart < otherEnd) ||
        (currentEnd > otherStart && currentEnd <= otherEnd) ||
        (currentStart <= otherStart && currentEnd >= otherEnd)
      ) {
        overlapCount++;
      }
    }
  }
  return overlapCount;
}

function processEvents(events: Event[]) {
  const sortedEvents = [...events].sort((a, b) => getOverlaps(a, events) - getOverlaps(b, events));
  const maxOverlap = sortedEvents.reduce((acc, event) => {
    return Math.max(acc, getOverlaps(event, events));
  }, 0);

  return { sortedEvents, maxOverlap };
}

const HOURS_IN_DAY = Array.from({ length: 24 });

function HourColumn({ hour }: { hour: number }) {
  return (
    <div key={hour} className={styles.hour} style={{ gridRow: `span 12` }}>
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
        gridColumn: 2,
        gridColumnEnd: -1,
      }}
    ></div>
  );
}

function EventBlock({ event, index, sortedEvents }: { event: Event; index: number; sortedEvents: Event[] }) {
  const startInterval = getIntervalFromDate(event.start);
  const endInterval = getIntervalFromDate(event.end);
  const span = endInterval - startInterval;
  let maxSimultaneousOverlap = 0;

  for (let minute = startInterval; minute < endInterval; minute++) {
    let currentOverlap = 0;
    for (let i = 0; i < index; i++) {
      const otherStart = getIntervalFromDate(sortedEvents[i].start);
      const otherEnd = getIntervalFromDate(sortedEvents[i].end);
      if (minute >= otherStart && minute < otherEnd) {
        currentOverlap += 1;
      }
    }
    if (currentOverlap > maxSimultaneousOverlap) {
      maxSimultaneousOverlap = currentOverlap;
    }
  }

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
