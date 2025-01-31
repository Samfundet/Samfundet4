import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ExpandableHeader, Table } from '~/Components';
import { getAllRecruitmentApplications } from '~/api';
import type { RecruitmentApplicationDto } from '~/dto';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentAllPositionsAdminPage.module.scss';

export function RecruitmentAllPositionsAdminPage() {
  const [recruitmentApplications, setRecruitmentApplications] = useState<RecruitmentApplicationDto[]>([]);
  const { recruitmentId } = useParams();

  useEffect(() => {
    if (recruitmentId) {
      getAllRecruitmentApplications(recruitmentId)
        .then((response) => {
          // If your DRF is paginated, you might need `response.data.results` instead of `response.data`
          setRecruitmentApplications(response.data);
        })
        .catch(console.error);
    }
  }, [recruitmentId]);

  // Group applications by user
  const groupedByUser = recruitmentApplications.reduce(
    (acc, application) => {
      const userId = application.user.id; // or some unique user identifier
      if (!acc[userId]) {
        acc[userId] = {
          user: application.user,
          applications: [],
        };
      }
      acc[userId].applications.push(application);
      return acc;
    },
    {} as Record<string, { user: RecruitmentApplicationDto['user']; applications: RecruitmentApplicationDto[] }>,
  );

  // Convert the object into an array to map over
  const groupedData = Object.values(groupedByUser);

  //  Define the columns for your Table
  const tableColumns = [
    { content: 'Position', sortable: false },
    { content: 'Priority', sortable: true },
  ];

  // A helper function to build the rows for each user's table
  const applicationsToTableRows = (applications: RecruitmentApplicationDto[]) =>
    applications.map((app) => {
      return {
        cells: [
          {
            value: app.recruitment_position.name_nb,
            content: <strong>{app.recruitment_position.name_nb}</strong>,
          },
          {
            value: app.applicant_priority,
            content: <span>{app.applicant_priority}</span>,
          },
        ],
      };
    });

  const headerLabel = (user: RecruitmentApplicationDto['user']) => {
    return (
      <div className={styles.header_label}>
        <div>
          {user.first_name} {user.last_name}
        </div>
        <Button theme="blue" onClick={() => console.log('click')}>
          Set interview
        </Button>
      </div>
    );
  };

  // Render one ExpandableHeader per user
  const applicantList = groupedData.map(({ user, applications }) => {
    // Build the table data for this user
    const tableData = applicationsToTableRows(applications);

    return (
      <ExpandableHeader
        key={user.id}
        showByDefault={true}
        label={headerLabel(user)}
        className={styles.expandable_header}
        theme="child"
      >
        <Table columns={tableColumns} data={tableData} defaultSortColumn={1} />
      </ExpandableHeader>
    );
  });

  return <AdminPageLayout title="All Positions">{applicantList}</AdminPageLayout>;
}
