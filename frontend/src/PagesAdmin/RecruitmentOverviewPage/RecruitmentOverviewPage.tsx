import { useQuery } from '@tanstack/react-query';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TabView } from '~/Components';
import type { Tab } from '~/Components/TabBar/TabBar';
import { AdminPageLayout } from '~/PagesAdmin/AdminPageLayout/AdminPageLayout';
import { getRecruitmentForRecruiter } from '~/api';
import { RecruitmentDto, type RecruitmentForRecruiterDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { RecruitmentProgression } from './Components/RecruitmentProgression';
import { RecruitmentStatistics } from './Components/RecruitmentStatistics';

export function RecruitmentOverviewPage() {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();
  const RECRUITMENT_TITLE_PLACEHOLDER: string = 'PLACEHOLDER-RECRUITMENT-TITLE';

  const { data, isLoading, error } = useQuery<RecruitmentForRecruiterDto>({
    queryKey: ['recruitmentStats', recruitmentId],
    queryFn: () => getRecruitmentForRecruiter(recruitmentId as string),
    enabled: typeof recruitmentId === 'string',
  });

  const tabs: Tab<ReactNode>[] = useMemo(() => {
    return [
      { key: 1, label: t(KEY.recruitment_progression), value: <RecruitmentProgression recruitment={data} /> },
      { key: 2, label: t(KEY.recruitment_statistics), value: <RecruitmentStatistics statistics={data?.statistics} /> },
    ];
  }, [data, t]);
    
  useTitle(t(KEY.recruitment_overview));
  return (
    <AdminPageLayout title={`${t(KEY.recruitment_overview)}: ${RECRUITMENT_TITLE_PLACEHOLDER}`}>
      <TabView tabs={tabs} />
    </AdminPageLayout>
  );
}
