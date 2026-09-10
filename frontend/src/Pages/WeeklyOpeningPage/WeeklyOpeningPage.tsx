import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link, Page, TimeDuration } from '~/Components';
import { getOpenVenues } from '~/api';
import type { VenueDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import { ROUTES_SAMF_THREE } from '~/routes/samf-three';
import { ALL_DAYS, type Day } from '~/types';
import { getShortDayKey } from '~/utils';
import styles from './WeeklyOpeningPage.module.scss';

export function WeeklyOpeningPage() {
  const { t } = useTranslation();
  const today = ALL_DAYS[(new Date().getDay() + 6) % 7];
  useTitle(t(KEY.common_opening_hours));

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getOpenVenues,
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.name)),
  });

  const isNextDay = (dayA: Day, dayB: Day) => {
    return ALL_DAYS.indexOf(dayB) - ALL_DAYS.indexOf(dayA) === 1;
  };

  function sortDayArrays(days: Day[][]) {
    return days.sort((dayArrayA, dayArrayB) => {
      const firstDayA = dayArrayA[0];
      const firstDayB = dayArrayB[0];

      return ALL_DAYS.indexOf(firstDayA) - ALL_DAYS.indexOf(firstDayB);
    });
  }

  function buildTimeDuration(venue: VenueDto, dayPeriod: Day[]) {
    const dummyDate = '1970-01-01'; //Time duration component needs a date to work, but we only care about the time

    const firstDay = dayPeriod[0];

    const openingTime = venue[`opening_${firstDay}` as keyof VenueDto] as string;
    const closingTime = venue[`closing_${firstDay}` as keyof VenueDto] as string;

    return (
      <div className={styles.timeDuration}>
        <p className={dayPeriod.includes(today) ? styles.today : styles.notToday}>
          {t(getShortDayKey(firstDay))}
          {dayPeriod.length > 1 ? `-${t(getShortDayKey(dayPeriod[dayPeriod.length - 1]))}` : ''}
        </p>
        <TimeDuration
          className={dayPeriod.includes(today) ? styles.today : styles.notToday}
          start={`${dummyDate}T${openingTime}`}
          end={`${dummyDate}T${closingTime}`}
        />
      </div>
    );
  }

  function buildGroupedTimePeriods(venue: VenueDto) {
    const seenPeriods = new Map<string, Day[]>();
    const NonContinuousPeriods = new Array<Day[]>();
    for (const day of ALL_DAYS) {
      const openingTime = venue[`opening_${day}` as keyof VenueDto] as string;
      const closingTime = venue[`closing_${day}` as keyof VenueDto] as string;
      const period = `${openingTime}-${closingTime}`;

      const ContinuousPeriod = seenPeriods.get(period);
      if (ContinuousPeriod) {
        if (isNextDay(ContinuousPeriod[ContinuousPeriod.length - 1], day)) {
          ContinuousPeriod.push(day);
        } else {
          NonContinuousPeriods.push([day]);
        }
      } else {
        seenPeriods.set(period, [day]);
      }
    }

    return (
      <>
        {sortDayArrays([...NonContinuousPeriods, ...seenPeriods.values()]).map((dayPeriod) => (
          <div key={dayPeriod.join(',')}>{buildTimeDuration(venue, dayPeriod)}</div>
        ))}
      </>
    );
  }

  function buildVenueBlock(venue: VenueDto) {
    return (
      <div key={venue.name} className={styles.venueBlock}>
        <Link target="samf3" url={`${ROUTES_SAMF_THREE.information.general}/${venue.name}`}>
          <p className={styles.venueName}>{venue.name}</p>
        </Link>
        {buildGroupedTimePeriods(venue)}
      </div>
    );
  }

  return (
    <Page className={styles.page} loading={isLoading}>
      <div className={styles.venueBlockContainer}>{venues.map((venue) => buildVenueBlock(venue))}</div>
    </Page>
  );
}
