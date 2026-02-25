import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PASSWORD, USERNAME } from '~/schema/user';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KEY } from '~/i18n/constants';
import { connect_to_mdb } from '~/api';
import { toast } from 'react-toastify';
import { Form, FormField, FormItem, FormLabel } from '~/Components/Forms';
import { Input } from '~/Components';
import { Button } from '~/Components/Button';
import { lowerCapitalize } from '~/utils';
import { FormControl, FormDescription } from '~/Components/Forms/Form';
import styles from './MDBConnectFormAdminPage.module.scss';

const schema = z.object({
    username: USERNAME, //Might want to create a new schema for email and/or MDB number
    password: PASSWORD,
});

export function MDBConnectForm() {
    const { t } = useTranslation();

    const form = useForm < z.infer < typeof schema >> ({
        resolver: zodResolver(schema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    function onSubmit(values: z.infer<typeof schema>) {
    connect_to_mdb(values.username,values.password).then(res=>{
      toast.success(t(KEY.adminpage_connect_mdb_succesful_toast))
    })
    .catch((error)=>{
      toast.error(error.response.data.message)
    })
    }

    return <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (error) => {
                toast.error(error.username?.message)
                toast.error(error.password?.message) 
                //Should probably add more information to the user here, like: username/mdb_id + error.message instead of just error.message
            })}>
                <FormField
                    control={form.control}
                    name='username'
                    render={({ field }) => (
                        <FormItem className={styles.input_element}>
                            <FormLabel>{t(KEY.email_or_membership_number_message)}</FormLabel>
                            <FormControl>
                                <Input placeholder='' {...field}/>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem className={styles.input_element}>
                            <FormLabel>{lowerCapitalize(t(KEY.common_password))}</FormLabel>
                            <FormControl>
                                <Input placeholder='' {...field}/>
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type='submit' theme='green' display='block'>
                    {t(KEY.common_connect)}
                </Button>
            </form>
    </Form>
}

