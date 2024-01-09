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
  const [editingMode, setEditingMode] = useState(false);
  const [recruitmentAdmission, setRecruitmentAdmission] = useState<RecruitmentAdmissionDto[]>([]);
  const { t } = useTranslation();
  useEffect(() => {
    if (positionId && recruitmentId && gangId) {
      getRecruitmentAdmissionsForGang(gangId, recruitmentId).then((response) => {
        const recruitmentAdmissions = response.data;
        const admission = recruitmentAdmissions.filter(
          (admission) => admission.id.toString() === positionId && admission.interview && admission.interview.notes,
        );
        setRecruitmentAdmission(admission);
      });
    }
  }, [recruitmentId, positionId, gangId]);

  async function handleEditSave() {
    if (recruitmentAdmission[0] === undefined) {
      console.log('no interview notes found');
      toast.error(t(KEY.common_something_went_wrong));
      return;
    }
    if (editingMode) {
      const updatedAdmission = {
        ...recruitmentAdmission[0],
        interview: {
          ...recruitmentAdmission[0].interview,
          notes: recruitmentAdmission[0].interview.notes,
        },
      };
      try {
        console.log('Saving this data:', updatedAdmission);
        const response = await putRecruitmentAdmissionForGang(recruitmentAdmission[0].id.toString(), updatedAdmission);
        console.log('Saved data response:', response);
      } catch (error) {
        console.error('Error saving notes:', error);
        toast.error(t(KEY.common_something_went_wrong));
      }
    }
    setEditingMode(!editingMode);
  }

  return (
    <AdminPageLayout title={t(KEY.recruitment_interview_notes)}>
      <div className={styles.container}>
        <label htmlFor="INotes">
          {t(KEY.recruitment_applicant)} {positionId}
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
