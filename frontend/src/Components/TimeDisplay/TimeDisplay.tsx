import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';

type TimeDisplayProps = {
  timestamp: string;
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
    t(KEY.day_sunday),
    t(KEY.day_monday),
    t(KEY.day_tuesday),
    t(KEY.day_wednesday),
    t(KEY.day_thursday),
    t(KEY.day_friday),
    t(KEY.day_saturday),
  ];
  const niceMonths = [
    t(KEY.month_january),
    t(KEY.month_february),
    t(KEY.month_march),
    t(KEY.month_april),
    t(KEY.month_may),
    t(KEY.month_june),
    t(KEY.month_july),
    t(KEY.month_august),
    t(KEY.month_september),
    t(KEY.month_october),
    t(KEY.month_november),
    t(KEY.month_december),
  ];

  if (displayType == DATETIME) {
    return <p className={className}> {date.toLocaleString()}</p>;
  } else if (displayType == DATE) {
    return <p className={className}>{date.toDateString()}</p>;
  } else if (displayType == NICEDATE) {
    return (
      <p className={className}>
        {niceDays[date.getDay()]} {date.getDate()}. {niceMonths[date.getMonth()]}
      </p>
    );
  } else if (displayType == EVENT) {
    var options = { dateStyle: 'short', timeStyle: 'short' };
    return (
      <p className={className}>
        {date.toLocaleString('no-NO', options)}
      </p>
    );
  }else if (displayType == TIME) {
    return <p className={className}>{date.toTimeString().slice(0, 5)}</p>;
  } else {
    return <p className={className}></p>
  }
}
