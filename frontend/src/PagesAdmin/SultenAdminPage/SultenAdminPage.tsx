import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { CrudButtons } from '~/Components/CrudButtons/CrudButtons';
import { Tab, TabBar } from '~/Components/TabBar/TabBar';
import { Table } from '~/Components/Table';
import { getGangList } from '~/api';
import { GangTypeDto, SultenDayDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './SultenAdminPage.module.scss';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { ReservationTable } from './components/ReservationTable';
import { setDay } from 'date-fns';

export function SultenAdminPage() {
  const navigate = useNavigate();
  const [dayInfo, setDayInfo] = useState<SultenDayDto>({} as SultenDayDto);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();

  // Stuff to do on first render.
  // TODO add permissions on render
  useEffect(() => {
    setDayInfo({ ...dayInfo, date: new Date() });
    setShowSpinner(false);
  }, []);

  useEffect(() => {
    console.log(dayInfo);
  }, [dayInfo]);

  const dateIterator = (days: number) => {
    const newDate = new Date();
    newDate.setDate(dayInfo.date.getDate() + days);
    setDayInfo({ ...dayInfo, date: newDate });
  };


  const goToToday = () => {
    setDayInfo({ ...dayInfo, date: new Date() });
  };

  const title = t(KEY.common_sulten);
  const backendUrl = ROUTES.backend.admin__samfundet_reservation_changelist;

  const header = (
    <Button theme="success" rounded={true} onClick={() => navigate(ROUTES.frontend.admin_gangs_create)}>
      Add text
    </Button>
  );

  return (
    <AdminPageLayout title={title} backendUrl={backendUrl} header={header} loading={showSpinner}>
      <ReservationTable sultenDay={dayInfo} iterateDay={dateIterator} goToToday={goToToday} />
    </AdminPageLayout>
  );
}
