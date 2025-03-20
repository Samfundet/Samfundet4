import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { Button, Link, Page } from '~/Components';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './RecruitmentApplicationsOverviewPage.module.scss';
import { ActiveApplications, WithdrawnApplications } from './components';

export type ApplicantApplicationManagementQK = {
  applications: (recruitmentId: string) => readonly ['applications', string];
  withdrawnApplications: (recruitmentId: string) => readonly ['withdrawnApplications', string];
};

export function RecruitmentApplicationsOverviewPage() {
  const { recruitmentId } = useParams();
  const { t } = useTranslation();

  const QUERY_KEYS: ApplicantApplicationManagementQK = {
    applications: (recruitmentId: string) => ['applications', recruitmentId] as const,
    withdrawnApplications: (recruitmentId: string) => ['withdrawnApplications', recruitmentId] as const,
  };

  return (
    <Page>
      <div className={styles.container}>
        <div className={styles.top_container}>
          <Button link={ROUTES.frontend.recruitment} className={styles.back_button} theme="green">
            {t(KEY.common_go_back)}
          </Button>
          <h1 className={styles.header}>{t(KEY.recruitment_my_applications)}</h1>
          <div className={styles.empty_div} />
        </div>
        <OccupiedFormModal recruitmentId={Number.parseInt(recruitmentId ?? '')} />
        <p>{t(KEY.recruitment_will_be_anonymized)}</p>

        {recruitmentId && (
          <>
            <ActiveApplications recruitmentId={recruitmentId} queryKey={QUERY_KEYS} />
            <WithdrawnApplications recruitmentId={recruitmentId} queryKey={QUERY_KEYS} />
          </>
        )}
      </div>
    </Page>
  );
}
