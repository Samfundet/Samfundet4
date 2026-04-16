import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from '~/Components';
import { ImagePicker } from '~/Components/ImagePicker/ImagePicker';
import { getImage, getInfobox, postInfobox, putInfobox } from '~/api';
import type { ImageDto, InfoboxDto } from '~/dto';
import { useCustomNavigate, useTitle } from '~/hooks';
import { STATUS } from '~/http_status_codes';
import { KEY } from '~/i18n/constants';
import { infoboxKeys } from '~/queryKeys';
import { ROUTES } from '~/routes';
import { WEBSITE_URL } from '~/schema/url';
import { lowerCapitalize } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './InfoboxFormAdminPage.module.scss';

const schema = z.object({
  title_nb: z.string().min(1),
  text_nb: z.string().min(1),
  title_en: z.string().min(1),
  text_en: z.string().min(1),
  color: z.string().min(1),
  url: WEBSITE_URL.or(z.literal('')).optional(),
  image: z.custom<ImageDto>().optional(),
});

type InfoboxFormType = z.infer<typeof schema>;

function normalizeWebsiteUrl(url?: string): string | null {
  const raw = url?.trim();
  if (!raw) {
    return null;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  return `https://${raw}`;
}

export function InfoboxFormAdminPage() {
  const navigate = useCustomNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const infoboxId = id ? Number(id) : undefined;

  const form = useForm<InfoboxFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      title_nb: '',
      text_nb: '',
      title_en: '',
      text_en: '',
      color: '',
      url: '',
      image: undefined,
    },
  });

  const {
    data: editData,
    isLoading: isLoadingEdit,
    error: editQueryError,
  } = useQuery({
    enabled: infoboxId !== undefined,
    queryKey: infoboxId !== undefined ? [...infoboxKeys.detail(infoboxId), 'form'] : [...infoboxKeys.all, 'new'],
    queryFn: async () => {
      if (infoboxId === undefined) {
        return undefined;
      }

      const infobox = await getInfobox(infoboxId);
      const image = infobox.image ? await getImage(infobox.image).catch(() => undefined) : undefined;
      return { infobox, image };
    },
  });

  useEffect(() => {
    if (!editData) {
      return;
    }

    form.reset({
      title_nb: editData.infobox.title_nb ?? '',
      text_nb: editData.infobox.text_nb ?? '',
      title_en: editData.infobox.title_en,
      text_en: editData.infobox.text_en,
      color: editData.infobox.color,
      url: editData.infobox.url ?? '',
      image: editData.image,
    });
  }, [editData, form]);

  useEffect(() => {
    const error = editQueryError as AxiosError | null;
    if (!error) {
      return;
    }

    if (error.request && error.request.status === STATUS.HTTP_404_NOT_FOUND) {
      navigate({ url: ROUTES.frontend.admin_infobox, replace: true });
      return;
    }

    toast.error(t(KEY.common_something_went_wrong));
  }, [editQueryError, navigate, t]);

  const createMutation = useMutation({
    mutationFn: postInfobox,
    onSuccess: () => {
      toast.success(t(KEY.common_creation_successful));
      queryClient.invalidateQueries({ queryKey: infoboxKeys.all });
      navigate({ url: ROUTES.frontend.admin_infobox });
    },
    onError: (error) => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, payload }: { itemId: number; payload: Partial<InfoboxDto> }) => putInfobox(itemId, payload),
    onSuccess: () => {
      toast.success(t(KEY.common_update_successful));
      queryClient.invalidateQueries({ queryKey: infoboxKeys.all });
      navigate({ url: ROUTES.frontend.admin_infobox });
    },
    onError: (error) => {
      toast.error(t(KEY.common_something_went_wrong));
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const showSpinner = isLoadingEdit || isSubmitting;

  const submitText = id ? t(KEY.common_save) : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.admin_infobox)}`);
  const title = id
    ? lowerCapitalize(`${t(KEY.common_edit)} ${t(KEY.admin_infobox)}`)
    : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.admin_infobox)}`);
  useTitle(title);

  function handleOnSubmit(data: InfoboxFormType) {
    const payload: Partial<InfoboxDto> = {
      title_nb: data.title_nb,
      text_nb: data.text_nb,
      title_en: data.title_en,
      text_en: data.text_en,
      color: data.color,
      url: normalizeWebsiteUrl(data.url),
      image: data.image?.id ?? null,
    };

    if (infoboxId !== undefined) {
      updateMutation.mutate({ itemId: infoboxId, payload });
      return;
    }

    createMutation.mutate(payload);
  }

  return (
    <AdminPageLayout title={title} loading={showSpinner} header={true}>
      <Form {...form} schema={schema}>
        <form onSubmit={form.handleSubmit(handleOnSubmit)} className={styles.form}>
          <div className={styles.wrapper}>
            <div className={styles.input_row}>
              <FormField
                control={form.control}
                name="title_nb"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_norwegian)} ${t(KEY.common_title)}`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title_en"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_english)} ${t(KEY.common_title)}`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={styles.input_row}>
              <FormField
                control={form.control}
                name="text_nb"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_norwegian)} ${t(KEY.common_description)}`}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="text_en"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_english)} ${t(KEY.common_description)}`}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={styles.input_row}>
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{t(KEY.common_color)}</FormLabel>
                    <FormControl>
                      <div className={styles.color_input_row}>
                        <div
                          className={styles.color_preview}
                          style={{ backgroundColor: field.value || 'transparent' }}
                          title={field.value || t(KEY.common_color)}
                        />
                        <Input type="text" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{t(KEY.common_url)}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.common_image)}</FormLabel>
                  <FormControl>
                    <ImagePicker selectedImage={field.value} onSelected={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={styles.action_row}>
              <Button type="submit" theme="green" rounded={true} disabled={isSubmitting}>
                {submitText}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </AdminPageLayout>
  );
}
