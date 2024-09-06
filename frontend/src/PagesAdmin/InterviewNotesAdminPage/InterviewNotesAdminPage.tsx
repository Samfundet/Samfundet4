import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { TextAreaField } from '~/Components/TextAreaField/TextAreaField';
import { getRecruitmentApplicationsForGang, putRecruitmentApplicationInterview } from '~/api';
import type { InterviewDto, RecruitmentApplicationDto } from '~/dto';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InterviewNotesAdminPage.module.scss';
import { filterRecruitmentApplication, getNameUser } from './utils';

export function InterviewNotesPage() {
  const recruitmentId = useParams().recruitmentId;
  const gangId = useParams().gangId;
  const positionId = useParams().positionId;
  const interviewId = useParams().interviewId;
  const [editingMode, setEditingMode] = useState(false);
  const [recruitmentApplication, setRecruitmentApplication] = useState<RecruitmentApplicationDto[]>([]);
  const [interview, setInterview] = useState<InterviewDto | null>(null);
  const [disabled, setdisabled] = useState<boolean>(true);
  const [nameUser, setNameUser] = useState<string>('');
  const { t } = useTranslation();
  const navigate = useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  useEffect(() => {
    if (positionId && recruitmentId && gangId && interviewId) {
      getRecruitmentApplicationsForGang(gangId, recruitmentId)
        .then((response) => {
          const application = filterRecruitmentApplication(response.data, positionId, interviewId);
          if (application.length !== 0) {
            setdisabled(false);
            setRecruitmentApplication(application);
            if (application[0].interview) {
              setInterview(application[0].interview);
            }
            setNameUser(getNameUser(application[0]));
          }
        })
        .catch((data) => {
          if (data.request.status === STATUS.HTTP_404_NOT_FOUND) {
            navigate(ROUTES.frontend.not_found, { replace: true });
          }
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }, [recruitmentId, positionId, gangId, interviewId]);

  async function handleEditSave() {
    if (editingMode && interview) {
      try {
        if (interview.id) {
          await putRecruitmentApplicationInterview(interview.id, interview);
          toast.success(t(KEY.common_save_successful));
        }
      } catch (error) {
        toast.error(t(KEY.common_something_went_wrong));
      }
    }
    setEditingMode(!editingMode);
  }

  function handleUpdateNotes(value: string) {
    const updatedNotes = value;
    if (recruitmentApplication[0].interview) {
      const updatedInterview: InterviewDto = { ...recruitmentApplication[0].interview, notes: updatedNotes };
      setInterview(updatedInterview);
    }
  }

  return (
    <AdminPageLayout title={t(KEY.recruitment_interview_notes)} header={true}>
      <div className={styles.container}>
        <label htmlFor="INotes">
          {t(KEY.recruitment_applicant)}: {nameUser}
        </label>
        <TextAreaField value={interview ? interview.notes : ' '} onChange={handleUpdateNotes} disabled={!editingMode} />
        <Button theme="samf" rounded={true} className={styles.button} onClick={handleEditSave} disabled={disabled}>
          {editingMode ? t(KEY.common_save) : t(KEY.common_edit)}
        </Button>
      </div>
    </AdminPageLayout>
  );
}
