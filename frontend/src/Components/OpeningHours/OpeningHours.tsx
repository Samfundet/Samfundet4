import { useTranslation } from 'react-i18next';
import { Text } from '~/Components/Text/Text';
import { Link } from '~/Components/Link/Link';
import { TimeDuration } from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from './OpeningHours.module.scss';

type FakeVenue = {
  name: string;
  url: string;
  start: string;
  end: string;
};

type OpeningHoursProps = {
  venues: FakeVenue[];
};

export function OpeningHours({ venues }: OpeningHoursProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <Text size='l' as='strong' >{t(KEY.common_opening_hours)}</Text>
      <table className={styles.timeTable}>
        {venues.map((venue) => (
          <tr key={venue.name} className={styles.openingRow}>
            <td>
              <Link url={venue.url}>
                <p className={styles.openingHoursText}>{venue.name}</p>
              </Link>
            </td>
            <td className={styles.startEnd}>
              <TimeDuration className={styles.openingHoursText} start={venue.start} end={venue.end} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
