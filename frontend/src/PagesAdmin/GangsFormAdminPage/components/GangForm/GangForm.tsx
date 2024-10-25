import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Dropdown, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { getGangList, getInformationPages, postGang, putGang } from '~/api';
import type { GangDto, GangTypeDto, InformationPageDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { ABBREVIATION, GANG_INFO_PAGE, GANG_TYPE, NAME } from '~/schema/gang';
import { WEBSITE_URL } from '~/schema/url';
import { dbT, lowerCapitalize } from '~/utils';
import styles from './GangForm.module.scss';

const schema = z.object({
  name_nb: NAME.min(1),
  name_en: NAME.min(1),
  abbreviation: ABBREVIATION.optional().or(z.literal('')),
  website: WEBSITE_URL.or(z.literal('')),
  info_page: GANG_INFO_PAGE.optional(),
  gang_type: GANG_TYPE.optional(),
});

type Props = {
  gang?: GangDto;
  onSuccess?: () => void;
  onError?: () => void;
};

export function GangForm({ gang, onSuccess, onError }: Props) {
  const { t } = useTranslation();
  const [loadingInfoPages, setLoadingInfoPages] = useState(true);
  const [infoPages, setInfoPages] = useState<InformationPageDto[]>();
  const [loadingGangTypes, setLoadingGangTypes] = useState(true);
  const [gangTypes, setGangTypes] = useState<GangTypeDto[]>();

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoadingInfoPages(true);
    setLoadingGangTypes(true);
    getInformationPages()
      .then(setInfoPages)
      .finally(() => setLoadingInfoPages(false));
    getGangList()
      .then(setGangTypes)
      .finally(() => setLoadingGangTypes(false));
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want labels to be updated when language changes
  const infoPageOptions = useMemo(
    () => infoPages?.map((p) => ({ value: p.slug_field, label: dbT(p, 'title') as string })),
    [infoPages, t],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want labels to be updated when language changes
  const gangTypeOptions = useMemo(
    () => gangTypes?.map((gt) => ({ value: gt.id, label: dbT(gt, 'title') as string })),
    [gangTypes, t],
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_nb: gang?.name_nb ?? '',
      name_en: gang?.name_en ?? '',
      abbreviation: gang?.abbreviation ?? '',
      website: gang?.webpage ?? '',
      info_page: gang?.info_page,
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
        <div className={styles.row}>
          <FormField
            control={form.control}
            name="info_page"
            render={({ field }) => (
              <FormItem className={styles.form_item}>
                <FormLabel>{lowerCapitalize(t(KEY.information_page))}</FormLabel>
                <FormControl>
                  {loadingInfoPages ? (
                    <>{t(KEY.common_loading)}...</>
                  ) : (
                    <Dropdown
                      defaultValue={infoPageOptions?.find((o) => o.value === gang?.info_page)}
                      options={infoPageOptions}
                      {...field}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gang_type"
            render={({ field }) => (
              <FormItem className={styles.form_item}>
                <FormLabel>{lowerCapitalize(t(KEY.common_gang_type))}</FormLabel>
                <FormControl>
                  {loadingGangTypes ? (
                    <>{t(KEY.common_loading)}...</>
                  ) : (
                    <Dropdown
                      defaultValue={gangTypeOptions?.find((o) => o.value === gang?.gang_type)}
                      options={gangTypeOptions}
                      {...field}
                    />
                  )}
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
