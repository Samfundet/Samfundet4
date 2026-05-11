import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { getUser, register } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { EMAIL, FIRST_NAME, LAST_NAME, PASSWORD, PHONE_NUMBER, USERNAME } from '~/schema/user';
import { lowerCapitalize } from '~/utils';
import styles from './SignUpForm.module.scss';

export function SignUpForm() {
  const { t } = useTranslation();
  const [signUpFailed, setSignUpFailed] = useState(false);
  const { setUser } = useAuthContext();
  const navigate = useCustomNavigate();

  const schema = z
    .object({
      username: USERNAME,
      email: EMAIL,
      phone_number: PHONE_NUMBER(t),
      firstname: FIRST_NAME,
      lastname: LAST_NAME,
      password: PASSWORD,
      repeat_password: PASSWORD,
    })
    .superRefine((value, ctx) => {
      if (value.password !== value.repeat_password) {
        ctx.addIssue({
          code: 'custom',
          path: ['repeat_password'],
          message: t(KEY.loginpage_passwords_must_match),
        });
      }
    });

  type SignUpSchema = z.infer<typeof schema>;

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      email: '',
      phone_number: '',
      firstname: '',
      lastname: '',
      password: '',
      repeat_password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SignUpSchema) => register(data),
    onSuccess: (status) => {
      if (status === STATUS.HTTP_202_ACCEPTED) {
        getUser().then(setUser);
        navigate({ url: ROUTES.frontend.home });
      } else {
        setSignUpFailed(true);
      }
    },
    onError: (error) => {
      setSignUpFailed(true);
      console.error(error);
    },
  });

  function onSubmit(values: SignUpSchema) {
    mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(KEY.common_username)}</FormLabel>
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
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
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
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
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
          name="firstname"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
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
          name="lastname"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
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
          name="password"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{lowerCapitalize(t(KEY.common_password))}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="repeat_password"
          disabled={isPending}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{lowerCapitalize(`${t(KEY.common_repeat)} ${t(KEY.common_password)}`)}</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {signUpFailed && <p className={styles.signup_failed_comment}>{t(KEY.signuppage_register_failed)}</p>}
        <Button type="submit" className={styles.signup_button} theme="green" rounded disabled={isPending}>
          {t(KEY.common_register)}
        </Button>
      </form>
    </Form>
  );
}
