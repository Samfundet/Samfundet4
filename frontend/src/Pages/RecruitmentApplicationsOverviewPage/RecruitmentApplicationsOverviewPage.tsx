import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Page } from '~/Components';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './RecruitmentApplicationsOverviewPage.module.scss';
import { ActiveApplications } from './components/ActiveApplications';
import { WithdrawnApplications } from './components/WithdrawnApplications';

export type ApplicantApplicationManagementQK = {
  applications: (recruitmentId: string) => readonly ['applications', string];
  withdrawnApplications: (recruitmentId: string) => readonly ['withdrawnApplications', string];
};

export function RecruitmentApplicationsOverviewPage() {
  const { recruitmentID } = useParams();
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
        <OccupiedFormModal recruitmentId={Number.parseInt(recruitmentID ?? '')} />
        <p>{t(KEY.recruitment_will_be_anonymized)}</p>
        <ActiveApplications recruitmentId={recruitmentID} queryKey={QUERY_KEYS} />
        <WithdrawnApplications recruitmentId={recruitmentID} queryKey={QUERY_KEYS} />
      </div>
    </Page>
  );
}
