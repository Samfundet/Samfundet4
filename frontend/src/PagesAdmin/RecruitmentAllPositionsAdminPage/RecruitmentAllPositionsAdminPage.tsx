import { useState } from 'react';
import { Table } from '~/Components';
import type { TableRow } from '~/Components/Table';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

interface Position {
  id: string;
  name: string;
  gang: string;
  section: string;
  applicantPriority: string;
  interviewerPriority: string;
}

export function RecruitmentAllPositionsAdminPage() {
  const [positions] = useState<Position[]>([
    {
      id: '1',
      name: 'STILLING 1',
      gang: 'SPP',
      section: 'Admin',
      applicantPriority: '2/3',
      interviewerPriority: 'Vil ha',
    },
    {
      id: '2',
      name: 'STILLING 2',
      gang: 'STINT',
      section: 'PR',
      applicantPriority: '1/3',
      interviewerPriority: 'Vil ikke ha',
    },
  ]);

  const columns = [
    { content: 'Position', sortable: true },
    { content: 'Gang', sortable: true },
    { content: 'Section', sortable: true },
    { content: 'Applicant Priority', sortable: true },
    { content: 'Interviewer Priority', sortable: true },
  ];

  const tableData: TableRow[] = positions.map((pos) => ({
    cells: [
      { value: pos.name, content: pos.name },
      { value: pos.gang, content: pos.gang },
      { value: pos.section, content: pos.section },
      { value: pos.applicantPriority, content: pos.applicantPriority },
      { value: pos.interviewerPriority, content: pos.interviewerPriority },
    ],
  }));

  return (
    <AdminPageLayout title="All Positions">
      <Table columns={columns} data={tableData} defaultSortColumn={0} />
    </AdminPageLayout>
  );
}
