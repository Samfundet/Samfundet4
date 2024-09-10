import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../Button';
import { InputField } from '../InputField';
import { TextAreaField } from '../TextAreaField';
import { postRejectionMail } from '~/api';
import { toast } from 'react-toastify';
import { t } from 'i18next';
import { KEY } from '~/i18n/constants';

export function RejectionMail() {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');
  const recruitmentId = useParams().recruitmentId;

  function handleSubmit() {
    if (recruitmentId) {
      postRejectionMail(recruitmentId, { subject, text });
      toast.success('Email sent!');
    } else {
      toast.error(t(KEY.common_something_went_wrong));
      console.error('Recruitment id cannot be null');
    }
  }

  return (
    <>
      <label>Subject</label>
      <InputField type="text" value={subject} onChange={setSubject} />
      <label>Email</label>
      <TextAreaField value={text} onChange={setText} />
      <Button theme="green" onClick={handleSubmit}>
        Submit
      </Button>
    </>
  );
}
