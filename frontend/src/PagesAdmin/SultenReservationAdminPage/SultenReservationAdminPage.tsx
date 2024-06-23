import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/Components';
import type { SultenReservationDayDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { ReservationTable } from './components/ReservationTable';
import { TABLES_TEST_DATA } from './utils';

export function SultenReservationAdminPage() {
  const [dayInfo, setDayInfo] = useState<SultenReservationDayDto>({} as SultenReservationDayDto);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  // TODO add permissions on render

  const today = new Date();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setDayInfo({
      ...dayInfo,
      start_time: '11:00',
      closing_time: '19:00',
      date: today,
      tables: TABLES_TEST_DATA,
    });
    setShowSpinner(false);
  }, []);

  function dateIterator(days: number) {
    const newDate = new Date();
    newDate.setDate(dayInfo.date.getDate() + days);
    setDayInfo({ ...dayInfo, date: newDate });
  }

  function goToToday() {
    setDayInfo({ ...dayInfo, date: today });
  }

  const title = t(KEY.common_sulten);
  const backendUrl = ROUTES.backend.admin__samfundet_reservation_changelist;

  const header = (
    <Button theme="success" rounded={true} onClick={() => alert('TODO add reservationadmin')}>
      TODO ADD
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <ReservationTable sultenDay={dayInfo} iterateDay={dateIterator} goToToday={goToToday} />
    </AdminPageLayout>
  );
}
