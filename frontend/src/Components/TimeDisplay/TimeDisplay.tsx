import { format, isToday, isTomorrow } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import nb from 'date-fns/locale/nb';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

type TimeDisplayType =
  | 'datetime'
  | 'date'
  | 'nice-date'
  | 'time'
  | 'event-date'
  | 'event-datetime'
  | 'nice-month-year'
  | 'nice-date-time'
  | 'day-of-week'
  | 'short-day-of-week'
  | 'short-day-month';

type TimeDisplayProps = {
  timestamp: string | Date;
  displayType?: TimeDisplayType;
  className?: string;
};

export function TimeDisplay({ timestamp, className, displayType = 'datetime' }: TimeDisplayProps) {
  const { t, i18n } = useTranslation();

  const locale = i18n.language === 'nb' ? nb : enUS;

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
  const shortDays = [
    t(KEY.common_day_sunday_short),
    t(KEY.common_day_monday_short),
    t(KEY.common_day_tuesday_short),
    t(KEY.common_day_wednesday_short),
    t(KEY.common_day_thursday_short),
    t(KEY.common_day_friday_short),
    t(KEY.common_day_saturday_short),
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
    if (new Date() > date) {
      return t(KEY.common_now);
    }
    const timeStr = `, ${format(date, 'HH:mm', { locale })}`;
    if (isToday(date)) {
      return `${t(KEY.common_today)}${timeStr}`;
    }
    if (isTomorrow(date)) {
      return `${t(KEY.common_tomorrow)}${timeStr}`;
    }
    return format(date, 'E d. MMM, HH:mm', { locale });
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
      case 'nice-month-year':
        return `${niceMonths[date.getMonth()]} ${date.getFullYear()}`;
      case 'nice-date-time':
        return `${date.toTimeString().slice(0, 5)} || ${niceDays[date.getDay()]} ${date.getDate()}. ${niceMonths[date.getMonth()]}`;
      case 'short-day-month':
        return format(date, 'd. MMM', { locale });
      case 'day-of-week':
        return niceDays[date.getDay()];
      case 'short-day-of-week':
        return shortDays[date.getDay()];
    }
  }

  return <p className={className}>{getString()}</p>;
}
