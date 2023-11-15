import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Page } from '~/Components';
import { Table } from '~/Components/Table';
import { getRecruitmentAdmissionsForApplicant, putRecruitmentAdmission } from '~/api';
import { RecruitmentAdmissionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { dbT } from '~/utils';
import styles from './ApplicantApplicationOverviewPage.module.scss';

export function ApplicantApplicationOverviewPage() {
  const { recruitmentID } = useParams();
  const [admissions, setAdmissions] = useState<RecruitmentAdmissionDto[]>([]);
  const { t } = useTranslation();

  function handleChangePriority(id: number, direction: 'up' | 'down') {
    const index = admissions.findIndex((admission) => admission.id === id);
    if (index < 0) return; // ID not found

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= admissions.length) return;

    const newAdmissions = [...admissions];
    const temp = newAdmissions[index].applicant_priority;

    // Swap priorities
    newAdmissions[index].applicant_priority = newAdmissions[targetIndex].applicant_priority;
    newAdmissions[targetIndex].applicant_priority = temp;

    // Update database
    putRecruitmentAdmission(newAdmissions[index]);
    putRecruitmentAdmission(newAdmissions[targetIndex]);
    setAdmissions(newAdmissions);
  }

  function upDownArrow(id: number) {
    return (
      <>
        <Icon icon="bxs:up-arrow" onClick={() => handleChangePriority(id, 'up')} />
        <Icon icon="bxs:down-arrow" onClick={() => handleChangePriority(id, 'down')} />
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
    { sortable: false, content: 'Recruitment Position' },
    { sortable: false, content: 'Interview Date' },
    { sortable: false, content: 'Interview Location' },
    { sortable: false, content: 'Applicant Priority' },
    { sortable: false, content: '' },
  ];

  function admissionToTableRow(admission: RecruitmentAdmissionDto) {
    return [
      dbT(admission.recruitment_position, 'name'),
      admission.interview.interview_time,
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
          <h1 className={styles.header}>My applications</h1>
          <div className={styles.empty_div}></div>
        </div>
        <p>All info related to the applications will be anonymized three weeks after the recruitment is over</p>
        {admissions ? (
          <Table data={admissions.map(admissionToTableRow)} columns={tableColumns} defaultSortColumn={3}></Table>
        ) : (
          <p>You have not applied to any positions yet</p>
        )}
      </div>
    </Page>
  );
}
