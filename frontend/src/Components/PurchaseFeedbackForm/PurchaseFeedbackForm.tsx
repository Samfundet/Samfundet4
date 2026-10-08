import { t } from 'i18next';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { KEY } from '~/i18n/constants';

import { postPurchaseFeedback } from '~/api';
import type { PurchaseFeedbackDto } from '~/dto';

import styles from './PurchaseFeedbackForm.module.scss';

type PurchaseFeedbackFormProps = {
  title: string;
  alternatives: string[];
  questions: string[];
};

type PurchaseFeedbackFormData = Record<string, string | boolean>;

export function PurchaseFeedbackForm({ title, questions, alternatives }: PurchaseFeedbackFormProps) {
  const { eventId } = useParams();

  const form = useForm<PurchaseFeedbackFormData>();

  function onSubmit(values: PurchaseFeedbackFormData) {
    const questionResponses: Record<string, string> = {};
    const alternativesSelected: Record<string, string> = {};

    for (const question of questions) {
      const value = values[question];

      if (typeof value === 'string') {
        questionResponses[question] = value;
      }
    }

    for (const alternative of alternatives) {
      if (values[alternative] === true) {
        alternativesSelected[alternative] = alternative;
      }
    }

    const feedback: PurchaseFeedbackDto = {
      eventId: Number(eventId),
      title,
      alternatives: alternativesSelected,
      responses: questionResponses,
    };

    postPurchaseFeedback(feedback);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className={styles.title}>{title}</h1>

        <div className={styles.buttonContainer}>
          {alternatives.map((alternative, index) => (
            <FormField
              // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
              key={index}
              control={form.control}
              name={alternative}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value === true}
                      onChange={(e) => field.onChange(e.target.checked)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>

                  <FormLabel>{alternative}</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {questions.map((question, index) => (
          <FormField
            // biome-ignore lint/suspicious/noArrayIndexKey: no other unique value available
            key={index}
            control={form.control}
            name={question}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{question}</FormLabel>

                <FormControl>
                  <Input type="text" {...field} value={typeof field.value === 'string' ? field.value : ''} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button type="submit">{t(KEY.common_save)}</Button>
      </form>
    </Form>
  );
}
