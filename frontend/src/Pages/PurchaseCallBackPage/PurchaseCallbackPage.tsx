import { useEffect, useState } from 'react';
import { PurchaseFeedbackForm } from '~/Components/PurchaseFeedbackForm';
import { getPurchaseFeedbackForm } from '~/api';
import { PurchaseFeedbackFormDto } from '~/dto';
import { TITLE, ALTERNATIVES, QUESTIONS } from '~/constants/PurchaseFeedbackForm'
export function PurchaseCallbackPage() {
  const [form, setForm] = useState<PurchaseFeedbackFormDto>({
    title: '',
    questions: [''],
    alternatives: [''],
  });

  useEffect(() => {
    setForm({ TITLE, ALTERNATIVES, QUESTIONS })
  }, []);

  return (
    <PurchaseFeedbackForm
      title={form.title}
      questions={form.questions}
      alternatives={form.alternatives}
    ></PurchaseFeedbackForm>
  );
}
