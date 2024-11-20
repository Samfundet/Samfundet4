import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { KEY } from '~/i18n/constants';
import { PASSWORD } from '~/schema/user';
import { lowerCapitalize } from '~/utils';
import styles from './ChangePasswordForm.module.scss';

const schema = z.object({
  current_password: PASSWORD,
  new_password: PASSWORD,
  repeat_password: PASSWORD,
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

  function onSubmit(values: SchemaType) {
    console.log('Values:', values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
        <FormField
          name="current_password"
          control={form.control}
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
          <Button type="submit" theme="green">
            {t(KEY.common_save)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
