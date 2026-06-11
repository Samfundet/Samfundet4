import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Page, TimeDuration } from '~/Components';
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
  const today: Day = ALL_DAYS[new Date().getDay() - 1];
  const [selectedDay, setSelectedDay] = useState<Day>(today);
  useTitle(t(KEY.common_opening_hours));

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getOpenVenues,
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.name)),
  });

  function buildDayCard(day: Day) {
    return (
      <button
        type="button"
        onClick={() => {
          setSelectedDay(day);
        }}
        className={selectedDay === day ? styles.selectedDayCard : styles.dayCard}
      >
        {t(getDayKey(day))}
      </button>
    );
  }

  function buildVenueCard(venue: VenueDto) {
    const dummy_date = '1970-01-01';
    const openingTime = venue[`opening_${selectedDay}` as keyof VenueDto] as string;
    const closingTime = venue[`closing_${selectedDay}` as keyof VenueDto] as string;
    return (
      <div className={styles.venueCard}>
        <Link target="samf3" url={`${ROUTES_SAMF_THREE.information.general}/${venue.name}`}>
          <p className={styles.tableParagraph}>{venue.name}</p>
        </Link>
        <TimeDuration
          className={styles.tableTime}
          start={`${dummy_date}T${openingTime}`}
          end={`${dummy_date}T${closingTime}`}
        />
      </div>
    );
  }

  return (
    <Page className={styles.page} loading={isLoading}>
      <div className={styles.dayCardContainer}>{ALL_DAYS.map((day) => buildDayCard(day))}</div>
      <div className={styles.venueCardContainer}>{venues.map((venue) => buildVenueCard(venue))}</div>
    </Page>
  );
}
