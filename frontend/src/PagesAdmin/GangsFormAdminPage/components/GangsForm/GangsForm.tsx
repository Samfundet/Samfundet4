import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { postGang, putGang } from '~/api';
import type { GangDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ABBREVIATION, NAME } from '~/schema/gang';
import { WEBSITE_URL } from '~/schema/url';
import { lowerCapitalize } from '~/utils';
import styles from './GangsForm.module.scss';

const schema = z.object({
  name_nb: NAME.min(1),
  name_en: NAME.min(1),
  abbreviation: ABBREVIATION.optional().or(z.literal('')),
  website: WEBSITE_URL,
});

type Props = {
  gang?: GangDto;
  onSuccess?: () => void;
  onError?: () => void;
};

export function GangsForm({ gang, onSuccess, onError }: Props) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_nb: gang?.name_nb ?? '',
      name_en: gang?.name_en ?? '',
      abbreviation: gang?.abbreviation ?? '',
      website: gang?.webpage ?? '',
    },
  });

  function onSubmit(values: z.infer<typeof schema>) {
    setSubmitting(true);
    const action = gang ? () => putGang(gang.id, values) : () => postGang(values);
    action()
      .then((res) => {
        if (res) {
          toast.success(t(KEY.common_save_successful));
          onSuccess?.();
        } else {
          toast.error(t(KEY.common_something_went_wrong));
          onError?.();
        }
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
        onError?.();
      })
      .finally(() => setSubmitting(false));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <FormField
            control={form.control}
            name="name_nb"
            render={({ field }) => (
              <FormItem className={styles.form_item}>
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
              <FormItem className={styles.form_item}>
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
              <FormItem className={styles.form_item}>
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
              <FormItem className={styles.form_item}>
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
          <Button type="submit" rounded={true} theme="green" disabled={submitting}>
            {lowerCapitalize(`${t(gang ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_gang)}`)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
