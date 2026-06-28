import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { HTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { updateUser } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import type { UserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { DATE_OF_BIRTH, EMAIL, FIRST_NAME, LAST_NAME, PHONE_NUMBER } from '~/schema/user';
import { handleServerFormErrors } from '~/utils';
import styles from './UserDetailsForm.module.scss';

type UserDetailsFormProps = Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
  user: UserDto;
  disabled?: boolean;
};

export function UserDetailsForm({ user, disabled, ...props }: UserDetailsFormProps) {
  const { t } = useTranslation();
  const { setUser } = useAuthContext();

  const schema = z.object({
    first_name: FIRST_NAME,
    last_name: LAST_NAME,
    email: EMAIL,
    phone_number: PHONE_NUMBER(t),
    date_of_birth: DATE_OF_BIRTH(t),
    // TODO: support changing campus
  });

  type SchemaType = z.infer<typeof schema>;

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone_number: user.phone_number ?? '',
      date_of_birth: user.date_of_birth ?? '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: SchemaType) =>
      updateUser({
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phone_number,
        date_of_birth: values.date_of_birth,
      }),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      toast.success(t(KEY.common_update_successful));
    },
    onError: (error) => {
      handleServerFormErrors(error, form);
    },
  });

  const isDisabled = disabled || isPending;

  function onSubmit(values: SchemaType) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        <FormField
          control={form.control}
          name="first_name"
          disabled={isDisabled}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.common_firstname)}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          disabled={isDisabled}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.common_lastname)}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled={true} // TODO: enable when we implement a proper and secure way of changing email, with verification
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.common_email)}</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          disabled={isDisabled}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.common_phonenumber)}</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_of_birth"
          disabled={isDisabled}
          render={({ field }) => (
            <FormItem className={styles.form_item}>
              <FormLabel>{t(KEY.common_date_of_birth)}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" theme="primary" disabled={isDisabled} className={styles.save_button}>
          {t(KEY.common_save)}
        </Button>
      </form>
    </Form>
  );
}
