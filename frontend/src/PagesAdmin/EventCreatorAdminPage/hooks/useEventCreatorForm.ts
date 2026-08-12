import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import type { EventDto, EventWriteDto } from '~/dto';
import type { EventCategoryValue } from '~/types';
import { utcTimestampToLocal } from '~/utils';
import { eventSchema } from '../EventCreatorSchema';

export type FormType = z.infer<typeof eventSchema>;

function computeDurationMinutes(startIso?: string, endIso?: string) {
  if (!startIso || !endIso) return 0;
  return Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
}

export function useEventCreatorForm(params: {
  event?: Partial<EventDto>;
  defaultCategory: EventCategoryValue;
  defaultLocation: string;
}) {
  // TODO: remove defaults since we set them to undefined now
  const { event, defaultCategory, defaultLocation } = params;

  // Setup React Hook Form
  const form = useForm<FormType>({
    resolver: zodResolver(eventSchema),
    mode: 'onChange',
    defaultValues: {
      title_nb: '',
      title_en: '',
      description_long_nb: '',
      description_long_en: '',
      description_short_nb: '',
      description_short_en: '',
      start_dt: '',
      duration: undefined,
      end_dt: '',
      category: undefined,
      host: '',
      location: undefined,
      capacity: undefined,
      age_restriction: 'none',
      ticket_type: 'free',
      custom_tickets: [],
      billig_id: undefined,
      spotify_uri: '',
      youtube_link: '',
      youtube_embed: '',
      soundcloud_link: '',
      instagram_link: '',
      facebook_link: '',
      x_link: '',
      lastfm_link: '',
      vimeo_link: '',
      general_link: '',
      image: undefined,
      visibility_from_dt: '',
      visibility_to_dt: '',
    },
  });

  const resetValues = useMemo<FormType | undefined>(() => {
    if (!event?.id) return undefined;

    const duration = computeDurationMinutes(event.start_dt, event.end_dt);

    return {
      title_nb: event.title_nb || '',
      title_en: event.title_en || '',
      description_long_nb: event.description_long_nb || '',
      description_long_en: event.description_long_en || '',
      description_short_nb: event.description_short_nb || '',
      description_short_en: event.description_short_en || '',
      start_dt: event.start_dt ? utcTimestampToLocal(event.start_dt, false) : '',
      duration: duration || undefined,
      end_dt: event.end_dt ? utcTimestampToLocal(event.end_dt, false) : '',
      category: event.category || defaultCategory,
      host: event.host || '',
      location: event.location || defaultLocation,
      capacity: event.capacity || undefined,
      age_restriction: event.age_restriction || 'none',
      ticket_type: event.ticket_type || 'free',
      custom_tickets: event.custom_tickets || [],
      billig_id: event.billig?.id,
      spotify_uri: event.spotify_uri || '',
      youtube_link: event.youtube_link || '',
      youtube_embed: event.youtube_embed || '',
      facebook_link: event.facebook_link || '',
      soundcloud_link: event.soundcloud_link || '',
      instagram_link: event.instagram_link || '',
      x_link: event.x_link || '',
      lastfm_link: event.lastfm_link || '',
      vimeo_link: event.vimeo_link || '',
      general_link: event.general_link || '',
      image: event.image ?? undefined,
      visibility_from_dt: event.visibility_from_dt ? utcTimestampToLocal(event.visibility_from_dt, false) : '',
      visibility_to_dt: event.visibility_to_dt ? utcTimestampToLocal(event.visibility_to_dt, false) : '',
    };
  }, [event, defaultCategory, defaultLocation]);

  useEffect(() => {
    if (!resetValues) return;
    form.reset(resetValues);
  }, [form, resetValues]);

  const watchedValues = form.watch();

  function buildPayload(values: FormType): EventWriteDto {
    const start = values.start_dt ? new Date(values.start_dt) : null;
    const computedEndDt = start ? new Date(start?.getTime() + (values.duration ?? 0) * 60_000) : null;

    return {
      ...values,
      visibility_to_dt: computedEndDt ? computedEndDt.toISOString() : '',
      end_dt: computedEndDt ? computedEndDt.toISOString() : '',
      image_id: values.image?.id,
    };
  }

  return { form, watchedValues, buildPayload };
}
