import { useEffect, useState } from 'react';
import { PurchaseFeedbackForm } from '~/Components/PurchaseFeedbackForm';
import { getPurchaseFeedbackForm } from '~/api';
import { PurchaseFeedbackFormDto } from '~/dto';

export function PurchaseCallbackPage() {
  const [form, setForm] = useState<PurchaseFeedbackFormDto>({
    title: 'Hvor hørte du om dette arrangementet?',
    questions: ['Andre steder?', 'Øvrige kommentarer?'],
    alternatives: ['Hørte det på bunnpris', 'Jeg fikk det på mail', 'Tja'],
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
