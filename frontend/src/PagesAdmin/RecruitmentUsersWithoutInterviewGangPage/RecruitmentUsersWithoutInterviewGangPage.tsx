import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RecruitmentWithoutInterviewTable } from '~/Components';
import { Text } from '~/Components/Text/Text';
import { getApplicantsWithoutInterviews, getGang, getRecruitment } from '~/api';
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
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.not_found, replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(data);
        });
    }
  }, [recruitmentId]);

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
      <RecruitmentWithoutInterviewTable applicants={users} />
    </AdminPageLayout>
  );
}
