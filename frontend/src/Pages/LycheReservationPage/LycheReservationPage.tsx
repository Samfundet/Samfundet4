import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { checkReservationAvailability } from '~/apis/sulten/sultenApis';
import type { AvailableTimes, ReservationCheckAvailabilityDto } from '~/apis/sulten/sultenDtos';
import { KV } from '~/constants';
import { TextItem } from '~/constants/TextItems';
import { useKeyValue, useTextItem, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import {
  FindAvailableTablesForm,
  type FindTableData,
} from './Components/FindAvailableTablesForm/FindAvailableTablesForm';
import styles from './LycheReservationPage.module.scss';

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

type ReservationFormData = z.infer<typeof reservationSchema>;

export function LycheReservationPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_reservation), t(KEY.common_sulten));
  const sultenMail = useKeyValue(KV.SULTEN_MAIL);
  const [availableDate, setAvailableDate] = useState<boolean>(false);
  const [availableTimes, setAvailableTimes] = useState<AvailableTimes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [findTableData, setFindTableData] = useState<FindTableData | null>(null);
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

  // Use TanStack Query mutation for API call
  const checkAvailabilityMutation = useMutation({
    mutationFn: (data: ReservationCheckAvailabilityDto) => checkReservationAvailability(data),
    onSuccess: (data) => {
      // Handle the successful response
      setAvailableTimes(data);
      setError(null);
      if (data.length > 0) {
        setAvailableDate(true);
      } else {
        setError(t('No available times for the selected date'));
      }
    },
    onError: (error: unknown) => {
      // Handle error cases
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t('An error occurred while checking availability'));
      }
      setAvailableDate(false);
    },
  });

  function onFindTableSubmit(data: FindTableData) {
    // Format the date for the API (ISO string and extract just the date part)
    const formattedDate = data.reservation_date.toISOString().split('T')[0];

    // Prepare API payload
    const apiPayload: ReservationCheckAvailabilityDto = {
      reservation_date: formattedDate,
      guest_count: data.guest_count,
    };

    // Store find table form data
    setFindTableData(data);

    // Call the API
    checkAvailabilityMutation.mutate(apiPayload);
  }

  function onReservationSubmit(data: ReservationFormData) {
    // Combine data from both forms
    const completeData: ReservationFormData = {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      ...findTableData!,
      ...data,
    };

    console.log(completeData);
    // Here you would submit the data to your backend
  }

  // Generate time options from available times returned by the API
  const timeOptions: DropdownOption<string>[] = availableTimes
    .filter((timeSlot: AvailableTimes) => timeSlot) // Filter out any empty values
    .map((timeSlot: AvailableTimes) => ({
      value: timeSlot as unknown as string,
      label: timeSlot as unknown as string,
    }));

  // Reservation details form
  const reservationDetailsForm = (
    <Form {...reservationForm}>
      <form onSubmit={reservationForm.handleSubmit(onReservationSubmit)} className={styles.formContainer}>
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

  return (
    <SultenPage>
      <div className={styles.container}>
        <div className={styles.partContainer}>
          <h1 className={styles.header}>{t(KEY.common_reservation)}</h1>
          <p className={styles.text}>{useTextItem(TextItem.sulten_reservation_help)}</p>
          <p className={styles.text}>
            {useTextItem(TextItem.sulten_reservation_contact)}
            <Link target="email" className={styles.email} url={`mailto:${sultenMail}`}>
              {sultenMail}
            </Link>
          </p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        {checkAvailabilityMutation.isPending && <div className={styles.loading}>{t('Checking availability...')}</div>}

        {!checkAvailabilityMutation.isPending &&
          (availableDate ? reservationDetailsForm : <FindAvailableTablesForm onSubmit={onFindTableSubmit} />)}
      </div>
    </SultenPage>
  );
}
