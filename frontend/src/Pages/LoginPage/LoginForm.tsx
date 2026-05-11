import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { getUser, login } from '~/api';
import { useAuthContext } from '~/context/AuthContext';
import { useCustomNavigate } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { PASSWORD, USERNAME } from '~/schema/user';
import { lowerCapitalize } from '~/utils';
import styles from './LoginForm.module.scss';

const schema = z.object({
  username: USERNAME,
  password: PASSWORD,
});

type LoginSchema = z.infer<typeof schema>;

export function LoginForm() {
  const { t } = useTranslation();
  const { setUser } = useAuthContext();
  const navigate = useCustomNavigate();
  const [loginFailed, setLoginFailed] = useState(false);

  const location = useLocation();
  const { from } = location.state || {};
  const fallbackUrl = typeof from === 'undefined' ? ROUTES.frontend.home : from.pathname;

  const form = useForm<LoginSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ username, password }: LoginSchema) => login(username, password),
    onSuccess: (status) => {
      if (status === STATUS.HTTP_202_ACCEPTED) {
        getUser().then(setUser);
        navigate(fallbackUrl);
      } else {
        setLoginFailed(true);
      }
    },
    onError: (error) => {
      setLoginFailed(true);
      console.error(error);
    },
  });

  function onSubmit(values: LoginSchema) {
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
        {loginFailed && <p className={styles.login_failed_comment}>{t(KEY.loginpage_login_failed)}</p>}
        <Button type="submit" theme="green" className={styles.login_button} rounded disabled={isPending}>
          {t(KEY.common_login)}
        </Button>
      </form>
    </Form>
  );
}
