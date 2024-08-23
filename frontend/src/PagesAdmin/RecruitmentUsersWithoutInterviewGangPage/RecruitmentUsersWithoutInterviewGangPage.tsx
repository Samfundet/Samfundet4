import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RecruitmentWithoutInterviewTable } from '~/Components';
import { getApplicantsWithoutInterviews, getGang, getRecruitment } from '~/api';
import { GangDto, RecruitmentDto, RecruitmentUserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentUsersWithoutInterviewGangPage.module.scss';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Text } from '~/Components/Text/Text';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { dbT } from '~/utils';

export function RecruitmentUsersWithoutInterviewGangPage() {
  const { recruitmentId, gangId } = useParams();
  const [users, setUsers] = useState<RecruitmentUserDto[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [gang, setGang] = useState<GangDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gangId, recruitmentId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gangId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId]);

  const title = t(KEY.recruitment_applicants_without_interview);
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
