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
    const newAdmissions = [...admissions];
    const index = newAdmissions.findIndex((admission) => admission.id === id);
    const directionIncrement = direction === 'up' ? -1 : 1;
    if (newAdmissions[index].applicant_priority === 1 && direction === 'up') return;
    if (newAdmissions[index].applicant_priority === newAdmissions.length && direction === 'down') return;
    const targetIndex = newAdmissions.findIndex(
      (admission) => admission.applicant_priority === newAdmissions[index].applicant_priority + directionIncrement,
    );

    const old_priority = newAdmissions[index].applicant_priority;
    const new_priority = newAdmissions[targetIndex].applicant_priority;

    console.log('old priority', old_priority);
    console.log('new priority', new_priority);

    newAdmissions[index].applicant_priority = new_priority;
    newAdmissions[targetIndex].applicant_priority = old_priority;

    // TODO: Make this a single API call
    putRecruitmentAdmission(newAdmissions[index]);
    putRecruitmentAdmission(newAdmissions[targetIndex]).then(() => {
      setAdmissions(newAdmissions);
    });
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
    { sortable: true, content: 'Applicant Priority' },
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
