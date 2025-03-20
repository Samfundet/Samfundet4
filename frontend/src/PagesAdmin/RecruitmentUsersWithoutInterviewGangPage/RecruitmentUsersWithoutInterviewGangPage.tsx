import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { RecruitmentWithoutInterviewTable } from '~/Components';
import { Text } from '~/Components/Text/Text';
import { getApplicantsWithoutInterviews, getGang, getRecruitment, getRecruitmentGangStats } from '~/api';
import type { GangDto, RecruitmentDto, RecruitmentUserDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentUsersWithoutInterviewGangPage.module.scss';

export function RecruitmentUsersWithoutInterviewGangPage() {
  const { recruitmentId, gangId } = useParams();
  const [users, setUsers] = useState<RecruitmentUserDto[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [withoutInterviewCount, setWithoutInterviewCount] = useState<number>();
  const [gang, setGang] = useState<GangDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    if (recruitmentId) {
      getApplicantsWithoutInterviews(recruitmentId, gangId)
        .then((response) => {
          setUsers(response.data);
          setWithoutInterviewCount(response.data.length);
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }, [gangId, recruitmentId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (gangId) {
      getGang(gangId)
        .then((gang) => {
          setGang(gang);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.not_found, replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }, [gangId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (recruitmentId) {
      getRecruitment(recruitmentId)
        .then((resp) => {
          setRecruitment(resp.data);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            toast.error(t(KEY.common_something_went_wrong));
            console.error(data);
            navigate({ url: ROUTES.frontend.not_found, replace: true });
          }
        });
    }
  }, [recruitmentId]);

  const { data: gangStats } = useQuery({
    queryKey: ['recruitmentGangStats', recruitmentId, gangId],
    queryFn: () => getRecruitmentGangStats(recruitmentId as string, gangId as string),
    enabled: Boolean(typeof recruitmentId === 'string' && typeof gangId === 'string'),
  });

  const title = t(KEY.recruitment_applicants_without_interview);
  useTitle(title);
  const header = (
    <div className={styles.header}>
      <Text as="strong" size="m" className={styles.headerBold}>
        {dbT(gang, 'name')} - {dbT(recruitment, 'name')}
      </Text>
      <Text>
        {users.length > 0
          ? t(KEY.recruitment_applicants_without_interview_help_text)
          : t(KEY.recruitment_not_applicants_without_interviews)}
      </Text>
    </div>
  );
  return (
    <AdminPageLayout title={title} backendUrl={ROUTES.backend.samfundet__user} header={header} loading={showSpinner}>
      {gangStats && (
        <Text size="l">
          {[
            withoutInterviewCount,
            t(KEY.common_out_of),
            t(KEY.common_total).toLowerCase(),
            gangStats.data.applicant_count,
            t(KEY.recruitment_applications),
            t(KEY.common_have),
            t(KEY.recruitment_interview),
          ].join(' ')}
        </Text>
      )}
      <RecruitmentWithoutInterviewTable applicants={users} />
    </AdminPageLayout>
  );
}
