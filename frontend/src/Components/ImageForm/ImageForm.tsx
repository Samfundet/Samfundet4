import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { z } from 'zod';
import {
  Button,
  FileInput,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  TagChipInput,
} from '~/Components';
import { FormDescription } from '~/Components/Forms/Form';
import type { LinkTarget } from '~/Components/Link/Link';
import { Link } from '~/Components/Link/Link';
import { useAuthContext } from '~/context/AuthContext';
import { IMAGE_FILE, TAGS, TITLE, useImageMutations } from '~/domain';
import type { ImageDto, ImageReferenceDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { handleServerFormErrors, hasPermissions, lowerCapitalize } from '~/utils';
import styles from './ImageForm.module.scss';

const schema = z.object({
  file: IMAGE_FILE.optional(),
  title: TITLE,
  tags: TAGS,
});

type SchemaType = z.infer<typeof schema>;

type ImageFormProps = {
  image?: ImageDto;
  onCreated?: (image: ImageDto) => void;
};

function imageReferenceToLink(reference: ImageReferenceDto): { label: string; url: string; target: LinkTarget } {
  switch (reference.model) {
    case 'event':
      return {
        label: `Event: ${reference.label}`,
        url: reverse({
          pattern: ROUTES.frontend.admin_events_edit,
          urlParams: { id: reference.id },
        }),
        target: 'frontend',
    };
    case 'gang_section':
        return {
      label: `Gang section: ${reference.label}`,
      url: reference.admin_url ?? `/admin/samfundet/gangsection/${reference.id}/change/`,
      target: 'backend',
    };
    case 'blog_post':
      return {
        label: `Blog post: ${reference.label}`,
        url: reference.admin_url ?? `/admin/samfundet/blogpost/${reference.id}/change/`,
        target: 'backend',
      };
    case 'infobox':
      return {
        label: `Infobox: ${reference.label}`,
        url: reference.admin_url ?? `/admin/samfundet/infobox/${reference.id}/change/`,
        target: 'backend',
      };
    case 'merch':
      return {
        label: `Merch: ${reference.label}`,
        url: reference.admin_url ?? `/admin/samfundet/merch/${reference.id}/change/`,
        target: 'backend',
      };
    default:
      return {
        label: `Default: ${reference.model}: ${reference.label}`,
        url: reference.admin_url ?? `/admin/samfundet/${reference.model}/${reference.id}/change/`,
        target: 'backend',
      };
  }
}

export function ImageForm({ image, onCreated }: ImageFormProps) {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const { createImage, editImage, deleteImage } = useImageMutations();

  const { user } = useAuthContext();
  const location = useLocation();

  const canCreate = hasPermissions(user, [PERM.SAMFUNDET_ADD_IMAGE], undefined, true);
  const canChange = useMemo(() => {
    return hasPermissions(user, [PERM.SAMFUNDET_CHANGE_IMAGE], image?.id, true);
  }, [user, image]);
  const canDelete = useMemo(() => {
    return hasPermissions(user, [PERM.SAMFUNDET_DELETE_IMAGE], image?.id, true);
  }, [user, image]);

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: image?.title ?? '',
      tags: image?.tags.map((t) => t.name) ?? [],
    },
  });

  if ((!image && !canCreate) || (image && !canChange && !canDelete)) {
    return null;
  }

  function onSubmit(values: SchemaType) {
    const data = {
      title: values.title.trim(),
      tag_string: values.tags.join(','),
      file: values.file,
    };

    if (image) {
      editImage.mutate({ id: image.id, data });
      return;
    }

    if (!values.file) {
      // file is required when creating a new image
      form.setError('file', { message: t(KEY.common_required) });
      return;
    }

    createImage.mutate(
      {
        ...data,
        file: values.file,
      },
      {
        onSuccess: (image) => {
          onCreated?.(image);
        },
        onError: (err) => {
          handleServerFormErrors(err, form);
        },
      },
    );
  }

  function handleDelete() {
    if (image && window.confirm(t(KEY.admin_images_confirm_delete))) {
      deleteImage.mutate(image.id, {
        onSuccess: () => {
          navigate({ url: ROUTES.frontend.admin_images });
        },
      });
    }
  }

  const submitText = image ? t(KEY.common_save) : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_image)}`);

  const isSubmitting = createImage.isPending || editImage.isPending || deleteImage.isPending;

  const references = image?.references ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {((image && canChange) || (!image && canCreate)) && (
          <>
            <FormField
              name="file"
              control={form.control}
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{t(KEY.common_image)}</FormLabel>
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

            <FormField
              name="title"
              control={form.control}
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{t(KEY.common_name)}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="tags"
              control={form.control}
              disabled={isSubmitting}
              render={({ field }) => (
                <FormItem className={styles.form_item}>
                  <FormLabel>{t(KEY.common_tags)}</FormLabel>
                  <FormDescription>{t(KEY.admin_image_form_tag_description)}</FormDescription>
                  <FormControl>
                    <TagChipInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {image && references.length !== 0 && (
          <section className={styles.referencesSection}>
            <label className={styles.referenceLabel}>{t(KEY.common_bound_by)}:</label>
            <ul className={styles.referenceList}>
              {references.map((reference) => {
                const { label, url } = imageReferenceToLink(reference);
                return (
                  <li className={styles.referenceItem} key={`${reference.model}-${reference.id}`}>
                    <Link
                      url={url}
                      state={{
                        returnTo: `${location.pathname}${location.search}${location.hash}`,
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <div className={styles.action_row}>
          {image && canDelete && (
            <Button
              type="button"
              theme="danger"
              disabled={isSubmitting}
              className={styles.delete_btn}
              onClick={handleDelete}
            >
              <Icon icon="mdi:bin" />
              {t(KEY.common_delete)}
            </Button>
          )}
          {(canChange || canCreate) && (
            <Button type="submit" theme="success" disabled={isSubmitting}>
              <Icon icon="mdi:floppy-disk" />
              {submitText}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
