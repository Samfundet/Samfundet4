import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Button,
  Dropdown,
  FileInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Link,
} from '~/Components';
import { buttonThemes } from '~/Components/Button/utils';
import { FormDescription } from '~/Components/Forms/Form';
import { BACKEND_DOMAIN } from '~/constants';
import { useAuthContext } from '~/context/AuthContext';
import {
  CATEGORY,
  FILE,
  PUBLICATION_DATE,
  TITLE_EN,
  TITLE_NB,
  useCaseDocumentMutations,
  useGetCaseDocumentCategories,
} from '~/domain';
import type { CaseDocumentDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { PERM } from '~/permissions';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { hasPermissions, lowerCapitalize, utcTimestampToLocal } from '~/utils';
import styles from './CaseDocumentForm.module.scss';

const schema = z.object({
  title_nb: TITLE_NB,
  title_en: TITLE_EN,
  category: CATEGORY,
  publication_date: PUBLICATION_DATE,
  file: FILE.optional(),
});

type SchemaType = z.infer<typeof schema>;

type CaseDocumentFormProps = {
  document?: CaseDocumentDto;
};

export function CaseDocumentForm({ document }: CaseDocumentFormProps) {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();

  const { editCaseDocument, createCaseDocument, deleteCaseDocument } = useCaseDocumentMutations();

  const { data: categories, isLoading: categoriesLoading } = useGetCaseDocumentCategories();

  const { user } = useAuthContext();

  const canCreate = hasPermissions(user, [PERM.SAMFUNDET_ADD_SAKSDOKUMENT], undefined, true);
  const canChange = hasPermissions(user, [PERM.SAMFUNDET_CHANGE_SAKSDOKUMENT], undefined, true);
  const canDelete = hasPermissions(user, [PERM.SAMFUNDET_DELETE_SAKSDOKUMENT], undefined, true);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_nb: document?.title_nb || '',
      title_en: document?.title_en || '',
      category: document?.category || '',
      publication_date: document?.publication_date ? utcTimestampToLocal(document.publication_date, false) : '',
    },
  });

  function onSubmit(values: SchemaType) {
    const data = {
      title_nb: values.title_nb,
      title_en: values.title_en,
      category: values.category,
      publication_date: values.publication_date,
    };

    if (document) {
      editCaseDocument.mutate(
        { id: document.id, data },
        {
          onSuccess: (data) => {
            navigate({ url: ROUTES_FRONTEND.admin_casedocuments });
          },
        },
      );
      return;
    }

    if (!values.file) {
      form.setError('file', { message: t(KEY.common_required) });
      return;
    }

    createCaseDocument.mutate(
      {
        ...data,
        file: values.file,
      },
      {
        onSuccess: (data) => {
          navigate({ url: ROUTES_FRONTEND.admin_casedocuments });
        },
      },
    );
  }

  function handleDelete() {
    if (document && window.confirm(t(KEY.admin_casedocuments_confirm_delete))) {
      deleteCaseDocument.mutate(document.id, {
        onSuccess: () => {
          navigate({ url: ROUTES_FRONTEND.admin_casedocuments });
        },
      });
    }
  }

  const submitText = document
    ? t(KEY.common_save)
    : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.admin_casedocument)}`);

  const isSubmitting = false;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <FormField
            name="title_nb"
            control={form.control}
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem className={styles.form_item}>
                <FormLabel>{lowerCapitalize(`${t(KEY.common_norwegian)} ${t(KEY.common_title)}`)}</FormLabel>
                <FormDescription>{t(KEY.admin_casedocuments_title_used_as_filename)}</FormDescription>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="title_en"
            control={form.control}
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem className={styles.form_item}>
                <FormLabel>{lowerCapitalize(`${t(KEY.common_english)} ${t(KEY.common_title)}`)}</FormLabel>
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
            name="category"
            control={form.control}
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem className={styles.form_item}>
                <FormLabel>{t(KEY.category)}</FormLabel>
                <FormControl>
                  <Dropdown options={categories ?? []} nullOption {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="publication_date"
            control={form.control}
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem className={styles.form_item}>
                <FormLabel>{t(KEY.common_publication_date)}</FormLabel>
                <FormDescription>{t(KEY.admin_casedocuments_publication_date_note)}</FormDescription>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {document ? (
          <>
            <p className={styles.cannot_reupload}>{t(KEY.admin_casedocuments_cannot_reupload)}</p>
            {document.url && (
              <Link url={BACKEND_DOMAIN + document.url} plain className={buttonThemes.secondary} target="external">
                <Icon icon="mdi:external-link" />
                {lowerCapitalize(`${t(KEY.common_open)} ${t(KEY.common_file)}`)}
              </Link>
            )}
          </>
        ) : (
          <FormField
            name="file"
            control={form.control}
            disabled={isSubmitting}
            render={({ field }) => (
              <FormItem className={styles.form_item}>
                <FormLabel>{t(KEY.common_file)}</FormLabel>
                <FormControl>
                  <FileInput
                    type="file"
                    ref={field.ref}
                    onChange={field.onChange}
                    accept="application/pdf"
                    showPreview
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className={styles.action_row}>
          {document && canDelete && (
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
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
