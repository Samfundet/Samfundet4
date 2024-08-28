import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RecruitmentWithoutInterviewTable } from '~/Components';
import { getApplicantsWithoutThreeInterviewCriteria, getRecruitment } from '~/api';
import { RecruitmentDto, RecruitmentUserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentUsersWithoutThreeInterviewCriteriaPage.module.scss';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Text } from '~/Components/Text/Text';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { dbT } from '~/utils';

export function RecruitmentUsersWithoutThreeInterviewCriteriaPage() {
  const { recruitmentId } = useParams();
  const [users, setUsers] = useState<RecruitmentUserDto[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  useEffect(() => {
    if (recruitmentId) {
      getApplicantsWithoutThreeInterviewCriteria(recruitmentId)
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
  }, [recruitmentId]);

  useEffect(() => {
    if (recruitmentId) {
      getRecruitment(recruitmentId)
        .then((resp) => {
          setRecruitment(resp.data);
        })
        .catch((data) => {
          // TODO add error pop up message?
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.admin_recruitment });
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(data);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId]);

  const title = t(KEY.recruitment_three_interviews_criteria_header);
  const header = (
    <div className={styles.header}>
      <Text>
        {recruitment?.organization} - {dbT(recruitment, 'name')}
      </Text>
    </div>
  );
  return (
    <AdminPageLayout title={title} header={header} loading={showSpinner}>
      {users.length > 0 ? (
        <RecruitmentWithoutInterviewTable applicants={users} />
      ) : (
        <Text>{t(KEY.recruitment_not_applicants_without_interviews)}</Text>
      )}
    </AdminPageLayout>
  );
}
