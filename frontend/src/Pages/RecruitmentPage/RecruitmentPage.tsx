import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, SamfundetLogoSpinner } from '~/Components';
import { getActiveRecruitments } from '~/api';
import { RecruitmentDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { RecruitmentCard, NoPositions } from './Components';
import styles from './RecruitmentPage.module.scss';
import { dbT, getObjectFieldOrNumber } from '~/utils';

export function RecruitmentPage() {
  const [recruitments, setRecruitments] = useState<RecruitmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useTitle(t(KEY.common_recruitment));

  useEffect(() => {
    getActiveRecruitments()
      .then((response) => {
        setRecruitments(response.data);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
    setLoading(false);
  }, []);

  return (
    <Page>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          {loading ? (
            <SamfundetLogoSpinner />
          ) : recruitments && recruitments.length > 0 ? (
            recruitments.map((recruitment: RecruitmentDto) => (
              <RecruitmentCard
                key={recruitment.id}
                recruitment_id={recruitment.id}
                recruitment_name={dbT(recruitment, 'name')}
                shown_application_deadline={recruitment.shown_application_deadline}
                reprioritization_deadline_for_applicant={recruitment.reprioritization_deadline_for_applicant}
                organization_id={getObjectFieldOrNumber<number>(recruitment.organization, 'id') ?? 0}
              />
            ))
          ) : (
            <NoPositions />
          )}
        </div>
      </div>
    </Page>
  );
}
