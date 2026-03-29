import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Input, Link } from '~/Components';
import { Button } from '~/Components/Button';
import { Form, FormField, FormItem, FormLabel } from '~/Components/Forms';
import { FormControl, FormDescription } from '~/Components/Forms/Form';
import { connectToMdb } from '~/api';
import { KEY } from '~/i18n/constants';
import { SAMF3_MEMBER_URL } from '~/routes/samf-three';
import { EMAIL_OR_MEMBERSHIP_NUMBER, PASSWORD } from '~/schema/user';
import { lowerCapitalize } from '~/utils';
import styles from './MDBConnectFormAdminPage.module.scss';

export function MDBConnectForm() {
  const { t } = useTranslation();

  const schema = z.object({
    member_login: EMAIL_OR_MEMBERSHIP_NUMBER(t),
    password: PASSWORD,
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      member_login: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    connectToMdb(values.member_login, values.password)
      .then((res) => {
        toast.success(t(KEY.adminpage_connect_mdb_succesful_toast));
      })
      .catch((error) => {
        toast.error(t(KEY.adminpage_connect_mdb_common_error));
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          if (error.member_login) {
            toast.error(error.member_login?.message);
          }
          if (error.password) {
            toast.error(`${lowerCapitalize(t(KEY.common_password))}: ${error.password?.message}`);
          }
        })}
      >
        <FormField
          control={form.control}
          name="member_login"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{lowerCapitalize(t(KEY.email_or_membership_number))}</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{lowerCapitalize(t(KEY.common_password))}</FormLabel>
              <FormDescription>
                {t(KEY.adminpage_connect_mdb_password_notice_1)}{' '}
                <Link url={SAMF3_MEMBER_URL.medlem} target="external">
                  {t(KEY.adminpage_connect_mdb_password_notice_2)}
                </Link>
              </FormDescription>
              <FormControl>
                <Input placeholder="" type="password" autoComplete="off" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className={styles.form_button} type="submit" theme="green" rounded>
          {t(KEY.common_connect)}
        </Button>
      </form>
    </Form>
  );
}
