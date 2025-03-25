import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
import styles from '../../LycheReservationPage.module.scss';
import type { FindTableData } from '../FindAvailableTablesForm/FindAvailableTablesSchema';
import { type ReservationFormData, reservationSchema } from './ReserveTableSchema';
import { VENUE } from '~/constants/constants';

interface ReservationDetailsFormProps {
  findTableData: FindTableData;
  availableTimes: AvailableTimes[];
  onSubmit: (data: ReservationFormData) => void;
}

export function ReservationDetailsForm({ findTableData, availableTimes, onSubmit }: ReservationDetailsFormProps) {
  const { t } = useTranslation();
  const termsText = useTextItem(TextItem.sulten_reservation_policy);

  // Generate time options from available times returned by the API
  const timeOptions: DropdownOption<string>[] = availableTimes
    .filter((timeSlot: AvailableTimes) => timeSlot) // Filter out any empty values
    .map((timeSlot: AvailableTimes) => ({
      value: timeSlot as unknown as string,
      label: timeSlot as unknown as string,
    }));

  // Form for reservation details
  const reservationForm = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      start_time: timeOptions[0]?.value,
      name: '',
      phonenumber: '',
      email: '',
      additional_info: '',
      agree: false,
      venue: VENUE.LYCHE,
      ...findTableData,
    },
  });

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
              <FormLabel>{t(KEY.common_time)}</FormLabel>
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
              <FormLabel>{t(KEY.common_name)}</FormLabel>
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
              <FormLabel>{t(KEY.common_phonenumber)}</FormLabel>
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
              <FormLabel>{t(KEY.common_email)}</FormLabel>
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
