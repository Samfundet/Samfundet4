import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLoaderData, useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input, Textarea } from '~/Components';
import { postRecruitmentSeparatePosition, putRecruitmentSeparatePosition } from '~/api';
import type { RecruitmentSeparatePositionDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import type { SeparatePositionLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';
import { NON_EMPTY_STRING } from '~/schema/strings';
import { WEBSITE_URL } from '~/schema/url';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentSeparatePositionFormAdminPage.module.scss';

const schema = z.object({
  name_nb: NON_EMPTY_STRING,
  name_en: NON_EMPTY_STRING,
  description_nb: NON_EMPTY_STRING,
  description_en: NON_EMPTY_STRING,
  url: WEBSITE_URL,
});

type FormType = z.infer<typeof schema>;

export function RecruitmentSeparatePositionFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const title = `${t(KEY.common_create)} ${t(KEY.recruitment_position)}`;
  useTitle(title);

  // Form data
  const { recruitmentId, separatePositionId } = useParams();
  const data = useLoaderData() as SeparatePositionLoader | undefined;

  const form = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name_nb: data?.separatePosition?.name_nb ?? '',
      name_en: data?.separatePosition?.name_en ?? '',
      description_nb: data?.separatePosition?.description_nb ?? '',
      description_en: data?.separatePosition?.description_en ?? '',
      url: data?.separatePosition?.url ?? '',
    },
  });

  const submitText = separatePositionId ? t(KEY.common_save) : t(KEY.common_create);

  function handleOnSubmit(values: FormType) {
    const updatedPosition: RecruitmentSeparatePositionDto = {
      ...values,
      recruitment: data?.separatePosition?.recruitment ?? recruitmentId,
    };
    if (separatePositionId) {
      // Update page.
      putRecruitmentSeparatePosition(separatePositionId, updatedPosition)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_overview,
              urlParams: { recruitmentId: recruitmentId },
            }),
          );
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    } else {
      // Post new page.
      postRecruitmentSeparatePosition(updatedPosition)
        .then(() => {
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_overview,
              urlParams: { recruitmentId: recruitmentId },
            }),
          );
          toast.success(t(KEY.common_creation_successful));
        })
        .catch((error) => {
          toast.error(t(KEY.common_something_went_wrong));
          console.error(error);
        });
    }
  }

  return (
    <AdminPageLayout title={title} header={true}>
      <div className={styles.wrapper}>
        <Form {...form} schema={schema}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)}>
            <div className={styles.row}>
              <FormField
                control={form.control}
                name="name_nb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${t(KEY.common_name)} ${t(KEY.common_norwegian)}`}</FormLabel>
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
                  <FormItem>
                    <FormLabel>{`${t(KEY.common_name)} ${t(KEY.common_english)}`}</FormLabel>
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
                name="description_nb"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${t(KEY.common_short_description)} ${t(KEY.common_norwegian)}`}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description_en"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{`${t(KEY.common_short_description)} ${t(KEY.common_english)}`}</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className={styles.row}>
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.common_url)}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" theme="success" rounded={true}>
              {submitText}
            </Button>
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
