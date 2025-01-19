import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Link, Page } from '~/Components';
import { OccupiedFormModal } from '~/Components/OccupiedForm';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
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
import styles from './RecruitmentApplicationsOverviewPage.module.scss';

export function RecruitmentApplicationsOverviewPage() {
  const { recruitmentId } = useParams();
  const [applications, setApplications] = useState<RecruitmentApplicationDto[]>([]);
  const [withdrawnApplications, setWithdrawnApplications] = useState<RecruitmentApplicationDto[]>([]);
  const navigate = useNavigate();

  const { t } = useTranslation();

  function handleChangePriority(id: string, direction: 'up' | 'down') {
    const data: UserPriorityDto = { direction: direction === 'up' ? 1 : -1 };
    putRecruitmentPriorityForUser(id, data).then((response) => {
      setApplications(response.data);
    });
  }

  function upDownArrow(id: string) {
    return (
      <>
        <Icon icon="bxs:up-arrow" className={styles.arrows} onClick={() => handleChangePriority(id, 'up')} />
        <Icon icon="bxs:down-arrow" className={styles.arrows} onClick={() => handleChangePriority(id, 'down')} />
      </>
    );
  }

  useEffect(() => {
    if (recruitmentId) {
      getRecruitmentApplicationsForApplicant(recruitmentId).then((response) => {
        setApplications(response.data.filter((application) => !application.withdrawn));
        setWithdrawnApplications(response.data.filter((application) => application.withdrawn));
      });
    }
  }, [recruitmentId]);

  const tableColumns = [
    { sortable: false, content: t(KEY.recruitment_position) },
    { sortable: false, content: t(KEY.recruitment_interview_time) },
    { sortable: false, content: t(KEY.recruitment_interview_location) },
    { sortable: true, content: t(KEY.recruitment_priority) },
    { sortable: false, content: '' },
    { sortable: false, content: '' },
  ];

  function applicationToTableRow(application: RecruitmentApplicationDto) {
    const position = [
      {
        content: (
          <Link
            url={reverse({
              pattern: ROUTES.frontend.recruitment_application,
              urlParams: {
                positionId: application.recruitment_position.id,
                recruitmentId: recruitmentId,
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
      niceDateTime(application.interview?.interview_time),
      application.interview?.interview_location,
      application.applicant_priority,
      { content: upDownArrow(application.id) },
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

  const withdrawnTableColumns = [{ sortable: true, content: t(KEY.recruitment_withdrawn) }];

  function withdrawnApplicationToTableRow(application: RecruitmentApplicationDto) {
    return [
      {
        value: dbT(application.recruitment_position, 'name'),
        content: (
          <Link
            url={reverse({
              pattern: ROUTES.frontend.recruitment_application,
              urlParams: {
                positionId: application.recruitment_position.id,
                recruitmentId: recruitmentId,
              },
            })}
            className={styles.withdrawnLink}
          >
            {dbT(application.recruitment_position, 'name')}
          </Link>
        ),
      },
    ];
  }

  return (
    <Page>
      <div className={styles.container}>
        <div className={styles.top_container}>
          <Button link={ROUTES.frontend.recruitment} className={styles.back_button} theme="green">
            {t(KEY.common_go_back)}
          </Button>
          <h1 className={styles.header}>{t(KEY.recruitment_my_applications)}</h1>
          <div className={styles.empty_div} />
        </div>
        <p>{t(KEY.recruitment_will_be_anonymized)}</p>
        {applications.length > 0 ? (
          <Table
            data={applications.map((application) => ({ cells: applicationToTableRow(application) }))}
            columns={tableColumns}
            defaultSortColumn={3}
          />
        ) : (
          <p>{t(KEY.recruitment_not_applied)}</p>
        )}

        <OccupiedFormModal recruitmentId={Number.parseInt(recruitmentId ?? '')} />

        {withdrawnApplications.length > 0 && (
          <div className={styles.withdrawnContainer}>
            <Table
              bodyRowClassName={styles.withdrawnRow}
              headerClassName={styles.withdrawnHeader}
              headerColumnClassName={styles.withdrawnHeader}
              data={withdrawnApplications.map((application) => ({
                cells: withdrawnApplicationToTableRow(application),
              }))}
              columns={withdrawnTableColumns}
            />
          </div>
        )}
      </div>
    </Page>
  );
}
