import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Page } from '~/Components';
import { TimeDuration } from '~/Components';
import { Link } from '~/Components/Link/Link';
import { getOpenVenues } from '~/api';
import type { VenueDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import { ROUTES_SAMF_THREE } from '~/routes/samf-three';
import { ALL_DAYS, type Day } from '~/types';
import { getDayKey } from '~/utils';
import styles from './WeeklyOpeningPage.module.scss';

export function WeeklyOpeningPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_opening_hours));

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getOpenVenues,
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.name)),
  });

  function buildVenueTable(venues: VenueDto[], day: Day) {
    const dummy_date = '1970-01-01';
    return (
      <table className={styles.timeTable}>
        <tr>
          <th className={styles.tableHeader}>{t(getDayKey(day))}</th>
          <th className={styles.tableHeader}>{t(KEY.common_opening_hours)}</th>
        </tr>

        {venues.map((venue) => {
          const openingTime = venue[`opening_${day}` as keyof VenueDto] as string;
          const closingTime = venue[`closing_${day}` as keyof VenueDto] as string;
          return (
            <tr key={venue.name} className={styles.tableRow}>
              <td className={styles.tableData}>
                <Link target="samf3" url={`${ROUTES_SAMF_THREE.information.general}/${venue.name}`}>
                  <p className={styles.tableParagraph}>{venue.name}</p>
                </Link>
              </td>
              <td className={styles.tableData}>
                <TimeDuration
                  className={styles.tableTime}
                  start={`${dummy_date}T${openingTime}`}
                  end={`${dummy_date}T${closingTime}`}
                />
              </td>
            </tr>
          );
        })}
      </table>
    );
  }

  function buildAllDayTables(venues: VenueDto[]) {
    return ALL_DAYS.map((day) => buildVenueTable(venues, day));
  }

  return <Page loading={isLoading}>{buildAllDayTables(venues)}</Page>;
}
