import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { getRecruitmentSharedInterviewGroups } from '~/api';
import type { RecruitmentSharedInterviewGroupDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './RecruitmentInterviewGroupsList.module.scss';
import { RecruitmentInterviewGroupComponent } from './components/RecruitmentInterviewGroupComponent/RecruitmentInterviewGroupComponent';

export function RecruitmentInterviewGroupsList() {
  const { recruitmentId } = useParams();
  const [interviewGroups, setInterviewGroups] = useState<RecruitmentSharedInterviewGroupDto[]>();
  const { t } = useTranslation();

  useEffect(() => {
    if (recruitmentId) {
      getRecruitmentSharedInterviewGroups(recruitmentId)
        .then((response) => {
          setInterviewGroups(response.data);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.log(error);
        });
    }
  }, [recruitmentId, t]);

  return (
    <div className={styles.container}>
      {interviewGroups?.map((interviewGroup: RecruitmentSharedInterviewGroupDto) => {
        return <RecruitmentInterviewGroupComponent interviewGroup={interviewGroup} key={interviewGroup.id} />;
      })}
    </div>
  );
}
