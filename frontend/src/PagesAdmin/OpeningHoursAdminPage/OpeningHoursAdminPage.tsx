import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { OpeningHours } from '~/Components/OpeningHours';
import { getVenues, patchVenue } from '~/api';
import type { VenueDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import { getVenueDay, getVenueDaySchedule, lowerCapitalize } from '~/utils';
import { AdminPage } from '../AdminPageLayout';
import styles from './OpeningHoursAdminPage.module.scss';
import { VenueOpeningHoursBox } from './VenueOpeningHoursBox';

export function OpeningHoursAdminPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  useTitle(lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.common_opening_hours)}`));

  const { data: venues = [], isLoading } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
    select: (data) => [...data].sort((a, b) => a.name.localeCompare(b.name)),
  });

  const updateVenueMutation = useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<VenueDto> }) => patchVenue(slug, data),
    onMutate: async ({ slug, data }) => {
      await queryClient.cancelQueries({ queryKey: venueKeys.all });
      const previousVenues = queryClient.getQueryData<VenueDto[]>(venueKeys.all);
      queryClient.setQueryData<VenueDto[]>(venueKeys.all, (oldVenues = []) =>
        oldVenues.map((venue) => (venue.slug === slug ? { ...venue, ...data } : venue)),
      );
      return { previousVenues };
    },
    onSuccess: () => {
      toast.success(t(KEY.common_save_successful));
    },
    onError: (error, _vars, context) => {
      if (context?.previousVenues) {
        queryClient.setQueryData<VenueDto[]>(venueKeys.all, context.previousVenues);
      }
      toast.error(t(KEY.common_something_went_wrong));
      console.error('Error updating venue:', error);
    },
  });

  function handleSave(venue: VenueDto, field: keyof VenueDto, value: string | boolean) {
    updateVenueMutation.mutate({ slug: venue.slug, data: { [field]: value } });
  }

  const header = (
    <div>
      <div className={styles.subtitle}>{t(KEY.admin_opening_hours_hint)}</div>
    </div>
  );

  const today = getVenueDay();
  const venuesOpenToday = venues.filter((v) => getVenueDaySchedule(v, today).isOpen);

  return (
    <AdminPage title={t(KEY.common_opening_hours)} header={header} loading={isLoading}>
      <OpeningHours venues={venuesOpenToday} isLoading={isLoading} isError={false} />
      <div className={styles.venue_container}>
        {venues.map((venue) => (
          <VenueOpeningHoursBox key={venue.slug} venue={venue} onSave={handleSave} />
        ))}
      </div>
    </AdminPage>
  );
}
