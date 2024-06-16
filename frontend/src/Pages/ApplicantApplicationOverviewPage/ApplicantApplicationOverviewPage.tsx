import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Page } from '~/Components';
import { Table } from '~/Components/Table';
import { getRecruitmentAdmissionsForApplicant, putRecruitmentPriorityForUser } from '~/api';
import { RecruitmentAdmissionDto, UserPriorityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT, niceDateTime } from '~/utils';
import styles from './ApplicantApplicationOverviewPage.module.scss';
import { OccupiedFormModal } from '~/Components/OccupiedForm';

export function ApplicantApplicationOverviewPage() {
  const { recruitmentID } = useParams();
  const [admissions, setAdmissions] = useState<RecruitmentAdmissionDto[]>([]);
  const { t } = useTranslation();

  function handleChangePriority(id: string, direction: 'up' | 'down') {
    const data: UserPriorityDto = { direction: direction === 'up' ? 1 : -1 };
    putRecruitmentPriorityForUser(id, data).then((response) => {
      setAdmissions(response.data);
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
    if (recruitmentID) {
      getRecruitmentAdmissionsForApplicant(recruitmentID).then((response) => {
        setAdmissions(response.data);
      });
    }
  }, [recruitmentID]);

  useEffect(() => {
    console.log(admissions);
  }, [admissions]);

  const tableColumns = [
    { sortable: false, content: t(KEY.recruitment_position) },
    { sortable: false, content: t(KEY.recruitment_interview_time) },
    { sortable: false, content: t(KEY.recruitment_interview_location) },
    { sortable: true, content: t(KEY.recruitment_priority) },
    { sortable: false, content: '' },
  ];

  function admissionToTableRow(admission: RecruitmentAdmissionDto) {
    return [
      dbT(admission.recruitment_position, 'name'),
      niceDateTime(admission.interview.interview_time),
      admission.interview.interview_location,
      admission.applicant_priority,
      { content: upDownArrow(admission.id) },
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
          <div className={styles.empty_div}></div>
        </div>
        <p>{t(KEY.recruitment_will_be_anonymized)}</p>
        {admissions ? (
          <Table data={admissions.map(admissionToTableRow)} columns={tableColumns} defaultSortColumn={3}></Table>
        ) : (
          <p>{t(KEY.recruitment_not_applied)}</p>
        )}

        <OccupiedFormModal recruitmentId={parseInt(recruitmentID ?? '')} />
      </div>
    </Page>
  );
}
