import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ExpandableHeader } from '~/Components';
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

  const headerLabel = (user: RecruitmentApplicationDto['user']) => {
    return (
      <div className={styles.header_label}>
        <div>
          {user.first_name} {user.last_name}
        </div>
        <Button onClick={() => console.log('click')}>TEst</Button>
      </div>
    );
  };

  // Render one ExpandableHeader per user
  const applicantList = groupedData.map(({ user, applications }) => (
    <ExpandableHeader
      key={user.id}
      showByDefault={true}
      label={headerLabel(user)}
      className={styles.user_header}
      theme="child"
    >
      {/*Show each application inside the ExpandableHeader body */}
      <div className={styles.applications_container}>
        {applications.map((app) => (
          <div key={app.id} className={styles.application_row}>
            <div>Position: {app.recruitment_position.name_nb}</div>
            <div>Priority: {app.applicant_priority}</div>
          </div>
        ))}
      </div>
    </ExpandableHeader>
  ));

  return <AdminPageLayout title="All Positions">{applicantList}</AdminPageLayout>;
}
