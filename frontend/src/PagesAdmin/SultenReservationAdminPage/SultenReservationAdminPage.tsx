import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '~/Components';
import { SultenDayDto, ReservationTableDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
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
    const tables = [
      {
        id: 1,
        name_nb: 'Bord 1',
        description_nb: 'Dette er bord 1',
        name_en: 'table 1',
        description_en: 'this is table 1',
        seating: 4,
        reservations: [
          {
            start_time: '12:30',
            end_time: '13:00',
            name: 'Jørgen',
          },
          {
            start_time: '17:30',
            end_time: '18:00',
            name: 'Hannah',
          },
          {
            start_time: '11:15',
            end_time: '12:15',
            name: 'Magnus',
          },
        ] as ReservationTableDto[],
      },
      {
        id: 2,
        name_nb: 'Bord 2',
        description_nb: 'Dette er bord 2',
        name_en: 'table 2',
        description_en: 'this is table 2',
        seating: 8,
      },
      {
        id: 3,
        name_nb: 'Bord 3',
        description_nb: 'Dette er bord 3',
        name_en: 'table 3',
        description_en: 'this is table 3',
        seating: 2,
        reservations: [
          {
            start_time: '14:30',
            end_time: '16:15',
            name: 'Jørgen',
          },
        ] as ReservationTableDto[],
      },
    ];

    setDayInfo({
      ...dayInfo,
      start_time: '11:00',
      closing_time: '19:00',
      date: new Date(),
      tables: tables,
    });
    setShowSpinner(false);
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
