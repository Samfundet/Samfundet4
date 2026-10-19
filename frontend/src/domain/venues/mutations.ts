import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateVenueOpeningHours } from './api';
import { venueKeys } from './queryKeys';

export function useUpdateVenueOpeningHours() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVenueOpeningHours,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: venueKeys.all });
    },
  });
}
