import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Button,
  Checkbox,
  Dropdown,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import type { AvailableTimes } from '~/apis/sulten/sultenDtos';
import { TextItem } from '~/constants/TextItems';
import { useTextItem } from '~/hooks';
import { KEY } from '~/i18n/constants';
import type { FindTableData } from '../FindAvailableTablesForm/FindAvailableTablesForm';
import styles from '../../LycheReservationPage.module.scss';

// Combined schema for all form data
const reservationSchema = z.object({
  occasion: z.string().min(1, 'Required'),
  guest_count: z.number().min(1).max(8),
  reservation_date: z.date(),
  start_time: z.string().min(1, 'Required'),
  name: z.string().min(1, 'Required'),
  phonenumber: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email address'),
  additional_info: z.string().optional(),
  agree: z.boolean().refine((val) => val === true, 'You must agree to the terms'),
});

export type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationDetailsFormProps {
  findTableData: FindTableData;
  availableTimes: AvailableTimes[];
  onSubmit: (data: ReservationFormData) => void;
}

export function ReservationDetailsForm({ findTableData, availableTimes, onSubmit }: ReservationDetailsFormProps) {
  const { t } = useTranslation();
  const termsText = useTextItem(TextItem.sulten_reservation_policy);

  // Form for reservation details
  const reservationForm = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      start_time: '',
      name: '',
      phonenumber: '',
      email: '',
      additional_info: '',
      agree: false,
    },
  });

  // Update default values of form when findTableData changes with useEffect
  useEffect(() => {
    if (findTableData) {
      reservationForm.reset({
        ...findTableData,
      });
    }
  }, [findTableData, reservationForm]);

  // Generate time options from available times returned by the API
  const timeOptions: DropdownOption<string>[] = availableTimes
    .filter((timeSlot: AvailableTimes) => timeSlot) // Filter out any empty values
    .map((timeSlot: AvailableTimes) => ({
      value: timeSlot as unknown as string,
      label: timeSlot as unknown as string,
    }));

  return (
    <Form {...reservationForm}>
      <form onSubmit={reservationForm.handleSubmit(onSubmit)} className={styles.formContainer}>
        <div className={styles.reservation_info}>
          <p className={styles.text}>
            {t(KEY.common_date)} {findTableData?.reservation_date?.toLocaleDateString()}
          </p>
          <p className={styles.text}>
            {t(KEY.common_guests)} {findTableData?.guest_count}
          </p>
        </div>

        <FormField
          control={reservationForm.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`${t(KEY.common_time)}*`}</FormLabel>
              <FormControl>
                <Dropdown options={timeOptions} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={reservationForm.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`${t(KEY.common_name)}*`}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={reservationForm.control}
          name="phonenumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`${t(KEY.common_phonenumber)}*`}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={reservationForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{`${t(KEY.common_email)}*`}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={reservationForm.control}
          name="additional_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(KEY.common_message)}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={reservationForm.control}
          name="agree"
          render={({ field }) => (
            <FormItem>
              <div className={styles.check_box}>
                <FormControl>
                  <Checkbox checked={field.value} onChange={field.onChange} />
                </FormControl>
                <FormLabel>{termsText}*</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" theme="green">
          {t(KEY.sulten_reservation_form_find_times)}
        </Button>
      </form>
    </Form>
  );
}
