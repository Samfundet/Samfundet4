import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/Components';
import { SultenDayDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { TABLES_TEST_DATA } from './utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { ReservationTable } from './components/ReservationTable';

export function SultenReservationAdminPage() {
  const navigate = useNavigate();
  const [dayInfo, setDayInfo] = useState<SultenDayDto>({} as SultenDayDto);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  // TODO add permissions on render
  useEffect(() => {
    setDayInfo({
      ...dayInfo,
      start_time: '11:00',
      closing_time: '19:00',
      date: new Date(),
      tables: TABLES_TEST_DATA,
    });
    setShowSpinner(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dateIterator(days: number) {
    const newDate = new Date();
    newDate.setDate(dayInfo.date.getDate() + days);
    setDayInfo({ ...dayInfo, date: newDate });
  }

  function goToToday() {
    setDayInfo({ ...dayInfo, date: new Date() });
  }

  const title = t(KEY.common_sulten);
  const backendUrl = ROUTES.backend.admin__samfundet_reservation_changelist;

  const header = (
    <Button theme="success" rounded={true} onClick={() => navigate(ROUTES.frontend.admin_gangs_create)}>
      TODO ADD
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <ReservationTable sultenDay={dayInfo} iterateDay={dateIterator} goToToday={goToToday} />
    </AdminPageLayout>
  );
}
