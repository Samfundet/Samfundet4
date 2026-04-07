import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Dropdown, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { KEY } from '~/i18n/constants';
import type { EventStatus } from '~/types';
import styles from '../EventCreatorAdminPage.module.scss';
import type { FormType } from '../hooks/useEventCreatorForm';

type Props = {
  form: UseFormReturn<FormType>;
  eventStatusOptions: DropdownOption<EventStatus>[];
};

export function SummaryStep({ form, eventStatusOptions }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.input_row}>
      <FormField
        control={form.control}
        name="visibility_from_dt"
        key="visibility_from_dt"
        render={({ field }) => (
          <FormItem className={styles.form_item}>
            <FormLabel>{t(KEY.saksdokumentpage_publication_date) ?? ''}</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="status"
        key="status"
        render={({ field }) => (
          <FormItem className={styles.form_item}>
            <FormLabel>{t(KEY.event_status)}</FormLabel>
            <FormControl>
              <Dropdown options={eventStatusOptions} nullOption={{ label: t(KEY.common_choose) }} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
