import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '~/Components';
import { TextAreaField } from '~/Components/TextAreaField/TextAreaField';
import { KEY } from '~/i18n/constants';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InterviewNotesAdminPage.module.scss';

export function InterviewNotesPage() {
  //TODO: interview notes from backend
  const [editingMode, setEditingMode] = useState(false);
  const [text, setText] = useState('Notater fra intervjuet her...'); //TODO: place the text from the backend here.
  const posid = 1; //TODO: get the posid from the backend.
  const { t } = useTranslation();

  function handleOnClick() {
    //TODO: Save the text in the textbox and send it to the backend
    editingMode ? setEditingMode(false) : setEditingMode(true);
  }

  function handleTextarea(value: string) {
    setText(value);
  }

  //TODO: make handleSave function to save the text in the textbox and send it to the backend

  return (
    <AdminPageLayout title={t(KEY.recruitment_interview_notes)}>
      <div className={styles.container}>
        <label htmlFor="INotes">
          {t(KEY.recruitment_applicant)} {posid}
        </label>
        {editingMode ? (
          <TextAreaField value={text} onChange={handleTextarea}></TextAreaField>
        ) : (
          <div className={styles.textbox}>
            <p>{text}</p>
          </div>
        )}
        <Button theme="samf" rounded={true} className={styles.button} onClick={handleOnClick}>
          {editingMode ? t(KEY.common_save) : t(KEY.common_edit)}
        </Button>
      </div>
    </AdminPageLayout>
  );
}
