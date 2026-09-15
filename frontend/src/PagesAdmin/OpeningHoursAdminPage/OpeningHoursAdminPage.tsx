import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getVenues } from '~/api';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import { lowerCapitalize } from '~/utils';
import { AdminPage } from '../AdminPageLayout';
import styles from './OpeningHoursAdminPage.module.scss';
import { VenueOpeningHoursBox } from './VenueOpeningHoursBox';
import { useVenueOpeningHoursMutations } from './hooks/useVenueOpeningHoursMutations';

export function OpeningHoursAdminPage() {
  const { t } = useTranslation();
  useTitle(lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_opening_hours)}`));

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
    select: (data) => [...data].sort((venueA, venueB) => venueA.name.localeCompare(venueB.name)),
  });

  const { displayedVenues, saveDaySchedule } = useVenueOpeningHoursMutations(venues);

  return (
    <AdminPage
      title={t(KEY.common_opening_hours)}
      header={<div className={styles.subtitle}>{t(KEY.admin_opening_hours_hint)}</div>}
      loading={isLoading}
    >
      <div className={styles.venue_container}>
        {displayedVenues.map((venue) => (
          <VenueOpeningHoursBox key={venue.slug} venue={venue} onSaveDay={saveDaySchedule} />
        ))}
      </div>
    </AdminPage>
  );
}
