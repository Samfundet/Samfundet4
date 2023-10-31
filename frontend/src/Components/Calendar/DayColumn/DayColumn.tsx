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

export function DayColumn({ events }: DayCalendarProps) {
  const maxOverlap = events.reduce((acc, event, index) => {
    let overlapCount = 1;
    for (let i = 0; i < events.length; i++) {
      if (i !== index) {
        const otherStart = getIntervalFromDate(events[i].start);
        const otherEnd = getIntervalFromDate(events[i].end);
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
    return Math.max(acc, overlapCount);
  }, 0);

  const columnStyles = Array(maxOverlap).fill('1fr').join(' ');

  return (
    <div className={styles.calendar} style={{ gridTemplateColumns: `auto ${columnStyles}` }}>
      {/* Mapping for Hours */}
      {Array.from({ length: 24 }).map((_, hour) => (
        <div key={hour} className={styles.hour} style={{ gridRow: `span 12` }}>
          {hour}:00
        </div>
      ))}

      {/* Create a blank white background for each hour (spanning 12 5-minute intervals) */}
      {Array.from({ length: 24 }).map((_, hour) => (
        <div
          key={hour}
          className={styles.blank}
          style={{
            gridRow: `${hour * 12 + 1} / span 12`,
            gridColumn: 2,
            gridColumnEnd: -1,
          }}
        ></div>
      ))}

      {/* Mapping for Events */}
      {events.map((event, index) => {
        const startInterval = getIntervalFromDate(event.start);
        const endInterval = getIntervalFromDate(event.end);
        const span = endInterval - startInterval;

        let overlap = 0;
        for (let i = 0; i < index; i++) {
          const otherStart = getIntervalFromDate(events[i].start);
          const otherEnd = getIntervalFromDate(events[i].end);

          if (
            (startInterval >= otherStart && startInterval < otherEnd) ||
            (endInterval > otherStart && endInterval <= otherEnd) ||
            (startInterval <= otherStart && endInterval >= otherEnd)
          ) {
            overlap += 1;
          }
        }

        return (
          <div
            key={index}
            className={styles.event}
            style={{
              gridRow: `${startInterval + 1} / span ${span}`,
              gridColumn: 2 + overlap,
            }}
          >
            {event.title}
          </div>
        );
      })}
    </div>
  );
}
