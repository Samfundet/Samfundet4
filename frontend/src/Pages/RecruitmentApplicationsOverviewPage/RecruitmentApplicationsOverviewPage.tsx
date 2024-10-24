import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Page } from '~/Components';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import styles from './RecruitmentApplicationsOverviewPage.module.scss';
import { ActiveApplications } from './components/ActiveApplications';
import { WithdrawnApplications } from './components/WithdrawnApplications';

export function RecruitmentApplicationsOverviewPage() {
  const { recruitmentID } = useParams();
  const { t } = useTranslation();
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
        <p>{t(KEY.recruitment_will_be_anonymized)}</p>
        <ActiveApplications recruitmentId={recruitmentID} />
        <OccupiedFormModal recruitmentId={Number.parseInt(recruitmentID ?? '')} />
        <WithdrawnApplications recruitmentId={recruitmentID} />
      </div>
    </Page>
  );
}
