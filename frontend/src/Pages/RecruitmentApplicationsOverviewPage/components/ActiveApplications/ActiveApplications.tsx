import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Link, Table } from '~/Components';
import {
  getRecruitmentApplicationsForApplicant,
  putRecruitmentPriorityForUser,
  withdrawRecruitmentApplicationApplicant,
} from '~/api';
import type { RecruitmentApplicationDto, UserPriorityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, niceDateTime } from '~/utils';
import styles from './ActiveApplications.module.scss';

type ActiveApplicationsProps = {
  recruitmentId?: string;
};
export function ActiveApplications({ recruitmentId }: ActiveApplicationsProps) {
  const [applications, setApplications] = useState<RecruitmentApplicationDto[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();

  function handleChangePriority(id: string, direction: 'up' | 'down') {
    const data: UserPriorityDto = { direction: direction === 'up' ? 1 : -1 };
    putRecruitmentPriorityForUser(id, data).then((response) => {
      setApplications(response.data);
    });
  }

  useEffect(() => {
    if (recruitmentId) {
      getRecruitmentApplicationsForApplicant(recruitmentId).then((response) => {
        setApplications(response.data);
      });
    }
  }, [recruitmentId]);

  const upDownArrow = (id: string) => {
    return (
      <>
        <Icon
          icon="bxs:up-arrow"
          className={styles.arrows}
          width={'1.5rem'}
          onClick={() => handleChangePriority(id, 'up')}
        />
        <Icon
          icon="bxs:down-arrow"
          className={styles.arrows}
          width={'1.5rem'}
          onClick={() => handleChangePriority(id, 'down')}
        />
      </>
    );
  };

  const applicationLink = (application: RecruitmentApplicationDto) => {
    return (
      <Link
        url={reverse({
          pattern: ROUTES.frontend.recruitment_application,
          urlParams: {
            positionID: application.recruitment_position.id,
            gangID: application.recruitment_position.gang.id,
          },
        })}
        className={styles.position_name}
      >
        {dbT(application.recruitment_position, 'name')}
      </Link>
    );
  };

  const withdrawButton = (application: RecruitmentApplicationDto) => {
    return (
      <Button
        theme="samf"
        onClick={() => {
          if (window.confirm(t(KEY.recruitment_withdraw_application))) {
            withdrawRecruitmentApplicationApplicant(application.recruitment_position.id)
              .then(() => {
                // redirect to the same page to refresh the data
                navigate(0);
              })
              .catch(() => {
                toast.error(t(KEY.common_something_went_wrong));
              });
          }
        }}
      >
        {t(KEY.recruitment_withdraw_application)}
      </Button>
    );
  };
  const tableColumns = [
    { sortable: false, content: t(KEY.recruitment_change_priority) },
    { sortable: false, content: t(KEY.recruitment_position) },

    { sortable: false, content: t(KEY.recruitment_your_priority) },
    { sortable: false, content: t(KEY.recruitment_interview_time) },
    { sortable: false, content: t(KEY.recruitment_interview_location) },

    { sortable: false, content: t(KEY.recruitment_withdraw_application) },
  ];

  const tableRows = applications.map((application) => ({
    cells: [
      {
        content: upDownArrow(application.id),
      },
      {
        content: applicationLink(application),
      },

      {
        content: application.applicant_priority,
      },
      {
        content: niceDateTime(application.interview?.interview_time) ?? '-',
      },
      {
        content: application.interview?.interview_location ?? '-',
      },
      {
        content: withdrawButton(application),
      },
    ],
  }));

  return (
    <div>
      {applications.length > 0 ? (
        <Table data={tableRows} columns={tableColumns} />
      ) : (
        <p>{t(KEY.recruitment_not_applied)}</p>
      )}
    </div>
  );
}
