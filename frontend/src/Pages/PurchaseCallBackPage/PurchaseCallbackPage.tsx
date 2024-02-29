import { useEffect, useState } from 'react';
import { PurchaseFeedbackForm } from '~/Components/PurchaseFeedbackForm';
import { getFeedbackForm } from '~/api';
import { FeedbackFormDto } from '~/dto';

export function PurchaseCallbackPage() {
  const [form, setForm] = useState<FeedbackFormDto>({
    title: 'Hvor hørte du om dette arrangementet?',
    questions: ['Andre steder?', 'Øvrige kommentarer?'],
    alternatives: ['Hørte det på bunnpris', 'Jeg fikk det på mail', 'Tja'],
  });

  useEffect(() => {
    getFeedbackForm().then((data) => setForm(data));
  }, []);

  return (
    <PurchaseFeedbackForm
      title={form.title}
      questions={form.questions}
      alternatives={form.alternatives}
    ></PurchaseFeedbackForm>
  );
}
