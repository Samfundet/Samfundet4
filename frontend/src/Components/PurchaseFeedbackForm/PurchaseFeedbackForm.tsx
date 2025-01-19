import { t } from 'i18next';
import { useParams } from 'react-router-dom';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { postPurchaseFeedback } from '~/api';
import type { PurchaseFeedbackDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './PurchaseFeedbackForm.module.scss';

type PurchaseFeedbackFormProps = {
  title: string;
  alternatives: string[];
  questions: string[];
};

export function PurchaseFeedbackForm({ title, questions, alternatives }: PurchaseFeedbackFormProps) {
  const { eventId } = useParams();

  function handleSubmit(formData: Record<string, string>) {
    const questionResponses: Record<string, string> = {};
    const alternativesSelected: Record<string, string> = {};

    for (const question in formData) {
      if (questions.includes(question)) {
        questionResponses[question] = formData[question];
      }
    }

    for (const alternative in formData) {
      if (alternatives.includes(formData[alternative])) {
        alternativesSelected[alternative] = formData[alternative];
      }
    }

    const feedback: PurchaseFeedbackDto = {
      eventId: Number(eventId),
      title: title,
      alternatives: alternativesSelected,
      responses: questionResponses,
    };
    postPurchaseFeedback(feedback);
  }
  return (
    <div>
      <SamfForm onSubmit={handleSubmit} submitText={t(KEY.common_save)}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.buttonContainer}>
          {alternatives.map((alternatives, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
            <div key={index} className={styles.checkboxContainer}>
              <div className={styles.checkbox}>
                <SamfFormField required={false} field={alternatives} type="checkbox" />
              </div>
              <p>{alternatives}</p>
            </div>
          ))}
        </div>
        {questions.map((questions, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
          <div key={index} className={styles.questionContainer}>
            <SamfFormField required={true} field={questions} type="text" label={questions} />
          </div>
        ))}
      </SamfForm>
    </div>
  );
}
