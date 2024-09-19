import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RecruitmentWithoutInterviewTable } from '~/Components';
import { Text } from '~/Components/Text/Text';
import { getApplicantsWithoutThreeInterviewCriteria, getRecruitment } from '~/api';
import type { RecruitmentDto, RecruitmentUserDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT, getObjectFieldOrNumber } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentUsersWithoutThreeInterviewCriteriaPage.module.scss';

export function RecruitmentUsersWithoutThreeInterviewCriteriaPage() {
  const { recruitmentId } = useParams();
  const [users, setUsers] = useState<RecruitmentUserDto[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
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
  }, [recruitmentId]);

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
            navigate({ url: ROUTES.frontend.admin_recruitment });
          }
          toast.error(t(KEY.common_something_went_wrong));
          console.error(data);
        });
    }
  }, [recruitmentId]);

  const title = t(KEY.recruitment_three_interviews_criteria_header);
  const header = (
    <div className={styles.header}>
      <Text>{getObjectFieldOrNumber<string>(recruitment?.organization, 'name')}</Text>
      <Text>{dbT(recruitment, 'name')}</Text>
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
