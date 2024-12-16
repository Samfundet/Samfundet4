import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, SamfundetLogoSpinner } from '~/Components';
import { getActiveRecruitments } from '~/api';
import type { RecruitmentDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { NoPositions, RecruitmentCard } from './Components';
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
              <RecruitmentCard recruitment={recruitment} key={recruitment.id} />
            ))
          ) : (
            <NoPositions />
          )}
        </div>
      </div>
    </Page>
  );
}
