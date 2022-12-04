type TimeDisplayProps = {
  timestamp: string;
  displayType?: string;
};

const DATETIME = 'datetime';
const DATE = 'date';
const TIME = 'time';

export function TimeDisplay({ timestamp, displayType = DATETIME }: TimeDisplayProps) {
  const date = new Date(timestamp);
  if (displayType == DATETIME) {
    return <p> {date.toLocaleString()}</p>;
  } else if (displayType == DATE) {
    return <p>{date.toDateString()}</p>;
  } else if (displayType == TIME) {
    return <p>{date.toTimeString().slice(0, 5)}</p>;
  }
}
