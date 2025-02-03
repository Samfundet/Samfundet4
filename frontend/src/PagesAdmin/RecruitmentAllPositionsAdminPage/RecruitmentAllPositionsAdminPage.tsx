import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Link, Table, ToggleSwitch } from '~/Components';
import { getAllRecruitmentApplications, getRecruitment, getRecruitmentGangs } from '~/api';
import type { GangDto, RecruitmentApplicationDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { applicationKeys, recruitmentGangKeys, recruitmentKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { RecruitmentStatusChoicesMapping } from '~/types';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { AllApplicantsFilterBar, AllApplicationsExpandableHeader, type FilterType } from './components';

interface GroupedDataItem {
  user: RecruitmentApplicationDto['user'];
  applications: RecruitmentApplicationDto[];
}

interface GangMapping {
  [key: number]: {
    name_en: string;
    name_nb: string;
    abbreviation: string;
  };
}

const browserTabTitle = 'All applicants';

export function RecruitmentAllPositionsAdminPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { recruitmentId } = useParams();
  const { t } = useTranslation();

  useTitle(browserTabTitle);

  const handleFilterChange = (filterType: FilterType) => {
    setActiveFilter(filterType);
    alert(`Filter changed to: ${filterType} MUST BE IMPLEMENTED`);
  };

  const handleSearchChange = () => {
    setSearchTerm('SearchTerm');
    alert('MUST BE IMPLEMENTED');
  };

  const handleSetInterviewsForApplicant = () => {
    alert('IMPLEMENT ABILITY TO SET MULTIPLE INTERVIEWS FOR A SINGLE APPLICANT');
  };

  const handleAllowCall = () => {
    alert('IMPLEMENT CONTACT CONTROL FUNCTIONALITY');
  };

  const { data: recruitment, isLoading: isLoadingRecruitment } = useQuery({
    queryKey: recruitmentKeys.all,
    queryFn: () => {
      if (!recruitmentId) {
        throw new Error('Recruitment ID is required');
      }
      return getRecruitment(recruitmentId);
    },
    enabled: Boolean(recruitmentId),
  });

  const { data: recruitmentApplications, isLoading: isLoadingApplications } = useQuery({
    queryKey: applicationKeys.all,
    queryFn: () => {
      if (!recruitmentId) {
        throw new Error('Recruitment ID is required');
      }
      return getAllRecruitmentApplications(recruitmentId);
    },
    enabled: Boolean(recruitmentId),
  });

  const { data: recruitmentGangs, isLoading: isLoadingRecruitmentGangs } = useQuery({
    queryKey: recruitmentGangKeys.all,
    queryFn: () => {
      if (!recruitmentId) {
        throw new Error('Recruitment ID is required');
      }
      return getRecruitmentGangs(recruitmentId);
    },
    enabled: Boolean(recruitmentId),
  });

  const gangMapping = createGangMapping(recruitmentGangs);

  // 1) Group applications by user
  const groupedByUser = recruitmentApplications?.data.reduce<Record<string, GroupedDataItem>>((acc, application) => {
    const userId = application.user.id;
    if (!acc[userId]) {
      acc[userId] = { user: application.user, applications: [] };
    }
    acc[userId].applications.push(application);
    return acc;
  }, {});

  let groupedData: GroupedDataItem[] = [];
  if (groupedByUser) {
    // 2) Convert to an array
    groupedData = Object.values(groupedByUser);

    // 3) Reorder that array by overlap
    groupedData = reorderApplicantsByOverlap(groupedData);
  }

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

  const applicationsToTableRows = (applications: RecruitmentApplicationDto[]) =>
    applications.map((app) => {
      const gangId = app.recruitment_position.gang as unknown as number; // in this case "gang" in the object is the gangId, not the gang object
      const gangDetails = gangMapping?.[gangId];

      const positionPageUrl = reverse({
        pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
        urlParams: { recruitmentId: recruitmentId, gangId: gangId, positionId: app.recruitment_position.id },
      });

      return {
        cells: [
          {
            value: gangDetails?.abbreviation || gangDetails?.name_en || 'N/A',
            content: <strong>{gangDetails?.abbreviation || gangDetails?.name_en || 'N/A'}</strong>,
          },
          {
            value: app.recruitment_position.name_nb,
            content: <Link url={positionPageUrl}>{app.recruitment_position.name_nb}</Link>,
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
            content: <ToggleSwitch onChange={() => handleAllowCall()} />,
          },
          {
            value: app.recruiter_status,
            content: app.recruiter_status ? (
              <span>{RecruitmentStatusChoicesMapping[app.recruiter_status]}</span>
            ) : (
              'N/A'
            ),
          },
        ],
      };
    });

  // Render applicant list only if recruitment exists
  const applicantList = recruitment
    ? groupedData.map(({ user, applications }) => {
        if (!user) return null;

        const tableData = applicationsToTableRows(applications);

        return (
          <AllApplicationsExpandableHeader
            recruitment={recruitment.data}
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
      title={`${recruitment?.data.name_en} ${t(KEY.common_at)} ${recruitment?.data.organization.name}`}
      header={pageHeader}
      loading={isLoadingRecruitment}
    >
      <AllApplicantsFilterBar onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} />
      {applicantList}
    </AdminPageLayout>
  );
}

/** =====================
 * Helper functions for sorting applicants on the client
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

/**
 * Helper function for mapping gang.....
 */

const createGangMapping = (gangs: GangDto[] | undefined): GangMapping => {
  return (
    gangs?.reduce<GangMapping>((acc, gang) => {
      acc[gang.id] = {
        name_en: gang.name_en,
        name_nb: gang.name_nb,
        abbreviation: gang.abbreviation,
      };
      return acc;
    }, {}) ?? {}
  );
};
