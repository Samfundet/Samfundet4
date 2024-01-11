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
  const userId = useParams().userId;
  const [editingMode, setEditingMode] = useState(false);
  const [recruitmentAdmission, setRecruitmentAdmission] = useState<RecruitmentAdmissionDto[]>([]);
  const [nameUser, setNameUser] = useState<string>('');
  const { t } = useTranslation();

  useEffect(() => {
    if (positionId && recruitmentId && gangId && userId) {
      getRecruitmentAdmissionsForGang(gangId, recruitmentId).then((response) => {
        const recruitmentAdmissions = response.data;
        const admission = recruitmentAdmissions.filter(
          (admission) =>
            admission.id.toString() === positionId && admission.interview && userId === admission.user.id.toString(),
        );
        setRecruitmentAdmission(admission);
        setNameUser(admission[0].user.first_name + ' ' + admission[0].user.last_name);
      });
    }
  }, [recruitmentId, positionId, gangId, userId]);

  async function handleEditSave() {
    if (editingMode) {
      const updatedAdmission = {
        ...recruitmentAdmission[0],
        interview: {
          ...recruitmentAdmission[0].interview,
          notes: recruitmentAdmission[0].interview.notes,
        },
      };
      try {
        await putRecruitmentAdmissionForGang(recruitmentAdmission[0].id.toString(), updatedAdmission);
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
          {t(KEY.recruitment_applicant)} {positionId} - {nameUser}
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
        <Button theme="samf" rounded={true} className={styles.button} onClick={handleEditSave}>
          {editingMode ? t(KEY.common_save) : t(KEY.common_edit)}
        </Button>
      </div>
    </AdminPageLayout>
  );
}
