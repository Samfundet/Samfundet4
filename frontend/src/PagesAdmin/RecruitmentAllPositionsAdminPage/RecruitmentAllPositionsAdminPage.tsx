import { useEffect, useState } from 'react';
import { Table } from '~/Components';
import type { TableRow } from '~/Components/Table';
import { getAllRecruitmentApplications } from '~/api';
import type { RecruitmentApplicationDto } from '~/dto';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentAllPositionsAdminPage.module.scss';
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
  if (!applications.length) return [];

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
  const [recruitmentApplications, setRecruitmentApplications] = useState<Application[]>([]);

  useEffect(() => {
    getAllRecruitmentApplications('37')
      .then((response: RecruitmentApplicationDto[]) => {
        // Group applications by user
        const userApplications = response.reduce(
          (acc, app) => {
            const userId = app.user.id;
            if (!acc[userId]) {
              acc[userId] = {
                applicant: `${app.user.first_name} ${app.user.last_name}`.trim() || app.user.email,
                interviewButton: '[KNAPP]',
                datetime: 'TBD',
                positions: [],
                teams: [],
                sections: [],
                priorities: [],
                interviewerPriorities: [],
                statuses: [],
              };
            }
            acc[userId].positions.push(app.recruitment_position.name_nb);
            acc[userId].teams.push(app.recruitment_position.gang?.toString() || 'N/A');
            acc[userId].sections.push('N/A');
            acc[userId].priorities.push(`${app.applicant_priority}/5`);
            acc[userId].interviewerPriorities.push(app.recruiter_priority ? `${app.recruiter_priority}/5` : 'Not set');
            acc[userId].statuses.push(app.recruiter_status ? app.recruiter_status.toString() : '[STATUS INPUT]');

            return acc;
          },
          {} as Record<number, Application>,
        );

        setRecruitmentApplications(Object.values(userApplications));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

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

  const sortedApplications = sortByPositionSimilarity(recruitmentApplications);

  const tableData: TableRow[] = sortedApplications.map((app) => ({
    cells: [
      { value: app.applicant, content: app.applicant },
      { value: app.interviewButton, content: app.interviewButton },
      { value: app.datetime, content: app.datetime },
      {
        content: (
          <table className={styles.childTable}>
            {app.positions.map((pos, i) => (
              <tr key={i} className={styles.childTableRow}>
                <td className={styles.childTableData}>{pos}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table className={styles.childTable}>
            {app.teams.map((team, i) => (
              <tr key={i} className={styles.childTableRow}>
                <td className={styles.childTableData}>{team}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table className={styles.childTable}>
            {app.sections.map((section, i) => (
              <tr key={i} className={styles.childTableRow}>
                <td className={styles.childTableData}>{section}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table className={styles.childTable}>
            {app.priorities.map((priority, i) => (
              <tr key={i} className={styles.childTableRow}>
                <td className={styles.childTableData}>{priority}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table className={styles.childTable}>
            {app.interviewerPriorities.map((priority, i) => (
              <tr key={i} className={styles.childTableRow}>
                <td className={styles.childTableData}>{priority}</td>
              </tr>
            ))}
          </table>
        ),
      },
      {
        content: (
          <table className={styles.childTable}>
            {app.statuses.map((status, i) => (
              <tr key={i} className={styles.childTableRow}>
                <td className={styles.childTableData}>{status}</td>
              </tr>
            ))}
          </table>
        ),
      },
    ],
  }));

  return (
    <AdminPageLayout title="All Positions">
      <Table className={styles.parentTable} columns={columns} data={tableData} defaultSortColumn={-1} />
    </AdminPageLayout>
  );
}
