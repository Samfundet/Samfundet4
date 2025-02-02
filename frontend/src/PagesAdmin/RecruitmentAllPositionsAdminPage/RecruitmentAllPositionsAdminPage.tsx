import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Table, ToggleSwitch } from '~/Components';
import { getAllRecruitmentApplications, getRecruitment } from '~/api';
import type { RecruitmentApplicationDto, RecruitmentDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { RecruitmentStatusChoicesMapping } from '~/types';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { AllApplicantsFilterBar } from './components/AllApplicantsFilterBar';
import { AllApplicationsExpandableHeader } from './components/AllApplicationsExpandableHeader';

type GroupedDataItem = {
  user: RecruitmentApplicationDto['user'];
  applications: RecruitmentApplicationDto[];
};

export function RecruitmentAllPositionsAdminPage() {
  const [recruitmentApplications, setRecruitmentApplications] = useState<RecruitmentApplicationDto[]>([]);
  const [recruitment, setRecruitment] = useState<RecruitmentDto>();
  const { recruitmentId } = useParams();
  const { t } = useTranslation();

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
    { content: t(KEY.common_gang), sortable: false },
    { content: t(KEY.common_recruitmentposition), sortable: false },
    { content: t(KEY.recruitment_interview_location), sortable: false },
    { content: t(KEY.recruitment_interview_time), sortable: false },
    { content: t(KEY.recruitment_priority), sortable: false },
    { content: t(KEY.recruitment_allow_to_contact), sortable: false },
    { content: t(KEY.recruitment_recruiter_status), sortable: false },
  ];

  const handleAllowCall = (application: RecruitmentApplicationDto) => {
    alert('IMPLEMENT CONTACT CONTROL FUNCTIONALITY');
  };

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
          value: 'Allow to contact',
          content: <ToggleSwitch onChange={() => handleAllowCall(app)} />,
        },
        {
          value: app.recruiter_status,
          content: <span>{RecruitmentStatusChoicesMapping[app.recruiter_status]}</span>,
        },
      ],
    }));

  const handleSetInterviewsForApplicant = () => {
    alert('IMPLEMENT ABILITY TO SET MULTIPLE INTERVIEWS FOR A SINGLE APPLICANT');
  };

  // Render applicant list only if recruitment exists
  const applicantList = recruitment
    ? groupedData.map(({ user, applications }) => {
        if (!user) return null;

        const tableData = applicationsToTableRows(applications);

        return (
          <AllApplicationsExpandableHeader
            recruitment={recruitment}
            user={user}
            key={user.id}
            table={<Table columns={tableColumns} data={tableData} defaultSortColumn={1} />}
            onSetInterviewClick={handleSetInterviewsForApplicant}
          />
        );
      })
    : null;

  const pageHeader = (
    <Button theme={'green'} onClick={() => alert('TODO: add automatic interview distribution')}>
      {t(KEY.recruitment_interview_set_all)}
    </Button>
  );

  return (
    <AdminPageLayout
      title={`${recruitment?.name_en} ${t(KEY.common_at)} ${recruitment?.organization.name}`}
      header={pageHeader}
    >
      <AllApplicantsFilterBar />
      {applicantList}
    </AdminPageLayout>
  );
}

/** =====================
 * Helper Functions for sorting applications
 * =====================
 **/

function buildPositionSets(groupedData: GroupedDataItem[]) {
  return groupedData.map((item) => ({
    ...item,
    positionSet: new Set(item.applications.map((app) => app.recruitment_position.id)),
  }));
}

function overlap(setA: Set<number>, setB: Set<number>): number {
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

  // Pick an initial user
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
