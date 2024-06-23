import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { TextAreaField } from '~/Components/TextAreaField/TextAreaField';
import { getRecruitmentAdmissionsForGang, putRecruitmentAdmissionInterview } from '~/api';
import type { InterviewDto, RecruitmentAdmissionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InterviewNotesAdminPage.module.scss';
import { filterRecruitmentAdmission, getNameUser } from './utils';

export function InterviewNotesPage() {
  const recruitmentId = useParams().recruitmentId;
  const gangId = useParams().gangId;
  const positionId = useParams().positionId;
  const interviewId = useParams().interviewId;
  const [editingMode, setEditingMode] = useState(false);
  const [recruitmentAdmission, setRecruitmentAdmission] = useState<RecruitmentAdmissionDto[]>([]);
  const [interview, setInterview] = useState<InterviewDto | null>(null);
  const [disabled, setdisabled] = useState<boolean>(true);
  const [nameUser, setNameUser] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    if (positionId && recruitmentId && gangId && interviewId) {
      getRecruitmentAdmissionsForGang(gangId, recruitmentId).then((response) => {
        const admission = filterRecruitmentAdmission(response.data, positionId, interviewId);
        if (admission.length !== 0) {
          setdisabled(false);
          setRecruitmentAdmission(admission);
          if (admission[0].interview) {
            setInterview(admission[0].interview);
          }
          setNameUser(getNameUser(admission[0]));
        }
      });
    }
  }, [recruitmentId, positionId, gangId, interviewId]);

  async function handleEditSave() {
    if (editingMode && interview) {
      try {
        await putRecruitmentAdmissionInterview(interview.id, interview);
        toast.success(t(KEY.common_save_successful));
      } catch (error) {
        toast.error(t(KEY.common_something_went_wrong));
      }
    }
    setEditingMode(!editingMode);
  }

  function handleUpdateNotes(value: string) {
    const updatedNotes = value;
    if (recruitmentAdmission[0].interview) {
      const updatedInterview: InterviewDto = { ...recruitmentAdmission[0].interview, notes: updatedNotes };
      setInterview(updatedInterview);
    }
  }

  return (
    <AdminPageLayout title={t(KEY.recruitment_interview_notes)} header={true} showBackButton={true}>
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
