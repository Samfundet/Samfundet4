import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Link, Table, ToggleSwitch } from '~/Components';
import { getAllRecruitmentApplications, getRecruitment, getRecruitmentGangs } from '~/api';
import type { GangDto, RecruitmentApplicationDto, UserDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { applicationKeys, recruitmentGangKeys, recruitmentKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { RecruitmentStatusChoicesMapping } from '~/types';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { AllApplicantsFilterBar, AllApplicationsExpandableHeader, type FilterType } from './components';

// Interface for the grouped data received from the backend
interface GroupedDataItem {
  user: UserDto;
  applications: RecruitmentApplicationDto[];
}

// Interface for the API response from the backend
interface GroupedApplicationsResponse {
  data: GroupedDataItem[];
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

  // Getting the grouped applications data from the API
  const { data: groupedApplicationsResponse, isLoading: isLoadingApplications } = useQuery<GroupedApplicationsResponse>({
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

  // Table columns definition
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
      const gangId = app.recruitment_position.gang as unknown as number;
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

  // Render applicant list using the grouped data from the backend
  const applicantList = 
    recruitment && groupedApplicationsResponse
      ? groupedApplicationsResponse.data.map((group: GroupedDataItem) => {
          const { user, applications } = group;
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

  // Display loading state when fetching data
  const isLoading = isLoadingRecruitment || isLoadingApplications || isLoadingRecruitmentGangs;

  return (
    <AdminPageLayout
      title={`${recruitment?.data.name_en} ${t(KEY.common_at)} ${recruitment?.data.organization.name}`}
      header={pageHeader}
      loading={isLoading}
    >
      <AllApplicantsFilterBar onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} />
      {applicantList}
    </AdminPageLayout>
  );
}

/**
 * Helper function for mapping gang information
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
