import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, ExpandableHeader, Table, ToggleSwitch } from '~/Components';
import { getAllRecruitmentApplications, getRecruitment } from '~/api';
import type { RecruitmentApplicationDto, RecruitmentDto } from '~/dto';
import { RecruitmentStatusChoicesMapping } from '~/types';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentAllPositionsAdminPage.module.scss';

type GroupedDataItem = {
  user: RecruitmentApplicationDto['user'];
  applications: RecruitmentApplicationDto[];
};

export function RecruitmentAllPositionsAdminPage() {
  const [recruitmentApplications, setRecruitmentApplications] = useState<RecruitmentApplicationDto[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const { recruitmentId } = useParams();

  useEffect(() => {
    if (recruitmentId) {
      getRecruitment(recruitmentId)
        .then((response) => {
          setRecruitment(response.data);
        })
        .catch(console.error);

      getAllRecruitmentApplications(recruitmentId)
        .then((response) => {
          setRecruitmentApplications(response.data);
        })
        .catch(console.error);
    }
  }, [recruitmentId]);

  // 1) Group applications by user
  const groupedByUser = recruitmentApplications.reduce<Record<string, GroupedDataItem>>((acc, application) => {
    const userId = application.user.id;
    if (!acc[userId]) {
      acc[userId] = { user: application.user, applications: [] };
    }
    acc[userId].applications.push(application);
    return acc;
  }, {});

  // 2) Convert to an array
  let groupedData = Object.values(groupedByUser);

  // 3) Reorder that array by overlap
  groupedData = reorderApplicantsByOverlap(groupedData);

  // Table columns, row building, etc.
  const tableColumns = [
    { content: 'Gang', sortable: false },
    { content: 'Position', sortable: false },
    { content: 'Interview location', sortable: false },
    { content: 'Interview time', sortable: false },
    { content: 'Priority', sortable: false },
    { content: 'Føring', sortable: false },
    { content: 'Status', sortable: false },
  ];

  const applicationsToTableRows = (applications: RecruitmentApplicationDto[]) =>
    applications.map((app) => ({
      cells: [
        {
          value: app.recruitment_position.gang.abbreviation,
          content: <strong>{app.recruitment_position.gang.abbreviation ?? 'N/A'}</strong>,
        },
        {
          value: app.recruitment_position.name_nb,
          content: <span>{app.recruitment_position.name_nb}</span>,
        },
        {
          value: app.interview?.interview_location,
          content: <span>{app.interview?.interview_location ?? 'N/A'}</span>,
        },
        {
          value: app.interview?.interview_time,
          content: <span>{app.interview?.interview_time ?? 'N/A'}</span>,
        },
        {
          value: app.applicant_priority,
          content: <span>{app.applicant_priority}</span>,
        },
        {
          value: 'Føring',
          content: (
            <span>
              Tillat å gi tilbud <ToggleSwitch />
            </span>
          ),
        },
        {
          value: app.recruiter_status,
          content: <span>{RecruitmentStatusChoicesMapping[app.recruiter_status]}</span>,
        },
      ],
    }));

  // Render ExpandableHeader
  const applicantList = groupedData.map(({ user, applications }) => {
    const tableData = applicationsToTableRows(applications);

    return (
      <ExpandableHeader
        key={user.id}
        showByDefault={true}
        label={
          <div className={styles.header_label}>
            <div>
              {user.first_name} {user.last_name}
            </div>
            <div>{user.email}</div>
            <div>{user.phone_number || 'N/A'}</div>
            {recruitment?.organization.name !== 'Samfundet' && (
              <Button
                theme="blue"
                onClick={() =>
                  alert('Add interview modal + conditionaly render based on UKA/ISFiT/KSG --> must use perms for this')
                }
              >
                Set interview
              </Button>
            )}
          </div>
        }
        className={styles.expandable_header}
        theme="child"
      >
        <Table columns={tableColumns} data={tableData} defaultSortColumn={1} />
      </ExpandableHeader>
    );
  });

  return (
    <AdminPageLayout
      title={`All positions for ${recruitment?.name_en} at ${recruitment?.organization.name}`}
      header={
        <Button theme={'green'} onClick={() => alert('TODO: add automatic interview distribution')}>
          Set all interviews
        </Button>
      }
    >
      {applicantList}
    </AdminPageLayout>
  );
}

/** =====================
 * Helper Functions
 * =====================
 **/

function buildPositionSets(groupedData: GroupedDataItem[]) {
  return groupedData.map((item) => ({
    ...item,
    positionSet: new Set(item.applications.map((app) => app.recruitment_position.id)),
  }));
}

function overlap(setA: Set<number>, setB: Set<number>): number {
  // Intersection count
  const [smaller, bigger] = setA.size < setB.size ? [setA, setB] : [setB, setA];
  let count = 0;
  for (const pos of smaller) {
    if (bigger.has(pos)) count++;
  }
  return count;
}

function reorderApplicantsByOverlap(groupedData: GroupedDataItem[]): GroupedDataItem[] {
  if (groupedData.length <= 1) return groupedData;

  const withSets = buildPositionSets(groupedData);

  // Pick an initial user.
  const sorted: typeof withSets = [];
  let maxIndex = 0;
  let maxSize = 0;
  for (let i = 0; i < withSets.length; i++) {
    const size = withSets[i].positionSet.size;
    if (size > maxSize) {
      maxSize = size;
      maxIndex = i;
    }
  }
  sorted.push(withSets[maxIndex]);
  withSets.splice(maxIndex, 1);

  // Greedily pick next user with the maximum overlap with the last user in `sorted`
  while (withSets.length > 0) {
    const last = sorted[sorted.length - 1];
    let bestIndex = 0;
    let bestOverlap = -1;
    for (let i = 0; i < withSets.length; i++) {
      const o = overlap(last.positionSet, withSets[i].positionSet);
      if (o > bestOverlap) {
        bestOverlap = o;
        bestIndex = i;
      }
    }
    sorted.push(withSets[bestIndex]);
    withSets.splice(bestIndex, 1);
  }

  // Remove positionSet before returning
  return sorted.map((item) => {
    const { positionSet, ...rest } = item;
    return rest;
  });
}
