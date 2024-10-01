import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import type { GangLoader } from '~/router/loaders';
import { ABBREVIATION, NAME } from '~/schema/gang';
import { WEBSITE_URL } from '~/schema/url';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './GangsFormAdminPage.module.scss';

const schema = z.object({
  name_nb: NAME.min(1),
  name_en: NAME.min(1),
  abbreviation: ABBREVIATION.optional().or(z.literal('')),
  website: WEBSITE_URL,
});

export function GangsFormAdminPage() {
  const { t } = useTranslation();
  const data = useLoaderData() as GangLoader | undefined;

  //TODO add permissions on render

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_nb: data?.gang?.name_nb ?? '',
      name_en: data?.gang?.name_en ?? '',
      abbreviation: data?.gang?.abbreviation ?? '',
      website: data?.gang?.webpage ?? '',
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    console.log('Values:', values);
  }

  const title = lowerCapitalize(`${t(data?.gang ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_gang)}`);
  useTitle(title);

  return (
    <AdminPageLayout title={title} header={true}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className={styles.row}>
            <FormField
              control={form.control}
              name="name_nb"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lowerCapitalize(`${t(KEY.common_norwegian)} ${t(KEY.common_name)}`)}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lowerCapitalize(`${t(KEY.common_english)} ${t(KEY.common_name)}`)}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={styles.row}>
            <FormField
              control={form.control}
              name="abbreviation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lowerCapitalize(t(KEY.admin_gangsadminpage_abbreviation))}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{lowerCapitalize(t(KEY.admin_gangsadminpage_webpage))}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className={styles.action_row}>
            <Button type="submit" rounded={true} theme="green">
              {lowerCapitalize(`${t(data?.gang ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_gang)}`)}
            </Button>
          </div>
        </form>
      </Form>
    </AdminPageLayout>
  );
}
