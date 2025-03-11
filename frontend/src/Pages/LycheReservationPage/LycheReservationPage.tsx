import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { z } from 'zod';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { checkReservationAvailability } from '~/apis/sulten/sultenApis';
import type { AvailableTimes, ReservationCheckAvailabilityDto } from '~/apis/sulten/sultenDtos';
import { KV } from '~/constants';
import { TextItem } from '~/constants/TextItems';
import { useKeyValue, useTextItem, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ReservationFormLine } from './Components';
import {
  FindAvailableTablesForm,
  type findTableSchema,
} from './Components/FindAvailableTablesForm/FindAvailableTablesForm';
import styles from './LycheReservationPage.module.scss';

export function LycheReservationPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_reservation), t(KEY.common_sulten));
  const sultenMail = useKeyValue(KV.SULTEN_MAIL);
  const [reservation, setReservation] = useState<FormProps>();
  const [availableDate, setAvailableDate] = useState<boolean>(false);
  const [availableTimes, setAvailableTimes] = useState<AvailableTimes[]>([]);
  const [error, setError] = useState<string | null>(null);

  type FormProps = {
    occasion: string;
    guest_count: number;
    reservation_date: Date;
    start_time: string;
    name: string;
    phonenumber: string;
    email: string;
    additional_info: string;
    agree: boolean;
  };

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

  function checkAvailableDate(data: z.infer<typeof findTableSchema>) {
    // Format the date for the API (ISO string and extract just the date part)
    const formattedDate = data.reservation_date.toISOString().split('T')[0];

    // Prepare API payload
    const apiPayload: ReservationCheckAvailabilityDto = {
      reservation_date: formattedDate,
      guest_count: data.guest_count,
    };

    // Store form data for later use
    setReservation({
      ...reservation,
      occasion: data.occasion,
      guest_count: data.guest_count,
      reservation_date: data.reservation_date,
      start_time: '',
      name: '',
      phonenumber: '',
      email: '',
      additional_info: '',
      agree: false,
    });

    // Call the API
    checkAvailabilityMutation.mutate(apiPayload);
  }

  function submit(data: FormProps) {
    console.log({ ...reservation, ...data });
  }

  // Generate time options from available times returned by the API
  const hoursOptions: DropdownOption<string>[] = availableTimes
    .filter((timeSlot: AvailableTimes) => timeSlot) // Filter out any empty values
    .map((timeSlot: AvailableTimes) => ({
      value: timeSlot as unknown as string,
      label: timeSlot as unknown as string,
    }));

  const reserveStage = (
    <SamfForm
      validateOn="submit"
      className={styles.formContainer}
      onSubmit={submit}
      submitText={t(KEY.sulten_reservation_form_find_times)}
    >
      <div className={styles.reservation_info}>
        <p className={styles.text}>
          {t(KEY.common_date)} {reservation?.reservation_date?.toLocaleDateString()}
        </p>
        <p className={styles.text}>
          {t(KEY.common_guests)} {reservation?.guest_count}
        </p>
      </div>
      <ReservationFormLine label={`${t(KEY.common_time)}*`}>
        <SamfFormField<string, FormProps> type="options" options={hoursOptions} field="start_time" required={true} />
      </ReservationFormLine>
      <ReservationFormLine label={`${t(KEY.common_name)}*`}>
        <SamfFormField<string, FormProps> type="text" field="name" required={true} />
      </ReservationFormLine>
      <ReservationFormLine label={`${t(KEY.common_phonenumber)}*`}>
        <SamfFormField<string, FormProps> type="text" field="phonenumber" required={true} />
      </ReservationFormLine>
      <ReservationFormLine label={`${t(KEY.common_email)}*`} underline={true}>
        <SamfFormField<string, FormProps> type="email" field="email" required={true} />
      </ReservationFormLine>
      <ReservationFormLine label={t(KEY.common_message)}>
        <SamfFormField<string, FormProps> type="text" field="additional_info" required={false} />
      </ReservationFormLine>
      <div className={styles.check_box}>
        <SamfFormField<boolean, FormProps>
          type="checkbox"
          field="agree"
          label={`${useTextItem(TextItem.sulten_reservation_policy)}*`}
          required={true}
        />
      </div>
    </SamfForm>
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
          (availableDate ? reserveStage : <FindAvailableTablesForm onSubmit={checkAvailableDate} />)}
      </div>
    </SultenPage>
  );
}
