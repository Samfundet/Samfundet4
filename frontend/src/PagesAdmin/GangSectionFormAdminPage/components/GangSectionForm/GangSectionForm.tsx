import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Button,
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
import { useGangSectionMutations } from '~/domain/gangsection/mutations';
import { LOGO_FILE, NAME } from '~/domain/gangsection/schema';
import type { GangDto, GangSectionDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { PERM } from '~/permissions';
import { dbT, hasPermissions, lowerCapitalize } from '~/utils';
import styles from './GangSectionForm.module.scss';

type Props = {
  gang: GangDto;
  section?: GangSectionDto;
  onSuccess?: (id?: number) => void;
  onError?: () => void;
};

const schema = z.object({
  name_nb: NAME,
  name_en: NAME,
  logo: LOGO_FILE.optional(),
});

type SchemaType = z.infer<typeof schema>;

export function GangSectionForm({ gang, section, onSuccess, onError }: Props) {
  const { t } = useTranslation();
  const { user } = useAuthContext();

  const { createGangSection, editGangSection, deleteGangSection } = useGangSectionMutations();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_nb: section?.name_nb ?? '',
      name_en: section?.name_en ?? '',
    },
  });

  const canDelete = useMemo(() => {
    return hasPermissions(user, [PERM.SAMFUNDET_DELETE_GANGSECTION], section?.id, true);
  }, [section, user]);

  const isSubmitting = false;

  function handleDelete() {
    if (section && canDelete && window.confirm(`${t(KEY.form_confirm_delete)} ${dbT(section, 'name')}`)) {
      deleteGangSection.mutate(gang.id, { onSuccess: () => onSuccess?.(), onError });
    }
  }

  function onSubmit(values: SchemaType) {
    const data = { ...values, gang: gang.id };
    console.log(data);
    if (section) {
      editGangSection.mutate({ id: section.id, data }, { onSuccess: () => onSuccess?.(), onError });
    } else {
      createGangSection.mutate(data, { onSuccess: (data) => onSuccess?.(data?.id), onError });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormBox>
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
        </FormBox>

        <div className={styles.action_row}>
          {section && canDelete && (
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
            {lowerCapitalize(`${t(section ? KEY.common_edit : KEY.common_create)} ${t(KEY.common_section)}`)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
