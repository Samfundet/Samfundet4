import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

type TimeDisplayProps = {
  timestamp: string | Date;
  displayType?: string;
  className?: string;
};

const DATETIME = 'datetime';
const DATE = 'date';
const NICEDATE = 'nice-date';
const TIME = 'time';
const EVENT = 'event';

export function TimeDisplay({ timestamp, className, displayType = DATETIME }: TimeDisplayProps) {
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

  if (displayType == DATETIME) {
    return <p className={className}> {date.toLocaleString()}</p>;
  }

  if (displayType == DATE) {
    return <p className={className}>{date.toDateString()}</p>;
  }

  if (displayType == NICEDATE) {
    return (
      <p className={className}>
        {niceDays[date.getDay()]} {date.getDate()}. {niceMonths[date.getMonth()]}
      </p>
    );
  }

  if (displayType == EVENT) {
    const options = { dateStyle: 'short' as const, timeStyle: 'short' as const };
    return <p className={className}>{date.toLocaleString('no-NO', options)}</p>;
  }

  if (displayType == TIME) {
    return <p className={className}>{date.toTimeString().slice(0, 5)}</p>;
  }

  return <p className={className}></p>;
}
