import { useState } from 'react';
import { Button } from '~/Components';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InterviewNotesAdminPage.module.scss';

export function InterviewNotesPage() {
  //TODO: interview notes from backen
  const [editingMode, setEditingMode] = useState(false);
  const [text, setText] = useState('Notater fra intervjuet her...'); //TODO: place the text from the backend here.
  const posid = 1; //TODO: get the posid from the backend.

  function handleOnClick() {
    if (editingMode) {
      setEditingMode(false);
      //TODO: Save the text in the textbox and send it to the backend.
    } else {
      setEditingMode(true);
      //TODO: Get the text from the backend, and place it in the textbox.
    }
  }

  function handleTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  return (
    <AdminPageLayout title="Interview Notes">
      <div className={styles.container}>
        <label htmlFor="INotes">Interview Notes for nummer {posid}</label>
        {editingMode ? (
          <textarea id="INotes" name="INotes" className={styles.textbox} value={text} onChange={handleTextarea}>
            {text}
          </textarea>
        ) : (
          <div className={styles.textbox}>
            <p>{text}</p>
          </div>
        )}
        <Button theme="samf" rounded={true} className={styles.button} onClick={handleOnClick}>
          {editingMode ? 'Save' : 'Edit'}
        </Button>
      </div>
    </AdminPageLayout>
  );
}
