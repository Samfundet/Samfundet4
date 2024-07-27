import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Page, Video } from '~/Components';
import { getActiveRecruitments } from '~/api';
import { RecruitmentDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { RecruitmentCard } from './Components';
import styles from './RecruitmentPage.module.scss';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { reverse } from '~/named-urls';
import { useAuthContext } from '~/context/AuthContext';

export function RecruitmentPage() {
  const { user } = useAuthContext();
  const navigate = useCustomNavigate();
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
        <Video embedId="-nYQb8_TvQ4" className={styles.video}></Video>
        <div className={styles.cardContainer}>
          {recruitments.map((recruitment: RecruitmentDto) => (
            <RecruitmentCard
              key={recruitment.id}
              recruitment_id={recruitment.id}
              recruitment_name_nb={recruitment.name_nb}
              recruitment_name_en={recruitment.name_en}
              shown_application_deadline={recruitment.shown_application_deadline}
              reprioritization_deadline_for_applicant={recruitment.reprioritization_deadline_for_applicant}
              organization_id={recruitment.organization}
            />
          ))}
        </div>
        {user ? (
          <div className={styles.personalRow}>
            <OccupiedFormModal recruitmentId={1} />
            <Button
              theme="samf"
              onClick={() => {
                navigate({
                  url: reverse({
                    pattern: ROUTES.frontend.recruitment_application_overview,
                    urlParams: { recruitmentID: 1 },
                  }),
                });
              }}
            >
              {t(KEY.recruitment_my_applications)}
            </Button>
          </div>
        ) : (
          <div>
            <Button
              theme="samf"
              onClick={() =>
                navigate({
                  url: ROUTES.frontend.login,
                })
              }
            >
              {t(KEY.common_login)}
            </Button>
          </div>
        )}
      </div>
    </Page>
  );
}
