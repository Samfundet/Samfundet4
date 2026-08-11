import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from '~/Components';
import { FormDescription } from '~/Components/Forms/Form';
import { postFeedback } from '~/api';
import type { FeedbackDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { CONTACT_EMAIL, TEXT } from '~/schema/userfeedback';
import { handleServerFormErrors } from '~/utils';
import styles from './UserFeedbackForm.module.scss';

const schema = z.object({
  text: TEXT,
  contact_email: CONTACT_EMAIL,
});

type SchemaType = z.infer<typeof schema>;

type UserFeedbackFormProps = {
  onSuccess?: () => void;
};

export function UserFeedbackForm({ onSuccess }: UserFeedbackFormProps) {
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: '',
      contact_email: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ text, contact_email }: SchemaType) => {
      const data: FeedbackDto = {
        text,
        screen_resolution: `${window.innerWidth}x${window.innerHeight}`,
        path: window.location.pathname,
      };
      if (contact_email !== '') {
        data.contact_email = contact_email;
      }
      return postFeedback(data);
    },
    onSuccess: () => {
      form.reset();
      toast.success(t(KEY.feedback_thank_you_for_feedback));
      onSuccess?.();
    },
    onError: (error) => {
      handleServerFormErrors(error, form);
    },
  });

  function onSubmit(values: SchemaType) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="text"
          disabled={isPending}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.feedback_your_feedback)}</FormLabel>
              <FormDescription>{t(KEY.feedback_helper_text)}</FormDescription>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_email"
          disabled={isPending}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>
                {t(KEY.common_email)} ({t(KEY.common_not_required).toLowerCase()})
              </FormLabel>
              <FormDescription>{t(KEY.feedback_want_contact_text)}</FormDescription>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" theme="success" disabled={isPending} className={styles.submit_button}>
          {t(KEY.common_send)}
        </Button>
      </form>
    </Form>
  );
}
