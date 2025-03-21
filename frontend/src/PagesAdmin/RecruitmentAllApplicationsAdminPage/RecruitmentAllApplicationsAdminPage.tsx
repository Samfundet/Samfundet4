import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Link, Table } from '~/Components';
import { getAllRecruitmentApplications, getRecruitment } from '~/api';
import type { RecruitmentApplicationDto, UserDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { applicationKeys, recruitmentKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { RecruitmentPriorityChoicesMapping, RecruitmentStatusChoicesMapping } from '~/types';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { AllApplicantsActionbar, AllApplicationsExpandableHeader, type FilterType } from './components';

// Interface for the grouped data received from the backend
interface GroupedDataItem extends UserDto {
  applications: RecruitmentApplicationDto[];
}

interface GangDetails {
  id: number;
  name_en: string;
  name_nb: string;
  abbreviation: string | null;
}

interface GangMapping {
  [key: number]: GangDetails;
}

const browserTabTitle = 'All applicants';

export function RecruitmentAllApplicationsAdminPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [parsedApplicantData, setParsedApplicantData] = useState<GroupedDataItem[] | null>(null);
  const [gangMapping, setGangMapping] = useState<GangMapping>({});

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

  // Getting the applicants data from the API
  const { data: apiResponse, isLoading: isLoadingApplications } = useQuery({
    queryKey: applicationKeys.all,
    queryFn: () => {
      if (!recruitmentId) {
        throw new Error('Recruitment ID is required');
      }
      return getAllRecruitmentApplications(recruitmentId);
    },
    enabled: Boolean(recruitmentId),
  });

  // Extract applicant data from API response and build gang mapping
  useEffect(() => {
    if (apiResponse?.data?.data && Array.isArray(apiResponse.data.data)) {
      const applicantData = apiResponse.data.data;
      setParsedApplicantData(applicantData);

      // Build gang mapping from the applications
      const gangs: GangMapping = {};

      applicantData.forEach((applicant) => {
        if (applicant.applications) {
          applicant.applications.forEach((app) => {
            // Extract the gang object from the application
            const gang = app.recruitment_position?.gang;

            if (gang && typeof gang === 'object' && 'id' in gang) {
              const gangId = gang.id;

              // Add to our mapping if not already there
              if (!gangs[gangId]) {
                gangs[gangId] = {
                  id: gangId,
                  name_en: gang.name_en,
                  name_nb: gang.name_nb,
                  abbreviation: gang.abbreviation,
                };
              }
            }
          });
        }
      });

      setGangMapping(gangs);
    }
  }, [apiResponse]);

  // Table columns definition
  const tableColumns = [
    { content: t(KEY.common_gang), sortable: false },
    { content: t(KEY.common_recruitmentposition), sortable: false },
    { content: t(KEY.recruitment_priority), sortable: false },
    { content: t(KEY.recruitment_interview_location), sortable: false },
    { content: t(KEY.recruitment_interview_time), sortable: false },

    { content: t(KEY.recruitment_recruiter_priority), sortable: false },
    { content: t(KEY.recruitment_recruiter_status), sortable: false },
  ];

  const applicationsToTableRows = (applications: RecruitmentApplicationDto[]) => {
    return applications.map((app) => {
      // Extract the gang object directly from the application
      const gang = app.recruitment_position?.gang;

      // Get gang details directly from the application
      const gangId = typeof gang === 'object' && 'id' in gang ? gang.id : (gang as unknown as number);
      const gangDetails = typeof gang === 'object' && 'name_en' in gang ? (gang as GangDetails) : gangMapping[gangId];

      const positionPageUrl = reverse({
        pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
        urlParams: { recruitmentId: recruitmentId, gangId: gangId, positionId: app.recruitment_position.id },
      });

      // Use the gang details directly from the application
      const gangName = gangDetails?.abbreviation || gangDetails?.name_en || 'N/A';

      return {
        cells: [
          {
            value: gangName,
            content: <strong>{gangName}</strong>,
          },
          {
            value: app.recruitment_position.name_nb,
            content: <Link url={positionPageUrl}>{app.recruitment_position.name_nb}</Link>,
          },
          {
            value: app.applicant_priority,
            content: <span>{app.applicant_priority}</span>,
          },
          {
            value: app.interview?.interview_location,
            content: <span>{app.interview?.interview_location ?? t(KEY.common_not_set)}</span>,
          },
          {
            value: app.interview?.interview_time,
            content: <span>{app.interview?.interview_time ?? t(KEY.common_not_set)}</span>,
          },
          {
            value: app.recruiter_priority,
            content: app.recruiter_priority ? (
              <span>{RecruitmentPriorityChoicesMapping[app.recruiter_priority]}</span>
            ) : (
              'N/A'
            ),
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
  };

  // Display loading state when fetching data
  const isLoading = isLoadingRecruitment || isLoadingApplications;

  // Render applicant list
  const renderApplicantList = () => {
    if (isLoading) {
      return <div>Loading applicants...</div>;
    }

    if (!recruitment) {
      return <div>Recruitment data not available</div>;
    }

    // Use our state variable that was set from the API response
    if (!parsedApplicantData || !Array.isArray(parsedApplicantData) || parsedApplicantData.length === 0) {
      return <div>No applicants found for this recruitment.</div>;
    }

    return parsedApplicantData.map((item: GroupedDataItem) => {
      if (!item) {
        return null;
      }

      const tableData = applicationsToTableRows(item.applications || []);

      return (
        <AllApplicationsExpandableHeader
          recruitment={recruitment.data}
          user={item}
          key={item.id}
          table={<Table columns={tableColumns} data={tableData} defaultSortColumn={1} />}
          onSetInterviewClick={handleSetInterviewsForApplicant}
        />
      );
    });
  };

  return (
    <AdminPageLayout
      title={`${recruitment?.data.name_en} ${t(KEY.common_at)} ${recruitment?.data.organization.name}`}
      header={
        <Button theme="green" onClick={() => alert('TODO: add automatic interview distribution')}>
          {t(KEY.recruitment_interview_set_all)}
        </Button>
      }
      loading={isLoading}
    >
      <AllApplicantsActionbar onFilterChange={handleFilterChange} onSearchChange={handleSearchChange} />
      {renderApplicantList()}
    </AdminPageLayout>
  );
}
