import { Icon } from '@iconify/react';
import { type ReactNode, useEffect, useState } from 'react';
import { Button, Dropdown, Modal, Table } from '~/Components';
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { MultiSelect } from '~/Components/MultiSelect';
import type { TableRow } from '~/Components/Table';
import { getAllRecruitmentApplications } from '~/api';
import type { RecruitmentApplicationDto } from '~/dto';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentAllPositionsAdminPage.module.scss';
interface AllApplicationsData {
  applicant: string;
  setInterviewButton: ReactNode;
  datetime: string;
  positions: string[];
  gangs: string[];
  sections: string[];
  priorities: string[];
  interviewerPriorities: string[];
  statuses: ReactNode[];
}

function calculatePositionSimilarity(app1: AllApplicationsData, app2: AllApplicationsData): number {
  const commonPositions = app1.positions.filter((pos) => app2.positions.includes(pos));
  return commonPositions.length;
}

function sortByPositionSimilarity(applications: AllApplicationsData[]): AllApplicationsData[] {
  if (!applications.length) return [];

  const result: AllApplicationsData[] = [applications[0]];
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
const statusOptions: DropdownOption<number>[] = [
  { label: 'Nothing', value: 0 },
  { label: 'Called and accepted', value: 1 },
  { label: 'Called and rejected', value: 2 },
  { label: 'Automatic rejection', value: 3 },
];
export function RecruitmentAllPositionsAdminPage() {
  // http://localhost:3000/control-panel/recruitment/:recruitmentId/all-positions/
  const [recruitmentApplications, setRecruitmentApplications] = useState<AllApplicationsData[]>([]);
  const [open, setOpen] = useState(false);
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
                setInterviewButton: (
                  // <SetInterviewManuallyModal
                  //   recruitmentId={Number(app.recruitment) || 0}
                  //   isButtonRounded={false}
                  //   application={acc}
                  //   onSetInterview={onInterviewChange}
                  // />¨
                  <Button
                    theme={'samf'}
                    onClick={() =>
                      alert(
                        'ADD ABILITY TO SET INTERVIEWS IN BULK FOR MULTIPLE POSITIONS WITH SetInterviewManuallyModal',
                      )
                    }
                  >
                    **PLACEHOLDER** SETT INTERVJU FOR ALLE SØKNADER
                  </Button>
                ),
                datetime: 'Ikke satt',
                positions: [],
                gangs: [],
                sections: [],
                priorities: [],
                interviewerPriorities: [],
                statuses: [],
              };
            }
            acc[userId].positions.push(app.recruitment_position.name_nb);
            acc[userId].gangs.push(app.recruitment_position.gang?.toString() || 'N/A');
            acc[userId].sections.push('N/A');
            acc[userId].priorities.push(`${app.applicant_priority}`);
            acc[userId].interviewerPriorities.push(app.recruiter_priority ? `${app.recruiter_priority}` : 'Not set');
            acc[userId].statuses.push(<Dropdown value={-1} options={statusOptions} />);

            return acc;
          },
          {} as Record<number, AllApplicationsData>,
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
      { value: app.setInterviewButton, content: app.setInterviewButton },
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
            {app.gangs.map((team, i) => (
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

  const handleFilterSimilar = () => {
    alert('IMPLEMENT FILTER APPLICANTS ON SIMILAR POSITIONS');
  };

  const handleSetInterviewsForAllApplicants = () => {
    alert('IMPLEMENT ABILITY TO AUTOMATICALLY SET INTERVIEWS FOR ALL APPLICANTS');
  };

  return (
    <AdminPageLayout title="All Positions">
      <div className={styles.filerControlContainer}>
        <Button theme="outlined" onClick={handleFilterSimilar}>
          **PLACEHOLDER**Sort by similar positions
        </Button>
        <Button theme="outlined" onClick={() => setOpen(true)}>
          **PLACEHOLDER**Filter by sections
        </Button>
        <Button theme="outlined" onClick={() => setOpen(true)}>
          **PLACEHOLDER**Filter by gangs
        </Button>
        <Button
          theme="samf"
          onClick={() => {
            handleSetInterviewsForAllApplicants;
          }}
        >
          **PLACEHOLDER** Set interviews for all applicants
        </Button>
      </div>
      <Table className={styles.parentTable} columns={columns} data={tableData} defaultSortColumn={-1} />
      <Modal isOpen={open}>
        {/* conditionaly fetch sections or gangs, by which button was pressed? */}
        <button type="button" className={styles.close_btn} title="Close" onClick={() => setOpen(false)}>
          <Icon icon="octicon:x-24" width={24} />
        </button>
        <MultiSelect />
      </Modal>
    </AdminPageLayout>
  );
}
