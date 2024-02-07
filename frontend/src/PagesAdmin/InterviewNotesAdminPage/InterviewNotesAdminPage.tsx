import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '~/Components';
import { TextAreaField } from '~/Components/TextAreaField/TextAreaField';
import { getRecruitmentAdmissionsForGang, putRecruitmentAdmissionForGang } from '~/api';
import { RecruitmentAdmissionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InterviewNotesAdminPage.module.scss';

export function InterviewNotesPage() {
  const recruitmentId = useParams().recruitmentId;
  const gangId = useParams().gangId;
  const positionId = useParams().positionId;
  const interviewId = useParams().interviewId;
  const [editingMode, setEditingMode] = useState(false);
  const [recruitmentAdmission, setRecruitmentAdmission] = useState<RecruitmentAdmissionDto[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [disabled, setdisabled] = useState<boolean>(true);
  const [nameUser, setNameUser] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    if (positionId && recruitmentId && gangId && interviewId) {
      getRecruitmentAdmissionsForGang(gangId, recruitmentId).then((response) => {
        const recruitmentAdmissions = response.data;
        const admission = recruitmentAdmissions.filter(
          (admission) =>
            admission.recruitment_position &&
            admission.recruitment_position.toString() === positionId &&
            admission.interview.id.toString() === interviewId,
        );
        if (admission.length !== 0) {
          setdisabled(false);
          setRecruitmentAdmission(admission);
          setNameUser(
            admission[0].user.first_name ? admission[0].user.first_name + ' ' + admission[0].user.last_name : '',
          );
        }
      });
    }
  }, [recruitmentId, positionId, gangId, interviewId, t]);

  async function handleEditSave() {
    if (editingMode) {
      try {
        await putRecruitmentAdmissionForGang(recruitmentAdmission[0].id.toString(), recruitmentAdmission[0]);
        toast.success(t(KEY.common_save_successful));
      } catch (error) {
        toast.error(t(KEY.common_something_went_wrong));
      }
    }
    setEditingMode(!editingMode);
  }

  return (
    <AdminPageLayout title={t(KEY.recruitment_interview_notes)}>
      <div className={styles.container}>
        <label htmlFor="INotes">
          {t(KEY.recruitment_applicant)}: {nameUser}
        </label>
        <TextAreaField
          value={recruitmentAdmission[0] ? recruitmentAdmission[0].interview.notes : ' '}
          onChange={(value: string) => {
            const updatedNotes = value;
            const updatedInterview = { ...recruitmentAdmission[0].interview, notes: updatedNotes };
            const updatedAdmission = { ...recruitmentAdmission[0], interview: updatedInterview };
            setRecruitmentAdmission([updatedAdmission]);
          }}
          disabled={!editingMode}
        ></TextAreaField>
        <Button theme="samf" rounded={true} className={styles.button} onClick={handleEditSave} disabled={disabled}>
          {editingMode ? t(KEY.common_save) : t(KEY.common_edit)}
        </Button>
      </div>
    </AdminPageLayout>
  );
}
