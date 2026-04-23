import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from '../EventCreatorAdminPage.module.scss';
import type { FormType } from '../hooks/useEventCreatorForm';
import { EventTemplateSearch } from '../components/EventTemplateSearch';
import { EventCategoryValue } from '~/types';
import { useQuery } from '@tanstack/react-query';
import { getEvents } from '~/api';
import { mapEventToFormValues } from '../utils';
import { EventDto } from '~/dto';

type Props = {
  form: UseFormReturn<FormType>;
  defaultCategory: EventCategoryValue;
  defaultLocation: string;
  isEditMode: boolean;
};

export function TextStep({ form, defaultCategory, defaultLocation, isEditMode }: Props) {
  const { t } = useTranslation();
  const { data: events = [] } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    enabled: !isEditMode,
  })

  function handleSelectedEvent(selectedEvent: EventDto) {
      form.reset(
          mapEventToFormValues({
              event: selectedEvent,
              defaultCategory,
              defaultLocation,
              forTemplate: true,
          }),
      );
  }

  return (
    <>
      {!isEditMode && (
      <div className={styles.input_row}>
        <div className={styles.template_search_wrapper}>
          <label className={styles.form_label}>{t(KEY.event_create_from_existing_event)}</label>
          <EventTemplateSearch
            events={events}
            onSelectEvent={handleSelectedEvent}
          />
        </div>
      </div>
      )}
      <div className={styles.input_row}>
        <FormField
          key="title_nb"
          control={form.control}
          name="title_nb"
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>
                {t(KEY.common_title)} ({t(KEY.common_norwegian)})
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title_en"
          key={'title_en'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>
                {t(KEY.common_title)} ({t(KEY.common_english)})
              </FormLabel>
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
          name="description_short_nb"
          key={'description_short_nb'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>
                {t(KEY.common_short_description)} ({t(KEY.common_norwegian)})
              </FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description_short_en"
          key={'description_short_en'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>
                {t(KEY.common_short_description)} ({t(KEY.common_english)})
              </FormLabel>
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
          name="description_long_nb"
          key={'description_long_nb'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>
                {t(KEY.common_long_description)} ({t(KEY.common_norwegian)})
              </FormLabel>
              <FormControl>
                <Textarea className="textarea" {...field} rows={8} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description_long_en"
          key={'description_long_en'}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>
                {t(KEY.common_long_description)} ({t(KEY.common_english)})
              </FormLabel>
              <FormControl>
                <Textarea className="textarea" {...field} rows={8} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
