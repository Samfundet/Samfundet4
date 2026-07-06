import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
import { useImageMutations } from '~/Components/ImageForm/useImageMutations';
import { useAuthContext } from '~/context/AuthContext';
import type { ImageDto } from '~/dto';
import { useCustomNavigate } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { PERM } from '~/permissions';
import { ROUTES } from '~/routes';
import { ROUTES_FRONTEND } from '~/routes/frontend';
import { IMAGE_FILE, TAGS, TITLE } from '~/schema/image';
import { handleServerFormErrors, hasPermissions } from '~/utils';
import styles from './ImageForm.module.scss';

const schema = z.object({
  file: IMAGE_FILE.optional(),
  title: TITLE,
  tags: TAGS,
});

type SchemaType = z.infer<typeof schema>;

type ImageFormProps = {
  image?: ImageDto;
};

export function ImageForm({ image }: ImageFormProps) {
  const { t } = useTranslation();
  const navigate = useCustomNavigate();
  const { postMutation, patchMutation, deleteMutation } = useImageMutations();

  const { user } = useAuthContext();

  const canCreate = hasPermissions(user, [PERM.SAMFUNDET_ADD_IMAGE], undefined, true);
  const canChange = hasPermissions(user, [PERM.SAMFUNDET_CHANGE_IMAGE], undefined, true);
  const canDelete = hasPermissions(user, [PERM.SAMFUNDET_DELETE_IMAGE], undefined, true);

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
      patchMutation.mutate({ id: image.id, data });
      return;
    }

    if (!values.file) {
      // file is required when creating a new image
      form.setError('file', { message: t(KEY.common_required) });
      return;
    }

    postMutation.mutate(
      {
        ...data,
        file: values.file,
      },
      {
        onSuccess: (data) => {
          navigate({
            url: reverse({
              pattern: ROUTES_FRONTEND.admin_images_detail,
              urlParams: { id: data.id },
            }),
          });
        },
        onError: (err) => {
          handleServerFormErrors(err, form);
        },
      },
    );
  }

  function handleDelete() {
    if (image && window.confirm(t(KEY.admin_images_confirm_delete) ?? '')) {
      deleteMutation.mutate(image.id, {
        onSuccess: () => {
          navigate({ url: ROUTES.frontend.admin_images });
        },
      });
    }
  }

  const isSubmitting = postMutation.isPending || patchMutation.isPending || deleteMutation.isPending;

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

        <div className={styles.action_row}>
          {image && canDelete && (
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
          {canChange && (
            <Button type="submit" theme="primary" disabled={isSubmitting}>
              <Icon icon="mdi:floppy-disk" />
              {t(KEY.common_save)}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
