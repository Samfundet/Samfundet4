import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { ReservationDetailsForm, type ReservationFormData } from './Components/ReserveTableForm/ReserveTableForm';
import styles from './LycheReservationPage.module.scss';

export function LycheReservationPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_reservation), t(KEY.common_sulten));
  const sultenMail = useKeyValue(KV.SULTEN_MAIL);
  const [availableDate, setAvailableDate] = useState<boolean>(false);
  const [availableTimes, setAvailableTimes] = useState<AvailableTimes[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [findTableData, setFindTableData] = useState<FindTableData | null>(null);

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

        {!checkAvailabilityMutation.isPending && availableDate && findTableData && (
          <ReservationDetailsForm
            findTableData={findTableData}
            availableTimes={availableTimes}
            onSubmit={onReservationSubmit}
          />
        )}

        {!checkAvailabilityMutation.isPending && !availableDate && (
          <FindAvailableTablesForm onSubmit={onFindTableSubmit} />
        )}
      </div>
    </SultenPage>
  );
}
