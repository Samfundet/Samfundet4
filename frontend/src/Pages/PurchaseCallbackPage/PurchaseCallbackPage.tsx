import { PurchaseFeedbackForm } from '~/Components/PurchaseFeedbackForm';
import { TextItem } from '~/constants';
import { useTextItem } from '~/hooks';

export function PurchaseCallbackPage() {
  const title = useTextItem(TextItem.purchase_feedback_title) || '';
  const questions = [
    useTextItem(TextItem.purchase_feedback_question_1) || '',
    useTextItem(TextItem.purchase_feedback_question_2) || '',
  ];
  const alternatives = [
    useTextItem(TextItem.purchase_feedback_alternative_1) || '',
    useTextItem(TextItem.purchase_feedback_alternative_2) || '',
    useTextItem(TextItem.purchase_feedback_alternative_3) || '',
    useTextItem(TextItem.purchase_feedback_alternative_4) || '',
  ];
  return (
    <>
      <PurchaseFeedbackForm title={title} questions={questions} alternatives={alternatives} />
    </>
  );
}
