import { t } from 'i18next';
import { useState } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
//import { postRejectionMail } from '~/api';
import { KEY } from '~/i18n/constants';
import { Button } from '../Button';
import { InputField } from '../InputField';
import { TextAreaField } from '../TextAreaField';

export function RejectionMail() {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const recruitmentId = useParams().recruitmentId;

  function handleSubmit() {
    if (recruitmentId) {
      //postRejectionMail(recruitmentId, { subject, text });
      toast.success(t(KEY.common_save_successful));
    } else {
      toast.error(t(KEY.common_something_went_wrong));
      console.error('Recruitment id cannot be null');
    }
  }

  return (
    <>
      <label>{t(KEY.common_email_subject)}</label>
      <InputField type="text" value={subject} onChange={setSubject} />
      <label>{t(KEY.common_email)}</label>
      <TextAreaField value={text} onChange={setText} />
      <Button theme="green" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
}
