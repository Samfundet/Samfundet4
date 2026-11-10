import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ImageDto, getImage } from '../images';
import { deleteInfobox, getInfobox, getInfoboxes, postInfobox, putInfobox } from './api';
import { infoboxKeys } from './queryKeys';
import type { InfoboxDto, InfoboxId } from './types';

export function useGetInfoboxes() {
  return useQuery({
    queryKey: infoboxKeys.all,
    queryFn: getInfoboxes,
  });
}

export function useGetInfobox(id: InfoboxId) {
  return useQuery({
    queryKey: infoboxKeys.detail(id),
    queryFn: () => getInfobox(id),
  });
}

export type InfoboxFormQueryData = {
  infobox: InfoboxDto;
  image?: ImageDto;
};

export function useGetInfoboxForm(id: InfoboxId | undefined) {
  return useQuery({
    queryKey: infoboxKeys.form(id),
    queryFn: async (): Promise<InfoboxFormQueryData> => {
      if (id === undefined) {
        throw new Error('An infobox ID is required to fetch edit data');
      }

      const infobox = await getInfobox(id);
      const image = infobox.image ? await getImage(infobox.image.id).catch(() => undefined) : undefined;
      return { infobox, image };
    },
    enabled: id !== undefined,
  });
}

export function useDeleteInfobox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInfobox,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: infoboxKeys.all }),
  });
}

export function useCreateInfobox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postInfobox,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: infoboxKeys.all }),
  });
}

export function useUpdateInfobox() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: InfoboxId; payload: Partial<InfoboxDto> }) => putInfobox(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: infoboxKeys.all }),
  });
}
