import { useState } from 'react';
import { Button } from '../Button';
import { InputField } from '../InputField';
import { TextAreaField } from '../TextAreaField';

export function RejectionMail() {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('');

  function handleSubmit() {
    console.log('Text: ' + text);
    console.log('subject: ' + subject);
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
