import { useTranslation } from 'react-i18next';
import { TimeDuration } from '~/Components';
import { Link } from '~/Components/Link/Link';
import { Text } from '~/Components/Text/Text';
import type { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { getVenueScheduleISO } from '~/utils';
import styles from './OpeningHours.module.scss';

type OpeningHoursProps = {
  venues: VenueDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function OpeningHours({ venues, isLoading, isError }: OpeningHoursProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return <Text>{t(KEY.common_loading)}</Text>;
  }

  if (isError || !venues) {
    return <Text>{t(KEY.error_generic)}</Text>;
  }

  return (
    <div className={styles.container}>
      <Text size="l" as="strong">
        {t(KEY.common_opening_hours)}
      </Text>
      <table className={styles.timeTable}>
        {venues.map((venue) => {
          const { startISO, endISO } = getVenueScheduleISO(venue);
          return (
            <tr key={venue.name} className={styles.openingRow}>
              <td className={styles.tableCell}>
                <Link url={`information/${venue.name}`}>
                  <p className={styles.openingHoursText}>{venue.name}</p>
                </Link>
              </td>
              <td className={styles.tableCell}>
                <TimeDuration className={styles.openingHoursText} start={startISO} end={endISO} />
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
