import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { postFeedback } from '~/api';
import { FeedbackDto } from '~/dto';
import styles from './PurchaseFeedbackform.module.scss';

type PurchaseFeedbackFormProps = {
  alternatives: string[];
};

export function PurchaseFeedbackForm({ alternatives }: PurchaseFeedbackFormProps) {
  function handleSubmit(formData: Record<string, string>) {
    const selectedAlternatives = alternatives.filter((alternative) => formData[alternative] === 'on');

    const feedback: FeedbackDto = {
      otherOption: formData['other'],
      comment: formData['comment'],
      alternatives: selectedAlternatives,
    };
    postFeedback(feedback);
  }
  return (
    <div>
      <SamfForm onSubmit={handleSubmit} submitText="Send inn">
        <h1 className={styles.title}>Hvor hørte du om dette arrangementet?</h1>
        <div className={styles.buttonContainer}>
          {alternatives.map((alternative, index) => (
            <div key={index}>
              <p>{alternative}</p>
              <SamfFormField required={false} field={alternative} type="checkbox" />
            </div>
          ))}
        </div>
        <SamfFormField required={true} field="other" type="text" label="Andre steder:" />
        <SamfFormField required={true} field="comment" type="text" label="Øvrige Kommentarer:" />
      </SamfForm>
    </div>
  );
}
