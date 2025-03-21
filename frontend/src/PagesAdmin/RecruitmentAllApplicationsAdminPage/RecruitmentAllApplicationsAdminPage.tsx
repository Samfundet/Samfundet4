import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Button, Link, Table } from '~/Components';
import { getAllRecruitmentApplications, getRecruitment } from '~/api';
import type { ApplicationForAllApplications, RecruitmentApplicantApplicationsDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { applicationKeys, recruitmentKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { RecruitmentPriorityChoicesMapping, RecruitmentStatusChoicesMapping, getApplicantStateColor } from '~/types';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { AllApplicantsActionbar, AllApplicationsExpandableHeader, type FilterType } from './components';
import { CommentForm } from './components/CommentForm';

const browserTabTitle = 'All applicants';

export function RecruitmentAllApplicationsAdminPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [parsedApplicantData, setParsedApplicantData] = useState<RecruitmentApplicantApplicationsDto[] | null>(null);

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

  // Getting the applicants data
  const { data: applicants, isLoading: isLoadingApplications } = useQuery({
    queryKey: applicationKeys.all,
    queryFn: () => {
      if (!recruitmentId) {
        throw new Error('Recruitment ID is required');
      }
      return getAllRecruitmentApplications(recruitmentId);
    },
    enabled: Boolean(recruitmentId),
  });

  useEffect(() => {
    if (applicants?.data && Array.isArray(applicants.data)) {
      setParsedApplicantData(applicants.data);
    }
  }, [applicants]);

  // Table columns definition
  const tableColumns = [
    { content: t(KEY.common_gang), sortable: false },
    { content: t(KEY.common_recruitmentposition), sortable: false },
    { content: t(KEY.recruitment_priority), sortable: false },
    { content: t(KEY.recruitment_interview_location), sortable: false },
    { content: t(KEY.recruitment_interview_time), sortable: false },
    { content: t(KEY.recruitment_recruiter_priority), sortable: false },
    { content: t(KEY.recruitment_recruiter_status), sortable: false },
    { content: t(KEY.recruitment_recruiter_guide), sortable: false },
    { content: t(KEY.common_comment), sortable: false },
  ];

  const applicationsToTableRows = (applications: ApplicationForAllApplications[]) => {
    return applications.map((app) => {
      // Extract the gang object directly from the application
      const gang = app.recruitment_position.gang;

      // Get gang name, using abbreviation if available
      const gangName = gang.abbreviation || gang.name_en || 'N/A';

      const positionPageUrl = reverse({
        pattern: ROUTES.frontend.admin_recruitment_gang_position_applicants_overview,
        urlParams: {
          recruitmentId: recruitmentId,
          gangId: gang.id,
          positionId: app.recruitment_position.id,
        },
      });

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
            content:
              app.recruiter_priority !== undefined && app.recruiter_priority !== null ? (
                <span>{RecruitmentPriorityChoicesMapping[app.recruiter_priority]}</span>
              ) : (
                'N/A'
              ),
          },
          {
            value: app.recruiter_status,
            content:
              app.recruiter_status !== undefined && app.recruiter_status !== null ? (
                <span>{RecruitmentStatusChoicesMapping[app.recruiter_status]}</span>
              ) : (
                'N/A'
              ),
          },
          {
            value: app.applicant_state,
            content:
              <span style={{ backgroundColor: getApplicantStateColor(app.applicant_state) }}>FØRING</span> ?? 'N/A',
          },
          {
            value: 'form',
            content: <CommentForm initialData={''} applicationId={app.id} />,
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

    return parsedApplicantData.map((applicant: RecruitmentApplicantApplicationsDto) => {
      if (!applicant) {
        return null;
      }

      const tableData = applicationsToTableRows(applicant.applications || []);

      return (
        <AllApplicationsExpandableHeader
          recruitment={recruitment.data}
          user={applicant}
          key={applicant.id}
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
