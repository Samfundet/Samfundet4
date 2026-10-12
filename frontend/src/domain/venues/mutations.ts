import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchVenue } from './api';
import { venueKeys } from './queryKeys';
import type { VenueOpeningHoursUpdate } from './types';

export function useUpdateVenueOpeningHours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: VenueOpeningHoursUpdate[]) => {
      const results = await Promise.allSettled(updates.map(({ slug, changes }) => patchVenue(slug, changes)));
      // allSettled resolves even when individual updates fail.
      const failedSlugs: string[] = [];

      for (const [index, result] of results.entries()) {
        if (result.status === 'rejected') {
          failedSlugs.push(updates[index].slug);
          console.error(`Error updating venue ${updates[index].slug}:`, result.reason);
        }
      }

      return { failedSlugs };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: venueKeys.all });
    },
  });
}
