import { DAY_MILLIS, HOUR_MILLIS, MINUTE_MILLIS, SECOND_MILLIS } from '~/constants';

export function calculateTimeLeft(targetDate: Date): string {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) return '0m 0s';

  const days = Math.floor(difference / DAY_MILLIS);
  const hours = Math.floor((difference % DAY_MILLIS) / HOUR_MILLIS);
  const minutes = Math.floor((difference % HOUR_MILLIS) / MINUTE_MILLIS);
  const seconds = Math.floor((difference % MINUTE_MILLIS) / SECOND_MILLIS);

  if (days > 0) return `${days}d ${hours}h`;
  if (difference < 60 * SECOND_MILLIS) return `${seconds}s`;
  if (difference < 10 * MINUTE_MILLIS) return `${minutes}m ${seconds}s`;
  if (difference < 60 * MINUTE_MILLIS) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

export function hasReachedTargetDate(targetDate: Date): boolean {
  const now = new Date();
  return now.getTime() >= targetDate.getTime();
}
