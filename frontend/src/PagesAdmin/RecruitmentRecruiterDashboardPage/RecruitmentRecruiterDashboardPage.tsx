import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { H2, Link, OccupiedFormModal } from '~/Components';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import { getRecruitmentRecruiterDashboard } from '~/api';
import type { RecruitmentApplicationDto, RecruitmentDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT, getObjectFieldOrNumber } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentRecruiterDashboardPage.module.scss';

export function RecruitmentRecruiterDashboardPage() {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();
  const navigate = useCustomNavigate();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [applications, setApplications] = useState<RecruitmentApplicationDto[]>();
  const [loading, setLoading] = useState(true);
  useTitle(`${t(KEY.recruitment_recruiter_dashboard)} ${dbT(recruitment, 'name')}`);

  // biome-ignore lint/correctness/useExhaustiveDependencies: navigate must not be in deplist
  useEffect(() => {
    if (!recruitmentId) return;
    getRecruitmentRecruiterDashboard(recruitmentId)
      .then((resp) => {
        setRecruitment(resp.data.recruitment);
        setApplications(resp.data.applications);
        setLoading(false);
      })
      .catch((data) => {
        toast.error(t(KEY.common_something_went_wrong));
        if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
          navigate({ url: ROUTES.frontend.not_found });
        }
      });
  }, [recruitmentId, t]);

  if (!recruitmentId) {
    navigate({ url: ROUTES.frontend.not_found });
    return <></>;
  }

  const title = `${t(KEY.recruitment_recruiter_dashboard)} - ${getObjectFieldOrNumber(recruitment?.organization, 'name')} - ${dbT(
    recruitment,
    'name',
  )}`;
  const header = (
    <div className={styles.header}>
      <Text>{t(KEY.recruitment_dashboard_description)}</Text>
      <div className={styles.occupied_container}>
        <OccupiedFormModal recruitmentId={Number.parseInt(recruitmentId)} />
      </div>
    </div>
  );

  const interviewTableColumns = [
    { content: t(KEY.recruitment_applicant), sortable: true },
    { content: t(KEY.recruitment_position), sortable: true },
    { content: t(KEY.recruitment_interview_time), sortable: true },
    { content: t(KEY.recruitment_interview_location), sortable: true },
  ];

  const interviewTableRow = applications
    ? applications.map((application) => ({
        cells: [
          {
            value: application.user.first_name,
            content: (
              <Link
                url={reverse({
                  pattern: ROUTES.frontend.admin_recruitment_applicant,
                  urlParams: {
                    applicationID: application.id,
                  },
                })}
              >
                {`${application.user.first_name} ${application.user.last_name}`}
              </Link>
            ),
          },
          {
            value: dbT(application.recruitment_position, 'name'),
            content: (
              <Link
                url={reverse({
                  pattern: ROUTES.frontend.recruitment_application,
                  urlParams: {
                    positionId: application.recruitment_position.id,
                  },
                })}
              >
                {dbT(application.recruitment_position, 'name')}
              </Link>
            ),
          },
          {
            value: application.interview?.interview_time,
          },
          {
            value: application.interview?.interview_location,
          },
        ],
      }))
    : [];

  return (
    <AdminPageLayout title={title} header={header} loading={loading}>
      <H2>{t(KEY.recruitment_interviews)}</H2>
      {applications && applications.length > 0 ? (
        <Table columns={interviewTableColumns} data={interviewTableRow} />
      ) : (
        <Text>{t(KEY.recruitment_no_interviews)}</Text>
      )}
    </AdminPageLayout>
  );
}
