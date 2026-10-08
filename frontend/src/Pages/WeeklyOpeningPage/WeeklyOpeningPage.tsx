import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, Page, TimeDuration } from '~/Components';
import { getOpenVenues } from '~/api';
import type { VenueDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import { ROUTES_SAMF_THREE } from '~/routes/samf-three';
import { ALL_DAYS, type OpeningHourGroup } from '~/types';
import { getShortDayKey, getVenueOpeningHoursFromDTO } from '~/utils';
import styles from './WeeklyOpeningPage.module.scss';

export function WeeklyOpeningPage() {
  const { t } = useTranslation();
  const today = ALL_DAYS[(new Date().getDay() + 6) % 7];
  useTitle(t(KEY.common_opening_hours));

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getOpenVenues,
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.slug)),
  });

  function buildTimeDuration({ days, opening, closing }: OpeningHourGroup) {
    const dummyDate = '1970-01-01'; //Time duration component needs a date to work, but we only care about the time

    const firstDate = days[0];
    const lastDate = days[days.length - 1];

    return (
      <div className={styles.timeDuration}>
        <p className={days.includes(today) ? styles.today : styles.notToday}>
          {t(getShortDayKey(firstDate))}
          {days.length > 1 ? `-${t(getShortDayKey(lastDate))}` : ''}
        </p>
        <TimeDuration start={`${dummyDate}T${opening}`} end={`${dummyDate}T${closing}`} />
      </div>
    );
  }

  function buildVenueBlock(venue: VenueDto) {
    const openingHourGroups = getVenueOpeningHoursFromDTO(venue);
    return (
      <div key={venue.name} className={styles.venueBlock}>
        <Link target="samf3" url={`${ROUTES_SAMF_THREE.information.general}/${venue.slug}`}>
          <p className={styles.venueName}>{venue.name}</p>
        </Link>
        {openingHourGroups.map((group) => buildTimeDuration(group))}
      </div>
    );
  }

  return (
    <Page className={styles.page} loading={isLoading}>
      <div className={styles.venueBlockContainer}>{venues.map((venue) => buildVenueBlock(venue))}</div>
    </Page>
  );
}
