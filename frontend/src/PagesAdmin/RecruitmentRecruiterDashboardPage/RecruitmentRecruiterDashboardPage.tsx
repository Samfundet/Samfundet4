import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { BackButton, Button, H3, Link, OccupiedFormModal, Page, SamfundetLogoSpinner } from '~/Components';
import { getRecruitmentApplicationsForRecruiter, withdrawRecruitmentApplicationRecruiter } from '~/api';
import { RecruitmentApplicationDto, RecruitmentUserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentRecruiterDashboardPage.module.scss';
import { Text } from '~/Components/Text/Text';
import { Table } from '~/Components/Table';
import classNames from 'classnames';
import { useNavigate, useParams } from 'react-router-dom';
import { STATUS } from '~/http_status_codes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

export function RecruitmentRecruiterDashboardPage() {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const title = t(KEY.recruitment_overview);
  const header = (
    <div className={styles.header}>
      <Text>{t(KEY.recruitment_dashboard_description)}</Text>
      <div className={styles.occupied_container}>
        <OccupiedFormModal recruitmentId={parseInt(recruitmentId ?? '')} />
      </div>
    </div>
  );

  return (
    <AdminPageLayout title={title} header={header} loading={loading}>
      <h1></h1>
    </AdminPageLayout>
  );
}
