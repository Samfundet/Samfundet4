import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, SamfundetLogoSpinner } from '~/Components';
import { getActiveRecruitments } from '~/api';
import { RecruitmentDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { RecruitmentCard } from './Components';
import styles from './RecruitmentPage.module.scss';

export function RecruitmentPage() {
  const [recruitments, setRecruitments] = useState<RecruitmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useTitle(t(KEY.common_recruitment));

  useEffect(() => {
    getActiveRecruitments()
      .then((response) => {
        setRecruitments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Page className={styles.recruitmentPage}>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          {loading ? (
            <SamfundetLogoSpinner />
          ) : (
            recruitments.map((recruitment: RecruitmentDto) => (
              <RecruitmentCard
                key={recruitment.id}
                recruitment_id={recruitment.id}
                recruitment_name_nb={recruitment.name_nb}
                recruitment_name_en={recruitment.name_en}
                shown_application_deadline={recruitment.shown_application_deadline}
                reprioritization_deadline_for_applicant={recruitment.reprioritization_deadline_for_applicant}
                organization_id={recruitment.organization}
              />
            ))
          )}
        </div>
      </div>
    </Page>
  );
}
