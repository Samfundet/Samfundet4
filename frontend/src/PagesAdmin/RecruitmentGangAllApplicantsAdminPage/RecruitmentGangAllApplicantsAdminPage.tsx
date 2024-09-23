import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { Text } from '~/Components/Text/Text';
import { downloadCSVGangRecruitment, getGang, getRecruitment, getRecruitmentApplicationsForGang } from '~/api';
import type { GangDto, RecruitmentApplicationDto, RecruitmentDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentGangAllApplicantsAdminPage.module.scss';

export function RecruitmentGangAllApplicantsAdminPage() {
  const { recruitmentId, gangId } = useParams();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [gang, setGang] = useState<GangDto>();
  const [applications, setApplications] = useState<RecruitmentApplicationDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const navigate = useCustomNavigate();
  const { t } = useTranslation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    if (recruitmentId && gangId) {
      getRecruitmentApplicationsForGang(recruitmentId, gangId)
        .then((response) => {
          setApplications(response.data);
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }, [recruitmentId, gangId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: t and navigate do not need to be in deplist
  useEffect(() => {
    if (gangId) {
      getGang(gangId)
        .then((gang) => {
          setGang(gang);
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate({ url: ROUTES.frontend.admin_gangs });
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }, [gangId]);

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

  const tableColumns = [
    { content: t(KEY.recruitment_applicant), sortable: true },
    { content: t(KEY.common_phonenumber), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.recruitment_position), sortable: true },
    { content: t(KEY.recruitment_interview_time), sortable: true },
    { content: t(KEY.recruitment_interview_location), sortable: true },
    { content: t(KEY.recruitment_recruiter_status), sortable: true },
  ];

  const data = applications.map((application) => {
    const applicationURL = reverse({
      pattern: ROUTES.frontend.admin_recruitment_applicant,
      urlParams: {
        applicationID: application.id,
      },
    });

    return [
      {
        content: (
          <Link url={applicationURL}>
            {application.user.first_name} {application.user.last_name}
          </Link>
        ),
      },
      application.user?.phone_number,
      application.user.email,
      { content: <Link url={applicationURL}>{dbT(application.recruitment_position, 'name')}</Link> },
      application.interview?.interview_time,
      application.interview?.interview_location,
      application.recruiter_status,
    ];
  });

  const downloadCSV = () => {
    if (recruitmentId && gangId) {
      downloadCSVGangRecruitment(recruitmentId, gangId);
    }
  };

  const title = t(KEY.recruitment_all_applications);
  const header = (
    <div className={styles.header}>
      <Text as="strong" size="m" className={styles.headerBold}>
        {dbT(gang, 'name')} - {dbT(recruitment, 'name')}
      </Text>
      <Button theme="outlined" display="pill" onClick={() => downloadCSV()}>
        {t(KEY.recrutment_export_to_csv)}
      </Button>
    </div>
  );

  return (
    <AdminPageLayout title={title} header={header} loading={showSpinner}>
      {applications.length > 0 ? (
        <Table
          columns={tableColumns}
          data={data}
          headerColumnClassName={styles.headerCol}
          cellClassName={styles.cellStyle}
        />
      ) : (
        <Text>{t(KEY.recruitment_no_current_applications_gang)}</Text>
      )}
    </AdminPageLayout>
  );
}
