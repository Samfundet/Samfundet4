import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Link, Table, Text } from '~/Components';
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
  useEffect(() => {
    if (recruitmentId) {
      getRecruitmentApplicationsForApplicant(recruitmentId).then((response) => {
        setApplications(response.data);
      });
    }
  }, [recruitmentId]);
  const tableColumns = [
    { sortable: false, content: t(KEY.recruitment_position) },
    { sortable: false, content: t(KEY.recruitment_change_priority) },
    { sortable: true, content: t(KEY.recruitment_your_priority) },
    { sortable: false, content: t(KEY.recruitment_interview_time) },
    { sortable: false, content: t(KEY.recruitment_interview_location) },

    { sortable: false, content: t(KEY.recruitment_withdraw_application) },
  ];

  function applicationToTableRow(application: RecruitmentApplicationDto) {
    const position = [
      {
        content: (
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
        ),
      },
    ];
    const notWithdrawn = [
      { content: upDownArrow(application.id) },
      application.applicant_priority,
      niceDateTime(application.interview?.interview_time) ?? '-',
      application.interview?.interview_location ?? '-',
    ];
    const withdrawn = [
      {
        content: (
          <Text as="strong" className={styles.withdrawnText}>
            {t(KEY.recruitment_withdrawn)}
          </Text>
        ),
      },
    ];
    const widthdrawButton = {
      content: (
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
      ),
    };
    return [...position, ...(application.withdrawn ? withdrawn : notWithdrawn), widthdrawButton];
  }
  return (
    <div>
      {applications.length > 0 ? (
        <Table
          data={applications.map((application) => ({ cells: applicationToTableRow(application) }))}
          columns={tableColumns}
          defaultSortColumn={3}
        />
      ) : (
        <p>{t(KEY.recruitment_not_applied)}</p>
      )}
    </div>
  );
}
