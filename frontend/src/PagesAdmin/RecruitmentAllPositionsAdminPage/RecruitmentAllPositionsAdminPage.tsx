import { useState } from 'react';
import { Table } from '~/Components';
import type { TableRow } from '~/Components/Table';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';

interface Application {
  applicant: string;
  interviewButton: string;
  datetime: string;
  positions: string[];
  teams: string[];
  sections: string[];
  priorities: string[];
  interviewerPriorities: string[];
  statuses: string[];
}

function calculatePositionSimilarity(app1: Application, app2: Application): number {
  const commonPositions = app1.positions.filter((pos) => app2.positions.includes(pos));
  return commonPositions.length;
}

function sortByPositionSimilarity(applications: Application[]): Application[] {
  const result: Application[] = [applications[0]];
  const remaining = applications.slice(1);

  while (remaining.length > 0) {
    const lastApp = result[result.length - 1];
    let maxSimilarity = -1;
    let mostSimilarIndex = 0;

    remaining.forEach((app, index) => {
      const similarity = calculatePositionSimilarity(lastApp, app);
      if (similarity > maxSimilarity) {
        maxSimilarity = similarity;
        mostSimilarIndex = index;
      }
    });

    result.push(remaining[mostSimilarIndex]);
    remaining.splice(mostSimilarIndex, 1);
  }

  return result;
}

export function RecruitmentAllPositionsAdminPage() {
  const [applications] = useState<Application[]>([
    {
      applicant: 'Søker 1',
      interviewButton: '[KNAPP]',
      datetime: '15.11.2024',
      positions: ['STILLING 1', 'STILLING 2', 'STILLING 3'],
      teams: ['SPP', 'STINT', 'SoME'],
      sections: ['Admin', 'PR', 'PR'],
      priorities: ['2/3', '1/3', '3/3'],
      interviewerPriorities: ['Vil ha', 'Vil ikke ha', 'Reserve'],
      statuses: ['[STATUS INPUT]', '[STATUS INPUT]', '[STATUS INPUT]'],
    },
    {
      applicant: 'Søker 2',
      interviewButton: '[KNAPP]',
      datetime: '16.11.2024',
      positions: ['STILLING 4', 'STILLING 1', 'STILLING 5'],
      teams: ['STINT', 'SPP', 'ITK'],
      sections: ['PR', 'Admin', 'Tech'],
      priorities: ['1/3', '2/3', '3/3'],
      interviewerPriorities: ['Reserve', 'Vil ha', 'Vil ikke ha'],
      statuses: ['[STATUS INPUT]', '[STATUS INPUT]', '[STATUS INPUT]'],
    },
    {
      applicant: 'Søker 3',
      interviewButton: '[KNAPP]',
      datetime: '15.11.2024',
      positions: ['STILLING 1', 'STILLING 2', 'STILLING 3'],
      teams: ['SoME', 'ITK', 'SPP'],
      sections: ['PR', 'Tech', 'Admin'],
      priorities: ['3/3', '1/3', '2/3'],
      interviewerPriorities: ['Vil ikke ha', 'Vil ha', 'Reserve'],
      statuses: ['[STATUS INPUT]', '[STATUS INPUT]', '[STATUS INPUT]'],
    },
  ]);

  const columns = [
    { content: 'Søker', sortable: false },
    { content: 'Sett intervju', sortable: false },
    { content: 'Tid og sted', sortable: false },
    { content: 'Søknad på stilling', sortable: false },
    { content: 'Gjeng', sortable: false },
    { content: 'Seksjon', sortable: false },
    { content: 'Søkers prioritet', sortable: false },
    { content: 'Intervjuers prioritet', sortable: false },
    { content: 'Sett status', sortable: false },
  ];

  const sortedApplications = sortByPositionSimilarity(applications);

  const tableData: TableRow[] = sortedApplications.map((app) => ({
    cells: [
      { value: app.applicant, content: app.applicant },
      { value: app.interviewButton, content: app.interviewButton },
      { value: app.datetime, content: app.datetime },
      {
        content: (
          <table>
            {app.positions.map((pos, i) => (
              <tr key={i}>
                <td>{pos}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table>
            {app.teams.map((team, i) => (
              <tr key={i}>
                <td>{team}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table>
            {app.sections.map((section, i) => (
              <tr key={i}>
                <td>{section}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table>
            {app.priorities.map((priority, i) => (
              <tr key={i}>
                <td>{priority}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table>
            {app.interviewerPriorities.map((priority, i) => (
              <tr key={i}>
                <td>{priority}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table>
            {app.statuses.map((status, i) => (
              <tr key={i}>
                <td>{status}</td>
              </tr>
            ))}
          </table>
        ),
      },
    ],
  }));

  return (
    <AdminPageLayout title="All Positions">
      <Table columns={columns} data={tableData} defaultSortColumn={-1} />
    </AdminPageLayout>
  );
}
