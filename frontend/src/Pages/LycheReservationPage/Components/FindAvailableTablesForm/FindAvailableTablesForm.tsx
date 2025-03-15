import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { KEY } from '~/i18n/constants';
import { ReservationOccation, type ReservationOccationValues } from '~/types/sultenTypes';
import styles from '../../LycheReservationPage.module.scss';
import { type FindTableData, findTableSchema } from './FindAvailableTablesSchema';

export function FindAvailableTablesForm({ onSubmit }: { onSubmit: (data: z.infer<typeof findTableSchema>) => void }) {
  const { t } = useTranslation();
  const form = useForm<FindTableData>({
    resolver: zodResolver(findTableSchema),
    defaultValues: {
      occasion: ReservationOccation.EAT,
      guest_count: 2,
      reservation_date: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
  });

  const occasionOptions: DropdownOption<ReservationOccationValues>[] = [
    { value: ReservationOccation.DRINK, label: t(KEY.sulten_occation_drinks) },
    { value: ReservationOccation.EAT, label: t(KEY.sulten_occation_eat) },
  ];

  const occupancyOptions: DropdownOption<number>[] = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' },
    { value: 7, label: '7' },
    { value: 8, label: '8' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.formContainer}>
        <div className={styles.formItem}>
          <FormField
            control={form.control}
            name="occasion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t(KEY.common_occasion)}</FormLabel>
                <FormControl>
                  <Dropdown options={occasionOptions} {...field} />
                </FormControl>
                <FormMessage />
                <p className={styles.helpText}>{`${t(KEY.sulten_reservation_form_occasion_help)}*`}</p>
              </FormItem>
            )}
          />
        </div>

        <div className={styles.formItem}>
          <FormField
            control={form.control}
            name="guest_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`${t(KEY.common_count)} ${t(KEY.common_guests)}*`}</FormLabel>
                <FormControl>
                  <Dropdown options={occupancyOptions} {...field} />
                </FormControl>
                <FormMessage />
                <p className={styles.helpText}>{t(KEY.sulten_reservation_form_more_than_8_help)}</p>
              </FormItem>
            )}
          />
        </div>

        <div className={styles.formItem}>
          <FormField
            control={form.control}
            name="reservation_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`${t(KEY.common_date)}*`}</FormLabel>
                <FormControl>
                  <DatePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" theme="green">
          {t(KEY.sulten_reservation_form_find_times)}
        </Button>
      </form>
    </Form>
  );
}
