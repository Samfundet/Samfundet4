import { useTranslation } from 'react-i18next';
import { TimeDuration } from '~/Components';
import { Link } from '~/Components/Link/Link';
import { Text } from '~/Components/Text/Text';
import type { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
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

  const today = new Date().toISOString().split('T')[0];
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div className={styles.container}>
      <Text size="l" as="strong">
        {t(KEY.common_opening_hours)}
      </Text>
      <table className={styles.timeTable}>
        {venues.map((venue) => {
          const openingTime = venue[`opening_${day}` as keyof VenueDto] as string;
          const closingTime = venue[`closing_${day}` as keyof VenueDto] as string;
          return (
            <tr key={venue.name} className={styles.openingRow}>
              <td className="tableCell">
                <Link url={`information/${venue.name}`}>
                  <p className={styles.openingHoursText}>{venue.name}</p>
                </Link>
              </td>
              <td className="tableCell">
                <TimeDuration
                  className={styles.openingHoursText}
                  start={`${today}T${openingTime}`}
                  end={`${today}T${closingTime}`}
                />
              </td>
            </tr>
          );
        })}
      </table>
    </div>
  );
}
