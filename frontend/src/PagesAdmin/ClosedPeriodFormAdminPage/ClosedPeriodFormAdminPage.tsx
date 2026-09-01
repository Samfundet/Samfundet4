import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Form, FormField, FormItem, FormLabel, Input, Textarea } from '~/Components';
import { FormControl, FormMessage } from '~/Components/Forms/Form';
import { DATE, MESSAGE, useCreateClosedPeriod, useGetClosedPeriod, useUpdateClosedPeriod } from '~/domain';
import { useCustomNavigate, useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './ClosedPeriodFormAdminPage.module.scss';

export function ClosedPeriodFormAdminPage() {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const schema = z
    .object({
      message_nb: MESSAGE,
      message_en: MESSAGE,
      start_dt: DATE,
      end_dt: DATE,
    })
    .refine((data) => data.end_dt > data.start_dt, {
      message: t(KEY.admin_closed_period_end_before_start),
      path: ['end_dt'],
    })
    .refine((data) => data.end_dt >= format(new Date(), 'yyyy-MM-dd'), {
      message: t(KEY.admin_closed_period_end_before_today),
      path: ['end_dt'],
    });

  type FormType = z.infer<typeof schema>;

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const { data: initialData, isLoading, isError } = useGetClosedPeriod(Number(id));

  useEffect(() => {
    if (id !== undefined && Number.isNaN(Number(id))) {
      navigate({ url: ROUTES.frontend.admin_closed, replace: true });
      return;
    }
    if (isError) {
      navigate({ url: ROUTES.frontend.admin_closed, replace: true });
      toast.error(t(KEY.common_something_went_wrong));
    }
  }, [id, isError, t, navigate]);

  const onSuccess = () => navigate({ url: -1 });

  const { mutate: createClosedPeriod } = useCreateClosedPeriod({ onSuccess });
  const { mutate: updateClosedPeriod } = useUpdateClosedPeriod({ onSuccess });

  function onSubmit(data: FormType) {
    if (id) {
      updateClosedPeriod({ id: Number(id), data });
    } else {
      createClosedPeriod(data);
    }
  }

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const title = id ? t(KEY.admin_closed_period_edit_period) : t(KEY.admin_closed_period_new_period);
  useTitle(title);

  return (
    <AdminPageLayout title={title} loading={isLoading} header={true}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.container}>
            <FormField
              control={form.control}
              name="message_nb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t(KEY.common_message)} {t(KEY.common_norwegian)}
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder={`${t(KEY.common_message)} ${t(KEY.common_norwegian)}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t(KEY.common_message)} {t(KEY.common_english)}
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder={`${t(KEY.common_message)} ${t(KEY.common_english)}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={styles.container}>
            <FormField
              control={form.control}
              name="start_dt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.start_date)}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_dt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.end_date)}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">{t(KEY.common_save)}</Button>
        </form>
      </Form>
    </AdminPageLayout>
  );
}
