type TimeDisplayProps = {
  timestamp: string;
  displayType?: string;
  className?: string;
};

const DATETIME = 'datetime';
const DATE = 'date';
const TIME = 'time';

export function TimeDisplay({ timestamp, className, displayType = DATETIME }: TimeDisplayProps) {
  const date = new Date(timestamp);
  if (displayType == DATETIME) {
    return <p className={className}> {date.toLocaleString()}</p>;
  } else if (displayType == DATE) {
    return <p className={className}>{date.toDateString()}</p>;
  } else if (displayType == TIME) {
    return <p className={className}>{date.toTimeString().slice(0, 5)}</p>;
  }
}
