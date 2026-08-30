import { useMemo } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Dropdown, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';

import { useQuery } from '@tanstack/react-query';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { getVenues } from '~/api';
import { KEY } from '~/i18n/constants';
import { venueKeys } from '~/queryKeys';
import type { EventCategoryValue } from '~/types';
import { utcTimestampToLocal } from '~/utils';
import styles from '../EventCreatorAdminPage.module.scss';
import type { FormType } from '../hooks/useEventCreatorForm';

type Props = {
  form: UseFormReturn<FormType>;
  eventCategoryOptions: DropdownOption<EventCategoryValue>[];
  locationOptions: DropdownOption<string>[];
};

// Adds `minutes` to a datetime-local value (e.g. '2025-02-20T18:00') and returns a new
// datetime-local value. Returns '' if `dtLocal` isn't a parseable date.
function addMinutesToLocalDt(dtLocal: string, minutes: number): string {
  const start = new Date(dtLocal);
  if (Number.isNaN(start.getTime())) return '';
  return utcTimestampToLocal(new Date(start.getTime() + minutes * 60_000).toISOString(), false);
}

// Returns the whole-minute difference between two datetime-local values, clamped to >= 0.
// Returns undefined if either value isn't a parseable date.
function diffMinutes(startLocal: string, endLocal: string): number | undefined {
  const start = new Date(startLocal);
  const end = new Date(endLocal);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return undefined;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 60_000));
}

export function InfoStep({ form, eventCategoryOptions, locationOptions }: Props) {
  const { t } = useTranslation();

  const venueOptions = useMemo(() => locationOptions, [locationOptions]);
  const { data: venues = [] } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
  });

  // start_dt, end_dt and duration are all shown at once, so editing any one of them needs to
  // keep the other two consistent.

  function handleStartDtChange(value: string) {
    form.setValue('start_dt', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    const { duration, end_dt } = form.getValues();
    if (value && duration) {
      form.setValue('end_dt', addMinutesToLocalDt(value, duration), { shouldValidate: true, shouldDirty: true });
    } else if (value && end_dt) {
      form.setValue('duration', diffMinutes(value, end_dt), { shouldValidate: true, shouldDirty: true });
    }
  }

  function handleEndDtChange(value: string) {
    form.setValue('end_dt', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    const startDt = form.getValues('start_dt');
    if (startDt && value) {
      form.setValue('duration', diffMinutes(startDt, value), { shouldValidate: true, shouldDirty: true });
    }
  }

  function handleDurationChange(minutes: number | undefined) {
    form.setValue('duration', minutes, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    const startDt = form.getValues('start_dt');
    if (startDt && minutes !== undefined) {
      form.setValue('end_dt', addMinutesToLocalDt(startDt, minutes), { shouldValidate: true, shouldDirty: true });
    }
  }

  return (
    <>
      <div className={styles.input_row}>
        <FormField
          control={form.control}
          name="start_dt"
          key={'start_dt'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>
                {t(KEY.common_date)} & {t(KEY.common_time)}
              </FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} onChange={(e) => handleStartDtChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="end_dt"
          key={'end_dt'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.end_time)}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} onChange={(e) => handleEndDtChange(e.target.value)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          key={'duration'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>
                {t(KEY.recruitment_duration)} ({t(KEY.common_minutes)})
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const v = e.target.value;
                    handleDurationChange(v === '' ? undefined : Number.parseInt(v));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={styles.input_row}>
        <FormField
          control={form.control}
          name="category"
          key={'category'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.category)}</FormLabel>
              <FormControl>
                <Dropdown
                  options={eventCategoryOptions}
                  sortAlphabetic={true}
                  nullOption={{ label: t(KEY.common_choose) }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="host"
          key={'host'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.admin_organizer)}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className={styles.input_row}>
        <FormField
          control={form.control}
          name="location"
          key={'location'}
          render={({ field }) => {
            const selected = locationOptions.find((o) => o.value === field.value) ?? null;
            return (
              <FormItem className={styles.form_item}>
                <FormLabel>{t(KEY.common_venue)}</FormLabel>
                <FormControl>
                  <Dropdown
                    sortAlphabetic={true}
                    options={venues.map((venue) => ({ value: venue.name, label: venue.name }))}
                    nullOption={{ label: t(KEY.common_choose) }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="capacity"
          key={'capacity'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.common_capacity)}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '');
                    field.onChange(v);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
