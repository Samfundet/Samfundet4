import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Input } from '~/Components';
import { Button } from '~/Components/Button';
import { Form, FormField, FormItem, FormLabel } from '~/Components/Forms';
import { FormControl } from '~/Components/Forms/Form';
import { connect_to_mdb } from '~/api';
import { KEY } from '~/i18n/constants';
import { PASSWORD, USERNAME } from '~/schema/user';
import { lowerCapitalize } from '~/utils';
import styles from './MDBConnectFormAdminPage.module.scss';
import { useTitle } from '~/hooks';

const schema = z.object({
  username: USERNAME, //Might want to create a new schema for email and/or MDB number
  password: PASSWORD,
});

export function MDBConnectForm() {
  const { t } = useTranslation();
  useTitle(t(KEY.adminpage_connect_mdb));

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    connect_to_mdb(values.username, values.password)
      .then((res) => {
        toast.success(t(KEY.adminpage_connect_mdb_succesful_toast));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) => {
          toast.error(error.username?.message);
          toast.error(error.password?.message);
          //Should probably add more information to the user here, like: username/mdb_id + error.message instead of just error.message
        })}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t(KEY.email_or_membership_number_message)}</FormLabel>
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
              <FormControl>
                <Input placeholder="" type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button className={styles.form_button} type="submit" theme="green" display="block" rounded={true}>
          {t(KEY.common_connect)}
        </Button>
      </form>
    </Form>
  );
}
