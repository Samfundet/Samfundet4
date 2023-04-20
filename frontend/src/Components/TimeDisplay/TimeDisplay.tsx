import { format, isToday, isTomorrow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

type TimeDisplayType = 'datetime' | 'date' | 'nice-date' | 'time' | 'event-date' | 'event-datetime';

type TimeDisplayProps = {
  timestamp: string | Date;
  displayType?: TimeDisplayType;
  className?: string;
};

export function TimeDisplay({ timestamp, className, displayType = 'datetime' }: TimeDisplayProps) {
  const { t } = useTranslation();

  const date = new Date(timestamp);
  const niceDays = [
    t(KEY.common_day_sunday),
    t(KEY.common_day_monday),
    t(KEY.common_day_tuesday),
    t(KEY.common_day_wednesday),
    t(KEY.common_day_thursday),
    t(KEY.common_day_friday),
    t(KEY.common_day_saturday),
  ];
  const niceMonths = [
    t(KEY.common_month_january),
    t(KEY.common_month_february),
    t(KEY.common_month_march),
    t(KEY.common_month_april),
    t(KEY.common_month_may),
    t(KEY.common_month_june),
    t(KEY.common_month_july),
    t(KEY.common_month_august),
    t(KEY.common_month_september),
    t(KEY.common_month_october),
    t(KEY.common_month_november),
    t(KEY.common_month_december),
  ];

  function getEventString() {
    // Time string
    let timeStr = '';
    if (displayType === 'event-datetime') {
      timeStr = `, ${date.toLocaleTimeString('no-NO', { timeStyle: 'short' })}`;
    }
    // Today
    if (isToday(date)) {
      return `${t(KEY.common_today)}${timeStr}`;
    }
    // Tomorrow
    if (isTomorrow(date)) {
      return `${t(KEY.common_today)}${timeStr}`;
    }
    // Default
    return `${format(date, 'd. MMM')}${timeStr}`;
  }

  function getString() {
    switch (displayType) {
      case 'datetime':
        return date.toLocaleString();
      case 'date':
        return date.toLocaleDateString();
      case 'nice-date':
        return `${niceDays[date.getDay()]} ${date.getDate()}. ${niceMonths[date.getMonth()]}`;
      case 'time':
        return date.toTimeString().slice(0, 5);
      case 'event-date':
      case 'event-datetime':
        return getEventString();
    }
  }

  return <p className={className}>{getString()}</p>;
}
