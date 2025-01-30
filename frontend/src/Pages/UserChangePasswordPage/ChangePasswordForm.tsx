import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import i18next from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { changePassword } from '~/api';
import { KEY } from '~/i18n/constants';
import { PASSWORD } from '~/schema/user';
import { handleServerFormErrors, lowerCapitalize } from '~/utils';
import styles from './ChangePasswordForm.module.scss';

const schema = z
  .object({
    current_password: PASSWORD,
    new_password: PASSWORD,
    repeat_password: PASSWORD,
  })
  .refine((data) => data.new_password === data.repeat_password, {
    message: i18next.t(KEY.loginpage_passwords_must_match),
    path: ['repeat_password'],
  });

type SchemaType = z.infer<typeof schema>;

export function ChangePasswordForm() {
  const { t } = useTranslation();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      current_password: '',
      new_password: '',
      repeat_password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ current_password, new_password }: { current_password: string; new_password: string }) =>
      changePassword(current_password, new_password),
    onSuccess: () => {
      form.reset();
      toast.success(t(KEY.common_update_successful));
    },
    onError: (error) =>
      handleServerFormErrors(error, form, {
        'Incorrect current': 'Ugyldig nåværende passord',
        'too short': 'Passordet er for kort. Det må inneholde minst 8 karakterer',
        'too common': 'Passordet er for vanlig.',
      }),
  });

  function onSubmit(values: SchemaType) {
    mutate({ current_password: values.current_password, new_password: values.new_password });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        <FormField
          name="current_password"
          control={form.control}
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{lowerCapitalize(`${t(KEY.common_current)} ${t(KEY.common_password)}`)}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="new_password"
          control={form.control}
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{lowerCapitalize(t(KEY.new_password))}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="repeat_password"
          control={form.control}
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{lowerCapitalize(`${t(KEY.common_repeat)} ${t(KEY.new_password)}`)}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={styles.action_row}>
          <Button type="submit" theme="green" disabled={isPending}>
            {t(KEY.common_save)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
