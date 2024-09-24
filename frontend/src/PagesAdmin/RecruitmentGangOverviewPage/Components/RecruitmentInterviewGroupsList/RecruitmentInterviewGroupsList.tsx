import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Chart } from '~/Components';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentSharedInterviewGroups, getRecruitmentStats } from '~/api';
import type { RecruitmentSharedInterviewGroupDto, RecruitmentStatsDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { RecruitmentInterviewGroupComponent } from './Components/RecruitmentInterviewGroupComponent';
import styles from './RecruitmentInterviewGroupsList.module.scss';

export function RecruitmentInterviewGroupsList() {
  const { recruitmentId } = useParams();
  const [interviewGroups, setInterviewGroups] = useState<RecruitmentSharedInterviewGroupDto[]>();
  const { t } = useTranslation();
  // TODO: add dynamic data and might need backend features (in ISSUE #1110)

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
