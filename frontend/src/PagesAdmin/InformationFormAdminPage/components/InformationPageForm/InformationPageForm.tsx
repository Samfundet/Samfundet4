import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Link,
  MarkdownEditor,
} from '~/Components';
import { buttonThemes } from '~/Components/Button/utils';
import { type Owner, OwnerField } from '~/PagesAdmin/InformationFormAdminPage/components';
import { useAuthContext } from '~/context/AuthContext';
import { useInfoPageMutations } from '~/domain';
import { INFO_PAGE_SLUG, TEXT, TITLE } from '~/domain/infopages/schema';
import type { EditInformationPageDto, InformationPageDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { hasPermissions, lowerCapitalize } from '~/utils';
import styles from './InformationPageForm.module.scss';

const schema = z.object({
  title_nb: TITLE,
  title_en: TITLE,
  text_nb: TEXT,
  text_en: TEXT,
  slug: INFO_PAGE_SLUG,
  owner: z.object({ type: z.enum(['gang', 'section']), id: z.number() }),
  visible: z.boolean(),
});

type SchemaType = z.infer<typeof schema>;

// A page is owned by its section when one is set, otherwise by its gang
function currentOwner(infoPage?: InformationPageDto): Owner | undefined {
  if (infoPage?.section) {
    return { type: 'section', id: infoPage.section.id };
  }
  if (infoPage?.gang) {
    return { type: 'gang', id: infoPage.gang.id };
  }
  return undefined;
}

type Props = {
  infoPage?: InformationPageDto;
  onSuccess?: (data: EditInformationPageDto) => void;
};

export function InformationPageForm({ infoPage, onSuccess }: Props) {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  const { user } = useAuthContext();

  const canDelete = useMemo(() => {
    return hasPermissions(user, [PERM.SAMFUNDET_DELETE_INFORMATIONPAGE], infoPage, true);
  }, [user, infoPage]);

  const [langTab, setLangTab] = useState('nb');

  const { createInfoPage, editInfoPage, deleteInfoPage } = useInfoPageMutations();

  const isSubmitting = createInfoPage.isPending || editInfoPage.isPending || deleteInfoPage.isPending;

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_nb: infoPage?.title_nb ?? '',
      title_en: infoPage?.title_en ?? '',
      slug: infoPage?.slug_field ?? '',
      text_nb: infoPage?.text_nb ?? '',
      text_en: infoPage?.text_en ?? '',
      owner: currentOwner(infoPage),
      visible: infoPage?.visible ?? true,
    },
  });

  const watchedFields = form.watch(['text_en', 'title_en', 'text_nb', 'title_nb']);
  const contentFields = useMemo(
    () => ({
      text_en: watchedFields[0],
      title_en: watchedFields[1],
      text_nb: watchedFields[2],
      title_nb: watchedFields[3],
    }),
    [watchedFields],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: t does not need to be in deplist
  const createLangTab = useCallback(
    (lang: 'nb' | 'en') => {
      const isMissing = contentFields[`text_${lang}`].trim() === '' || contentFields[`title_${lang}`].trim() === '';
      return (
        <Button type="button" onClick={() => setLangTab(lang)} theme={langTab === lang ? 'secondary' : 'ghost'}>
          {isMissing && <Icon icon="material-symbols:warning-outline-rounded" className={styles.warning} />}
          {t(lang === 'nb' ? KEY.common_norwegian : KEY.common_english)}
        </Button>
      );
    },
    [contentFields, langTab],
  );

  function onSubmit(values: SchemaType) {
    // Warn if one translation is much longer than the other, which usually means one of them is unfinished
    const nbChars = values.text_nb.length;
    const enChars = values.text_en.length;
    if (nbChars > 400 || enChars > 400) {
      const longest = Math.max(nbChars, enChars);
      const shortest = Math.min(nbChars, enChars);

      if (longest >= shortest * 3 && !window.confirm(t(KEY.admin_information_translations_difference))) {
        return;
      }
    }

    const data: EditInformationPageDto = {
      slug_field: values.slug,
      ...(values.owner.type === 'gang' ? { gang_id: values.owner.id } : { section_id: values.owner.id }),
      text_en: values.text_en,
      text_nb: values.text_nb,
      title_en: values.title_en,
      title_nb: values.title_nb,
      visible: values.visible,
    };

    if (infoPage) {
      editInfoPage.mutate({ slug: infoPage.slug_field, data }, { onSuccess: () => onSuccess?.(data) });
    } else {
      createInfoPage.mutate(data, { onSuccess: () => onSuccess?.(data) });
    }
  }

  function handleDelete() {
    if (infoPage && window.confirm(t(KEY.admin_information_confirm_delete))) {
      deleteInfoPage.mutate(infoPage.slug_field, {
        onSuccess: () => {
          navigate({ url: ROUTES_FRONTEND.admin_information });
        },
      });
    }
  }

  const actionRow = (
    <div className={styles.action_row}>
      <div className={styles.action_row_buttons}>
        {infoPage?.visible && (
          <Link
            url={reverse({
              pattern: ROUTES.frontend.information_page_detail,
              urlParams: { slugField: infoPage.slug_field },
            })}
            className={buttonThemes.secondary}
            plain
            target="external"
          >
            {t(KEY.common_show)}
            <Icon icon="tabler:external-link" />
          </Link>
        )}
      </div>
      <div className={styles.action_row_buttons}>
        {infoPage && canDelete && (
          <Button type="button" theme="ghost" className={styles.delete_btn} onClick={handleDelete}>
            <Icon icon="mdi:bin" />
            {t(KEY.common_delete)}
          </Button>
        )}

        <Button theme="primary" type="submit">
          <Icon icon="mdi:floppy-disk" />

          {infoPage ? t(KEY.common_save) : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.information_page)}`)}
        </Button>
      </div>
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.wrapper}>
          {actionRow}

          <span className={styles.box_label}>{t(KEY.common_general)}</span>
          <div className={styles.box}>
            <FormField
              control={form.control}
              disabled={isSubmitting}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.common_url)}</FormLabel>
                  <FormControl>
                    <Input type="text" className={styles.slug_input} {...field} />
                  </FormControl>
                  <div className={styles.slug_input_preview} style={field.value === '' ? { visibility: 'hidden' } : {}}>
                    {t(KEY.common_preview)}:{' '}
                    {window.location.host +
                      reverse({
                        pattern: ROUTES.frontend.information_page_detail,
                        urlParams: { slugField: field.value },
                      })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              disabled={isSubmitting}
              name="visible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.common_visible)}</FormLabel>
                  <div className={styles.hackgap} />
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      className={styles.checkbox}
                      boxClassName={styles.checkbox}
                      disabled={field.disabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              disabled={isSubmitting}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.owner)}</FormLabel>
                  <div className={styles.owner_field_container}>
                    <FormControl>
                      <OwnerField
                        currentGang={infoPage?.gang}
                        currentSection={infoPage?.section}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={field.disabled}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <span className={styles.box_label}>{t(KEY.common_content)}</span>
          <div className={classNames(styles.box, styles.content_box)}>
            <div className={styles.lang_tabs}>
              {createLangTab('nb')}
              {createLangTab('en')}
            </div>

            {(['nb', 'en'] as ('nb' | 'en')[]).map((lang) => (
              <div className={classNames(styles.lang_content, { [styles.hidden]: langTab !== lang })} key={lang}>
                <FormField
                  control={form.control}
                  disabled={isSubmitting}
                  name={`title_${lang}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {lowerCapitalize(
                          `${t(lang === 'nb' ? KEY.common_norwegian : KEY.common_english)} ${t(KEY.common_title)}`,
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  disabled={isSubmitting}
                  name={`text_${lang}`}
                  render={({ field: { value, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>
                        {lowerCapitalize(
                          `${t(lang === 'nb' ? KEY.common_norwegian : KEY.common_english)} ${t(KEY.common_content)}`,
                        )}
                      </FormLabel>
                      <FormControl>
                        <MarkdownEditor
                          defaultValue={value}
                          initialValue={infoPage?.[`text_${lang}`]}
                          {...fieldProps}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          {actionRow}
        </div>
      </form>
    </Form>
  );
}
