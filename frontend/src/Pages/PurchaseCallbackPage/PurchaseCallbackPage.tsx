import { PurchaseFeedbackForm } from '~/Components/PurchaseFeedbackForm';
import { TITLE, ALTERNATIVES, QUESTIONS } from '~/constants/PurchaseFeedbackForm';

export function PurchaseCallbackPage() {
  return (
    <>
      <PurchaseFeedbackForm title={TITLE} questions={QUESTIONS} alternatives={ALTERNATIVES}></PurchaseFeedbackForm>
    </>
  );
}
