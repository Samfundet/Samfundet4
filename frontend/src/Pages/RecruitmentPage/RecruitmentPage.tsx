import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Page, SamfundetLogoSpinner } from '~/Components';
import { getActiveRecruitments } from '~/api';
import type { RecruitmentDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, getObjectFieldOrNumber } from '~/utils';
import { NoPositions, RecruitmentCard } from './Components';
import styles from './RecruitmentPage.module.scss';

export function RecruitmentPage() {
  const navigate = useCustomNavigate();
  const [recruitments, setRecruitments] = useState<RecruitmentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  useTitle(t(KEY.common_recruitment));

  useEffect(() => {
    getActiveRecruitments()
      .then((response) => {
        if (response.data.length === 1) {
          navigate({
            url: reverse({
              pattern: ROUTES.frontend.organization_recruitment,
              urlParams: { recruitmentId: (response.data[0] as RecruitmentDto).id },
            }),
            replace: true,
          });
        } else {
          setRecruitments(response.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
        setLoading(false);
      });
  }, [navigate]);

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
