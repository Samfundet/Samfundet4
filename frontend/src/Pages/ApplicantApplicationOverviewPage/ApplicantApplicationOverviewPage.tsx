import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table } from '~/Components/Table';
import { getRecruitmentAdmissionsForApplicant } from '~/api';
import { RecruitmentAdmissionDto } from '~/dto';

export function ApplicantApplicationOverviewPage() {
  const { recruitmentID } = useParams();
  const [admissions, setAdmissions] = useState<RecruitmentAdmissionDto[]>([]);

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
    { sortable: true, content: 'Recruitment Position' },
    { sortable: true, content: 'Interview Date' },
    { sortable: true, content: 'Interview Location' },
    { sortable: true, content: 'Applicant Priority' },
  ];

  function admissionToTableRow(admission: RecruitmentAdmissionDto) {
    return [
      admission.recruitment_position,
      admission.interview.interview_time,
      admission.interview.interview_location,
      admission.applicant_priority,
    ];
  }

  return <Table data={admissions.map(admissionToTableRow)} columns={tableColumns}></Table>;
}
