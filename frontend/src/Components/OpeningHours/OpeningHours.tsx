import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TimeDuration } from '~/Components';
import { Link } from '~/Components/Link/Link';
import { Text } from '~/Components/Text/Text';
import { getClosedPeriods } from '~/api';
import { useGlobalContext } from '~/context/GlobalContextProvider';
import type { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import styles from './OpeningHours.module.scss';

type OpeningHoursProps = {
  venues: VenueDto[] | undefined;
  isLoading: boolean;
  isError: boolean;
};

export function OpeningHours({ venues, isLoading, isError }: OpeningHoursProps) {
  const { t } = useTranslation();
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [closedText, setClosedText] = useState<string | undefined>('Samf is closed');
  const globalContext = useGlobalContext();

  useEffect(() => {
    if (globalContext.isClosed !== 'default') {
      if (globalContext.isClosed === 'closed') {
        setIsClosed(true);
        setClosedText('Samfundet is closed');
      }
      return;
    }
    getClosedPeriods().then((periods) => {
      const now = new Date();
      for (const period of periods) {
        if (new Date(period.start_dt) < now && now < new Date(period.end_dt)) {
          setIsClosed(true);
          console.log(period);
          setClosedText(dbT(period, 'message'));
          break;
        }
      }
    });
  });

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
      {isClosed ? (
        <div className={styles.closedBox}>{closedText}</div>
      ) : (
        <table className={styles.timeTable}>
          {venues.map((venue) => {
            const openingTime = venue[`opening_${day}` as keyof VenueDto] as string;
            const closingTime = venue[`closing_${day}` as keyof VenueDto] as string;
            return (
              <tr key={venue.name} className={styles.openingRow}>
                <td className={styles.tableCell}>
                  <Link url={`information/${venue.name}`}>
                    <p className={styles.openingHoursText}>{venue.name}</p>
                  </Link>
                </td>
                <td className={styles.tableCell}>
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
      )}
    </div>
  );
}
