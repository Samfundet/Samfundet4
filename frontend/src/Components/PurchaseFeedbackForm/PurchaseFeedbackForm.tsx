import { t } from 'i18next';
import { SamfForm } from '~/Forms/SamfForm';
import { SamfFormField } from '~/Forms/SamfFormField';
import { postPurchaseFeedback } from '~/api';
import { PurchaseFeedbackDto, PurchaseFeedbackFormDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './PurchaseFeedbackform.module.scss';

export function PurchaseFeedbackForm({ title, questions, alternatives }: PurchaseFeedbackFormDto) {
  function handleSubmit(formData: Record<string, string>) {
    const questionResponses: Record<string, string> = {};

    for (const question in formData) {
      if (questions.includes(question)) {
        questionResponses[question] = formData[question];
      }
    }
    for (const question in formData) {
      if (questions.includes(question)) {
        questionResponses[question] = formData[question];
      }
    }

    const selectedAlternatives = alternatives.filter((alternative) => formData[alternative] === 'on');

    const feedback: PurchaseFeedbackDto = {
      responses: questionResponses,
      alternatives: selectedAlternatives,
    };
    postPurchaseFeedback(feedback);
  }
  return (
    <div>
      <SamfForm onSubmit={handleSubmit} submitText={t(KEY.common_save)}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.buttonContainer}>
          {alternatives.map((alternatives, index) => (
            <div key={index} className={styles.alternative}>
              <p>{alternatives}</p>
              <SamfFormField required={false} field={alternatives} type="checkbox" />
            </div>
          ))}
        </div>
        {questions.map((questions, index) => (
          <div key={index}>
            <SamfFormField required={true} field={questions} type="text" label={questions} />
          </div>
        ))}
      </SamfForm>
    </div>
  );
}
