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
import styles from '../EventCreatorAdminPage.module.scss';
import type { FormType } from '../hooks/useEventCreatorForm';

type Props = {
  form: UseFormReturn<FormType>;
  eventCategoryOptions: DropdownOption<EventCategoryValue>[];
  locationOptions: DropdownOption<string>[];
};

export function InfoStep({ form, eventCategoryOptions, locationOptions }: Props) {
  const { t } = useTranslation();

  const venueOptions = useMemo(() => locationOptions, [locationOptions]);
  const { data: venues = [] } = useQuery({
    queryKey: venueKeys.all,
    queryFn: getVenues,
  });

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
                <Input type="datetime-local" {...field} />
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
                    field.onChange(v === '' ? '' : Number.parseInt(v));
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
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const v = e.target.value;
                    field.onChange(v === '' ? '' : Number.parseInt(v));
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
