import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import type { VenueDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import type { Day } from '~/types';
import { patchVenueDaySchedule } from '../api';
import type { VenueDaySchedule } from '../types';
import { getVenueDaySchedule, normalizeVenueDaySchedule, updateVenueDaySchedule } from '../utils';

type SaveVenueDayVariables = {
  slug: string;
  weekday: Day;
  schedule: VenueDaySchedule;
};

const mutationKey = ['venue-opening-hours'];
const pendingFilter = { mutationKey, status: 'pending' as const };

export function useVenueOpeningHoursMutations(venues: VenueDto[]) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const pendingChanges = useMutationState({
    filters: pendingFilter,
    select: (mutation) => mutation.state.variables as SaveVenueDayVariables,
  });

  const updateVenueDayMutation = useMutation({
    mutationKey,
    scope: { id: 'venue-opening-hours' },
    mutationFn: ({ slug, weekday, schedule }: SaveVenueDayVariables) => patchVenueDaySchedule(slug, weekday, schedule),
    onMutate: () => queryClient.cancelQueries({ queryKey: venueKeys.all }),
    onSuccess: (schedule, { slug, weekday }) => {
      queryClient.setQueryData<VenueDto[]>(venueKeys.all, (oldVenues) =>
        oldVenues?.map((venue) => (venue.slug === slug ? updateVenueDaySchedule(venue, weekday, schedule) : venue)),
      );
      toast.success(t(KEY.common_save_successful));
    },
    onError: (error) => {
      toast.error(t(KEY.common_something_went_wrong));
      console.error('Error updating venue opening hours:', error);
    },
    onSettled: () => {
      // The settling mutation is still pending here; reconcile only when it is the last one.
      if (queryClient.isMutating({ mutationKey }) === 1) {
        return queryClient.invalidateQueries({ queryKey: venueKeys.all });
      }
    },
  });

  function getLatestPendingSchedule(slug: string, weekday: Day) {
    // Read pending mutations directly so blur followed by a checkbox click uses the latest edit.
    const pendingMutations = queryClient.getMutationCache().findAll(pendingFilter);
    let latestSchedule: VenueDaySchedule | undefined;
    for (const mutation of pendingMutations) {
      const change = mutation.state.variables as SaveVenueDayVariables;
      if (change.slug === slug && change.weekday === weekday) {
        latestSchedule = change.schedule;
      }
    }
    return latestSchedule;
  }

  function saveDaySchedule(venue: VenueDto, weekday: Day, changes: Partial<VenueDaySchedule>) {
    const pendingSchedule = getLatestPendingSchedule(venue.slug, weekday);
    const savedVenue = queryClient.getQueryData<VenueDto[]>(venueKeys.all)?.find((item) => item.slug === venue.slug);
    const savedSchedule = getVenueDaySchedule(savedVenue ?? venue, weekday);
    const previousSchedule = normalizeVenueDaySchedule(pendingSchedule ?? savedSchedule);
    const schedule = normalizeVenueDaySchedule({ ...previousSchedule, ...changes });
    if (
      previousSchedule.is_open === schedule.is_open &&
      previousSchedule.opening === schedule.opening &&
      previousSchedule.closing === schedule.closing
    ) {
      return;
    }
    updateVenueDayMutation.mutate({ slug: venue.slug, weekday, schedule });
  }

  // Overlay queued schedules in order, keeping only confirmed data in the query cache.
  let displayedVenues = venues;
  for (const { slug, weekday, schedule } of pendingChanges) {
    displayedVenues = displayedVenues.map((venue) =>
      venue.slug === slug ? updateVenueDaySchedule(venue, weekday, schedule) : venue,
    );
  }

  return { displayedVenues, saveDaySchedule };
}
