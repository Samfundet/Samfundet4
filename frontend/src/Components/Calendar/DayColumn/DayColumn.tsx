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
  return (
    <div className={styles.calendar}>
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
            overlap = 1;
            break;
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
