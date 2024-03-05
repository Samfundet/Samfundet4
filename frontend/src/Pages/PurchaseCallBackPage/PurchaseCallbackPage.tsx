import { useEffect, useState } from 'react';
import { PurchaseFeedbackForm } from '~/Components/PurchaseFeedbackForm';
import { getPurchaseFeedbackForm } from '~/api';
import { PurchaseFeedbackFormDto } from '~/dto';

export function PurchaseCallbackPage() {
  const [form, setForm] = useState<PurchaseFeedbackFormDto>({
    title: '',
    questions: [''],
    alternatives: [''],
  });

  useEffect(() => {
    getPurchaseFeedbackForm().then((data) => setForm(data));
  }, []);

  return (
    <PurchaseFeedbackForm
      title={form.title}
      questions={form.questions}
      alternatives={form.alternatives}
    ></PurchaseFeedbackForm>
  );
}
