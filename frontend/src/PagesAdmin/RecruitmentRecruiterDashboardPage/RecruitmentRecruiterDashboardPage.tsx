import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { H2, Link, OccupiedFormModal } from '~/Components';
import { getRecruitmentRecruiterDashboard } from '~/api';
import { RecruitmentApplicationDto, RecruitmentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './RecruitmentRecruiterDashboardPage.module.scss';
import { Text } from '~/Components/Text/Text';
import { Table } from '~/Components/Table';
import { useParams } from 'react-router-dom';
import { STATUS } from '~/http_status_codes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { useCustomNavigate } from '~/hooks';

export function RecruitmentRecruiterDashboardPage() {
  const { t } = useTranslation();
  const { recruitmentId } = useParams();
  const navigate = useCustomNavigate();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [applications, setApplications] = useState<RecruitmentApplicationDto[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (recruitmentId) {
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
    }
  }, [navigate, recruitmentId, t]);

  if (!recruitmentId) {
    navigate({ url: ROUTES.frontend.not_found });
    return <></>;
  }

  const title = `${t(KEY.recruitment_overview)} - ${recruitment?.organization} - ${dbT(recruitment, 'name')}`;
  const header = (
    <div className={styles.header}>
      <Text>{t(KEY.recruitment_dashboard_description)}</Text>
      <div className={styles.occupied_container}>
        <OccupiedFormModal recruitmentId={parseInt(recruitmentId)} />
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
    ? applications.map(function (application) {
        return [
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
                    positionID: application.recruitment_position.id,
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
        ];
      })
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