import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Link } from '~/Components';
import { Table } from '~/Components/Table';
import { getGang, getGangs, getRecruitment, getRecruitmentAdmissionsForGang } from '~/api';
import { GangDto, RecruitmentAdmissionDto, RecruitmentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { useCustomNavigate } from '~/hooks';
import { toast } from 'react-toastify';
import { STATUS } from '~/http_status_codes';
import { Text } from '~/Components/Text/Text';
import styles from './RecruitmentGangAllApplicantsAdminPage.module.scss';

export function RecruitmentGangAllApplicantsAdminPage() {
  const { recruitmentId, gangId } = useParams();
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const [gang, setGang] = useState<GangDto>();
  const [admissions, setAdmissions] = useState<RecruitmentAdmissionDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const navigate = useCustomNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (recruitmentId && gangId) {
      getRecruitmentAdmissionsForGang(recruitmentId, gangId)
        .then((response) => {
          setAdmissions(response.data);
          setShowSpinner(false);
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId, gangId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gangId]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruitmentId]);

  const tableColumns = [{ content: t(KEY.recruitment_applicant), sortable: true },
    { content: t(KEY.common_phonenumber), sortable: true },
    { content: t(KEY.common_email), sortable: true },
    { content: t(KEY.recruitment_position), sortable: true },
    { content: t(KEY.recruitment_interview_time), sortable: true },
    { content: t(KEY.recruitment_interview_location), sortable: true },
    { content: t(KEY.recruitment_recruiter_status), sortable: true },
  ];

  // TODO: Only show gangs that user has access to, and only show gangs that are recruiting
  
  const data = admissions.map(function (admission) {
    const admissionURL = 'todo';

    return [
      {
        content: (
          <Link url={admissionURL}>
            {admission.user.first_name} {admission.user.last_name}
          </Link>
        ),
      },
      admission.user.email,
      admission.user.phonenumber,
      { content: <Link url={admissionURL}>{dbT(admission.recruitment_position, 'name')}</Link> },
      admission.interview?.interview_time,
      admission.interview?.interview_location,
      admission.recruiter_status,
    ];
  });


  const title = t(KEY.recruitment_all_admissions);
  const header = (
    <div className={styles.header}>
      <Text as="strong" size="m" className={styles.headerBold}>
        {dbT(gang, 'name')} - {dbT(recruitment, 'name')}
      </Text>
      <Button theme="outlined" display="pill" onClick={() => alert('TODO add export to csv')}>
        {t(KEY.recrutment_export_to_csv)}
      </Button>
    </div>
  );

  return (
    <AdminPageLayout title={title} header={header} loading={showSpinner}>
      <Table columns={tableColumns} data={data} headerColumnClassName={styles.headerCol} cellClassName={styles.cellStyle} />
    </AdminPageLayout>
  );
}
