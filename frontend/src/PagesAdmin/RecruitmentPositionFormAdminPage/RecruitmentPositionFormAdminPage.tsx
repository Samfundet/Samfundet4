import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { getRecruitmentPosition, getUsers } from '~/api';
import type { RecruitmentPositionDto, UserDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import { RecruitmentPositionForm } from './RecruitmentPositionForm';

export function RecruitmentPositionFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recruitmentId, gangId, positionId } = useParams();
  const [position, setPosition] = useState<Partial<RecruitmentPositionDto>>();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Reference to store timeout ID for debouncing
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Function to handle user search with inline debounce
  const handleUserSearch = useCallback(
    (term: string) => {
      // Clear any existing timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!term.trim()) {
        setUsers([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      // Set a new timeout
      searchTimeoutRef.current = setTimeout(async () => {
        try {
          const results = await getUsers(term);
          setUsers(results);
        } catch (error) {
          console.error('Error searching users:', error);
          toast.error(t(KEY.common_something_went_wrong));
        } finally {
          setIsSearching(false);
        }
      }, 300); // 300ms debounce delay
    },
    [t],
  );

  // Clean up timeout on component unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Load position data if editing
  useEffect(() => {
    if (positionId) {
      getRecruitmentPosition(positionId)
        .then((data) => {
          setPosition(data.data);
          // If we have interviewers, fetch their data
          if (data.data.interviewers?.length) {
            // We need to make sure we have the interviewer data even without search
            const interviewerIds = data.data.interviewers.map((i) => i.id);
            getUsers(interviewerIds.join(' ')).then((results: UserDto[]) => setUsers(results));
          }
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
              urlParams: { recruitmentId, gangId },
            }),
            { replace: true },
          );
        });
    }
  }, [positionId, recruitmentId, gangId, navigate, t]);

  const initialData: Partial<RecruitmentPositionDto> = {
    name_nb: position?.name_nb || '',
    name_en: position?.name_en || '',
    norwegian_applicants_only: position?.norwegian_applicants_only || false,
    short_description_nb: position?.short_description_nb || '',
    short_description_en: position?.short_description_en || '',
    long_description_nb: position?.long_description_nb || '',
    long_description_en: position?.long_description_en || '',
    is_funksjonaer_position: position?.is_funksjonaer_position || false,
    default_application_letter_nb: position?.default_application_letter_nb || '',
    default_application_letter_en: position?.default_application_letter_en || '',
    tags: position?.tags || '',
    interviewers: position?.interviewers || [],
  };

  const title = positionId
    ? `${t(KEY.common_edit)} ${position?.name_nb}`
    : `${t(KEY.common_create)} ${t(KEY.recruitment_position)}`;

  useTitle(title);

  return (
    <AdminPageLayout title={title} header={true}>
      <RecruitmentPositionForm
        initialData={initialData}
        positionId={positionId}
        recruitmentId={recruitmentId}
        gangId={gangId}
        users={users}
        onUserSearch={handleUserSearch}
        isSearchingUsers={isSearching}
      />
    </AdminPageLayout>
  );
}
