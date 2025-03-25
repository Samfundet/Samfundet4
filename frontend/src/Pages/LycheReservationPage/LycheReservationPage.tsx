import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SamfundetLogoSpinner } from '~/Components';
import { Link } from '~/Components/Link/Link';
import { SultenPage } from '~/Components/SultenPage';
import { type ReservationPostData, checkReservationAvailability, reserveTable } from '~/apis/sulten/sultenApis';
import type { AvailableTimes, ReservationCheckAvailabilityDto } from '~/apis/sulten/sultenDtos';
import { KV } from '~/constants';
import { TextItem } from '~/constants/TextItems';
import { useKeyValue, useTextItem, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { FindAvailableTablesForm } from './Components/FindAvailableTablesForm/FindAvailableTablesForm';
import type { FindTableData } from './Components/FindAvailableTablesForm/FindAvailableTablesSchema';
import { ReservationDetailsForm } from './Components/ReserveTableForm/ReserveTableForm';
import type { ReservationFormData } from './Components/ReserveTableForm/ReserveTableSchema';
import styles from './LycheReservationPage.module.scss';

export function LycheReservationPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_reservation), t(KEY.common_sulten));
  const sultenMail = useKeyValue(KV.SULTEN_MAIL);
  const [availableDate, setAvailableDate] = useState<boolean>(false);
  const [availableTimes, setAvailableTimes] = useState<AvailableTimes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [findTableData, setFindTableData] = useState<FindTableData | null>(null);
  const [reservationSuccess, setReservationSuccess] = useState<boolean>(false);

  // Use TanStack Query mutation for availability check
  const checkAvailabilityMutation = useMutation({
    mutationFn: (data: ReservationCheckAvailabilityDto) => checkReservationAvailability(data),
    onSuccess: (data) => {
      // Handle the successful response
      setAvailableTimes(data);
      setError(null);
      console.log(data);
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

  // Use TanStack Query mutation for reservation submission
  const reservationMutation = useMutation({
    mutationFn: (data: ReservationPostData) => reserveTable(data),
    onSuccess: () => {
      // Handle successful reservation
      setError(null);
      setReservationSuccess(true);
    },
    onError: (error: unknown) => {
      // Handle reservation errors
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t(KEY.error_submitting_reservation));
      }
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
    const formattedDate = data.reservation_date.toISOString().split('T')[0];
    console.log(data);
    const completeData: ReservationPostData = {
      ...data,
      reservation_date: formattedDate,
    };
    console.table(completeData);
    // Submit the reservation
    reservationMutation.mutate(completeData);
  }

  const isPending = checkAvailabilityMutation.isPending || reservationMutation.isPending;
  const showSuccessMessage = reservationSuccess;
  const showReservationForm = !isPending && !reservationSuccess && availableDate && findTableData;
  const showFindTableForm = !isPending && !reservationSuccess && !availableDate;

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

        {isPending && <SamfundetLogoSpinner />}

        {showFindTableForm && <FindAvailableTablesForm onSubmit={onFindTableSubmit} />}
        {showReservationForm && (
          <ReservationDetailsForm
            findTableData={findTableData}
            availableTimes={availableTimes}
            onSubmit={onReservationSubmit}
          />
        )}
        {showSuccessMessage && (
          <div className={styles.successMessage}>
            <h2>{t('Reservation Successful!')}</h2>
            <p>{t('Your table has been reserved. We look forward to seeing you!')}</p>
          </div>
        )}
      </div>
    </SultenPage>
  );
}
