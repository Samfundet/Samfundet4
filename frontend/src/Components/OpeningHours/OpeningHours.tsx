import { useTranslation } from 'react-i18next';
import { Text } from '~/Components/Text/Text';
import { Link } from '~/Components/Link/Link';
import { TimeDuration } from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from './OpeningHours.module.scss';

type VenueOpeningProp = {
  name: string;
  opening: string;
  closing: string;
};

type OpeningHoursProps = {
  venues: VenueOpeningProp[];
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
              <Link url={'information/' + venue.name}>
                <p className={styles.openingHoursText}>{venue.name}</p>
              </Link>
            </td>
            <td className={styles.startEnd}>
              <TimeDuration className={styles.openingHoursText} start={venue.opening} end={venue.closing} />
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}
