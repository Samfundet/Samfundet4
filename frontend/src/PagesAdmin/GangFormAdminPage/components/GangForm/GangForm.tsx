import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Button,
  Dropdown,
  FileInput,
  Form,
  FormBox,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '~/Components';
import { useAuthContext } from '~/context/AuthContext';
import { useGangMutations, useGetAdminInfoPages } from '~/domain';
import { useGetAdminGangTypes, useGetAdminGangs } from '~/domain/gangs/queries';
import { ABBREVIATION, GANG_INFO_PAGE, GANG_TYPE, LOGO_FILE, NAME } from '~/domain/gangs/schema';
import type { GangDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { PERM } from '~/permissions';
import { WEBSITE_URL } from '~/schema/url';
import { dbT, hasPermissions, lowerCapitalize } from '~/utils';
import styles from './GangForm.module.scss';

const schema = z.object({
  name_nb: NAME.min(1),
  name_en: NAME.min(1),
  abbreviation: ABBREVIATION.optional().or(z.literal('')),
  website: WEBSITE_URL.or(z.literal('')),
  info_page: GANG_INFO_PAGE.nullish().or(z.literal('')),
  organization: z.number(),
  gang_type: GANG_TYPE.nullish(),
  logo: LOGO_FILE.optional(),
});

type SchemaType = z.infer<typeof schema>;

type Props = {
  gang?: GangDto;
  onSuccess?: (id?: number) => void;
  onError?: () => void;
};

export function GangForm({ gang, onSuccess, onError }: Props) {
  const { t } = useTranslation();

  const { user } = useAuthContext();

  const canCreate = hasPermissions(user, [PERM.SAMFUNDET_ADD_GANG], undefined, true);
  const canChange = useMemo(() => {
    return hasPermissions(user, [PERM.SAMFUNDET_CHANGE_GANG], gang?.id, true);
  }, [gang, user]);
  const canDelete = useMemo(() => {
    return hasPermissions(user, [PERM.SAMFUNDET_DELETE_GANG], gang?.id, true);
  }, [gang, user]);

  const { data: infoPages, isLoading: infoPagesLoading } = useGetAdminInfoPages();
  const { data: gangs, isLoading: isOrganizationsLoading } = useGetAdminGangs();

  const organizations = useMemo(() => {
    return gangs?.map((org) => ({ id: org.id, name: org.name })) ?? [];
  }, [gangs]);

  const { createGang, editGang, deleteGang } = useGangMutations();

  const isSubmitting = createGang.isPending || editGang.isPending || deleteGang.isPending;

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want labels to be updated when language changes
  const infoPageOptions = useMemo(
    () => infoPages?.map((p) => ({ value: p.slug_field, label: dbT(p, 'title') as string })),
    [infoPages, t],
  );

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_nb: gang?.name_nb ?? '',
      name_en: gang?.name_en ?? '',
      abbreviation: gang?.abbreviation ?? '',
      website: gang?.webpage ?? '',
      organization: gang?.organization ?? undefined,
      info_page: gang?.info_page,
      gang_type: gang?.gang_type,
    },
  });

  const organizationId = form.watch('organization');

  const { data: gangTypes, isLoading: gangTypesLoading } = useGetAdminGangTypes(organizationId, {
    enabled: organizationId !== undefined,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: we want labels to be updated when language changes
  const gangTypeOptions = useMemo(
    () => gangTypes?.map((gt) => ({ value: gt.id, label: dbT(gt, 'title') as string })),
    [gangTypes, t],
  );

  function onSubmit(values: SchemaType) {
    if (gang) {
      editGang.mutate({ id: gang.id, data: values }, { onSuccess: () => onSuccess?.(gang.id), onError });
    } else {
      createGang.mutate(values, { onSuccess: (data) => onSuccess?.(data?.id), onError });
    }
  }

  function handleDelete() {
    if (!gang) {
      return;
    }
    deleteGang.mutate(gang.id, { onSuccess: () => onSuccess?.(), onError });
  }

  if ((!gang && !canCreate) || (gang && !canChange && !canDelete)) {
    return null;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormBox label={t(KEY.affiliation)}>
          <div className={styles.row}>
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>Organisasjon</FormLabel>
                  <FormControl>
                    <Dropdown
                      options={organizations.map((org) => ({ label: org.name, value: org.id }))}
                      disabled={isSubmitting}
                      nullOption={{
                        disabled: true,
                        label: lowerCapitalize(`${t(KEY.common_choose)} ${t(KEY.organization)}`),
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={styles.form_item}>
              {gangTypes && (
                <FormField
                  control={form.control}
                  name="gang_type"
                  disabled={organizationId === undefined || isOrganizationsLoading}
                  render={({ field }) => (
                    <FormItem className={styles.form_item}>
                      <FormLabel>{lowerCapitalize(t(KEY.common_gang_type))}</FormLabel>
                      <FormControl>
                        {gangTypesLoading || isOrganizationsLoading ? (
                          <>{t(KEY.common_loading)}...</>
                        ) : (
                          <Dropdown options={gangTypeOptions} {...field} />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        </FormBox>
        <FormBox label={t(KEY.common_general)}>
          <div className={styles.row}>
            <FormField
              control={form.control}
              name="name_nb"
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{lowerCapitalize(`${t(KEY.common_norwegian)} ${t(KEY.common_name)}`)}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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
                    <Input type="text" {...field} />
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
                    <Input type="text" {...field} />
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
                    <Input type="text" {...field} />
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
                    {infoPagesLoading ? (
                      <>{t(KEY.common_loading)}...</>
                    ) : (
                      <Dropdown options={infoPageOptions} nullOption={true} {...field} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              name="logo"
              control={form.control}
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{t(KEY.common_logo)}</FormLabel>
                  <FormControl>
                    <FileInput
                      type="file"
                      ref={field.ref}
                      onChange={field.onChange}
                      accept="image/png, image/gif, image/jpeg, image/webp, image/tiff"
                      showPreview
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </FormBox>

        <div className={styles.action_row}>
          {gang && canDelete && (
            <Button
              type="button"
              theme="ghost"
              disabled={isSubmitting}
              className={styles.delete_btn}
              onClick={handleDelete}
            >
              <Icon icon="mdi:bin" />
              {t(KEY.common_delete)}
            </Button>
          )}
          <Button type="submit" theme="primary" disabled={isSubmitting}>
            <Icon icon="mdi:floppy-disk" />
            {lowerCapitalize(`${t(gang ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_gang)}`)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
