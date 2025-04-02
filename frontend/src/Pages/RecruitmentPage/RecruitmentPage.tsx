import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Page, SamfundetLogoSpinner } from '~/Components';
import { getActiveSamfRecruitments } from '~/api';
import type { RecruitmentDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { recruitmentKeys } from '~/queryKeys';
import { NoPositions, RecruitmentCard } from './Components';
import styles from './RecruitmentPage.module.scss';

export function RecruitmentPage() {
  const { t } = useTranslation();
  useTitle(t(KEY.common_recruitment));

  const { data: activeSamfRecruitments, isLoading } = useQuery({
    /* Important! Navbar navigates to this page if there are multiple active Samf recruitments! */
    /* Take it into consideration if recruitments for all organizations should be fetched here in the future */
    queryKey: recruitmentKeys.all,
    queryFn: getActiveSamfRecruitments,
  });

  return (
    <Page>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          {isLoading ? (
            <SamfundetLogoSpinner />
          ) : activeSamfRecruitments && activeSamfRecruitments.length > 0 ? (
            activeSamfRecruitments.map((recruitment: RecruitmentDto) => (
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
