import { DayColumn } from './DayColumn';
import styles from './WeekCalendar.module.scss';
import { CalendarEvent } from './utils';

type WeekCalendarProps = {
  events: CalendarEvent[];
  startDate?: Date; // Start date of the week
};

export function WeekCalendar({ events, startDate = new Date() }: WeekCalendarProps) {
  // Function to filter events for a specific date
  const filterEventsForDate = (date: Date) => {
    return events.filter((event) => event.start.toDateString() === date.toDateString());
  };

  // Render the 7 DayColumn components for each day of the week
  const renderDayColumns = () => {
    const columns = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dailyEvents = filterEventsForDate(currentDate);
      columns.push(<DayColumn key={i} events={dailyEvents} showHours={i === 0} />);
    }
    return columns;
  };

  return <div className={styles.weekCalendar}>{renderDayColumns()}</div>;
}
