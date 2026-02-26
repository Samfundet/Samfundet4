import type { UseFormReturn } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Dropdown, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/Components';

import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { KEY } from '~/i18n/constants';
import type { EventAgeRestrictionValue } from '~/types';
import styles from '../EventCreatorAdminPage.module.scss';
import type { FormType } from '../hooks/useEventCreatorForm';

import { PaymentForm } from '../components/PaymentForm';

type Props = {
  form: UseFormReturn<FormType>;
  ageLimitOptions: DropdownOption<EventAgeRestrictionValue>[];
};

export function PaymentStep({ form, ageLimitOptions }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <FormField
        control={form.control}
        name="age_restriction"
        key={'age_restriction'}
        render={({ field }) => (
          <FormItem className={styles.form_item}>
            <FormLabel>{t(KEY.common_age_limit)}</FormLabel>
            <FormControl>
              <Dropdown options={ageLimitOptions} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <PaymentForm
        event={form.getValues()}
        onChange={(partial) => {
          // Update form values with payment data
          const updatedValues = { ...form.getValues(), ...partial };
          form.reset(updatedValues);
        }}
      />
    </>
  );
}
