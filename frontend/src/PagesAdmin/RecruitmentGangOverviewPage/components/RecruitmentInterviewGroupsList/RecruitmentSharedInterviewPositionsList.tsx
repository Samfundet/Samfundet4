import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRecruitmentSharedInterviewPositionss, getRecruitmentStats } from '~/api';
import type { RecruitmentSharedInterviewPositionsDto, RecruitmentStatsDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './RecruitmentSharedInterviewPositionsList.module.scss';
import { RecruitmentSharedInterviewPositionsComponent } from './components/RecruitmentSharedInterviewPositionsComponent/RecruitmentSharedInterviewPositionsComponent';

export function RecruitmentSharedInterviewPositionsList() {
  const { recruitmentId } = useParams();
  const [interviewGroups, setInterviewGroups] = useState<RecruitmentSharedInterviewPositionsDto[]>();
  const { t } = useTranslation();

  useEffect(() => {
    if (recruitmentId) {
      getRecruitmentSharedInterviewPositionss(recruitmentId)
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
      {interviewGroups?.map((interviewGroup: RecruitmentSharedInterviewPositionsDto) => {
        return <RecruitmentSharedInterviewPositionsComponent interviewGroup={interviewGroup} key={interviewGroup.id} />;
      })}
    </div>
  );
}
