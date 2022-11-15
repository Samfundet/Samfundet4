type TimeDisplayProps = {
  timestamp: string;
  showTime?: boolean;
};
export function TimeDisplay({ timestamp, showTime }: TimeDisplayProps) {
  const date = new Date(timestamp);
  if (showTime) {
    return <p> {date.toLocaleString()}</p>;
  } else {
    return <p>{date.toDateString()}</p>;
  }
}
