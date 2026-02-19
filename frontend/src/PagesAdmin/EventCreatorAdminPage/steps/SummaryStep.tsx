import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { KEY } from '~/i18n/constants';
import styles from '../EventCreatorAdminPage.module.scss';
import type { FormType } from '../hooks/useEventCreatorForm';

export function SummaryStep({ form }: { form: UseFormReturn<FormType> }) {
  const { t } = useTranslation();

  return (
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
  );
}
