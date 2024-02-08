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
import { dbT, niceDateTime } from '~/utils';
import styles from './ApplicantApplicationOverviewPage.module.scss';
import { OccupiedFormModal } from '~/Components/OccupiedForm';

export function ApplicantApplicationOverviewPage() {
  const { recruitmentID } = useParams();
  const [admissions, setAdmissions] = useState<RecruitmentAdmissionDto[]>([]);
  const { t } = useTranslation();

  function handleChangePriority(id: number, direction: 'up' | 'down') {
    const newAdmissions = [
      ...admissions.sort(function (a1, a2) {
        return a1.applicant_priority - a2.applicant_priority;
      }),
    ];
    const index = newAdmissions.findIndex((admission) => admission.id === id);
    const directionIncrement = direction === 'up' ? -1 : 1;
    if (index == 0 && direction === 'up') return;
    if (index === newAdmissions.length - 1 && direction === 'down') return;

    const old_priority = newAdmissions[index].applicant_priority;
    const new_priority = newAdmissions[index + directionIncrement].applicant_priority;

    newAdmissions[index].applicant_priority = new_priority;
    newAdmissions[index + directionIncrement].applicant_priority = old_priority;

    // TODO: Make this a single API call
    putRecruitmentAdmission(newAdmissions[index]);
    putRecruitmentAdmission(newAdmissions[index + directionIncrement]).then(() => {
      setAdmissions(newAdmissions);
    });
  }

  function upDownArrow(id: number) {
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
    { sortable: false, content: 'Recruitment Position' },
    { sortable: false, content: 'Interview Date' },
    { sortable: false, content: 'Interview Location' },
    { sortable: true, content: 'Applicant Priority' },
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
          <h1 className={styles.header}>My applications</h1>
          <div className={styles.empty_div}></div>
        </div>
        <p>All info related to the applications will be anonymized three weeks after the recruitment is over</p>
        {admissions ? (
          <Table data={admissions.map(admissionToTableRow)} columns={tableColumns} defaultSortColumn={3}></Table>
        ) : (
          <p>You have not applied to any positions yet</p>
        )}

        <OccupiedFormModal recruitmentId={parseInt(recruitmentID ?? '')} />
      </div>
    </Page>
  );
}
