import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Checkbox, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { getRecruitmentPosition, postRecruitmentPosition, putRecruitmentPosition } from '~/api';
import type { RecruitmentPositionDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentPositionFormAdminPage.module.scss';

const recruitmentPositionSchema = z.object({
  name_nb: z.string().min(1),
  name_en: z.string().min(1),
  norwegian_applicants_only: z.boolean(),
  short_description_nb: z.string().min(1),
  short_description_en: z.string().min(1),
  long_description_nb: z.string().min(1),
  long_description_en: z.string().min(1),
  is_funksjonaer_position: z.boolean(),
  default_application_letter_nb: z.string().min(1),
  default_application_letter_en: z.string().min(1),
  tags: z.string().optional(),
});

type RecruitmentPositionFormType = z.infer<typeof recruitmentPositionSchema>;

export function RecruitmentPositionFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { recruitmentId, gangId, positionId } = useParams();
  const [position, setPosition] = useState<Partial<RecruitmentPositionDto>>();

  useEffect(() => {
    if (positionId) {
      getRecruitmentPosition(positionId)
        .then((data) => {
          setPosition(data.data);
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
          navigate(
            reverse({
              pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
              urlParams: { recruitmentId, gangId },
            }),
            { replace: true },
          );
        });
    }
  }, [positionId, recruitmentId, gangId, navigate, t]);

  const initialData: Partial<RecruitmentPositionFormType> = {
    name_nb: position?.name_nb || '',
    name_en: position?.name_en || '',
    norwegian_applicants_only: position?.norwegian_applicants_only || false,
    short_description_nb: position?.short_description_nb || '',
    short_description_en: position?.short_description_en || '',
    long_description_nb: position?.long_description_nb || '',
    long_description_en: position?.long_description_en || '',
    is_funksjonaer_position: position?.is_funksjonaer_position || false,
    default_application_letter_nb: position?.default_application_letter_nb || '',
    default_application_letter_en: position?.default_application_letter_en || '',
    tags: position?.tags || '',
  };

  const form = useForm<RecruitmentPositionFormType>({
    resolver: zodResolver(recruitmentPositionSchema),
    defaultValues: initialData,
  });

  const title = positionId
    ? `${t(KEY.common_edit)} ${position?.name_nb}`
    : `${t(KEY.common_create)} ${t(KEY.recruitment_position)}`;

  useTitle(title);

  const submitText = positionId ? t(KEY.common_save) : t(KEY.common_create);

  function onSubmit(data: RecruitmentPositionFormType) {
    const updatedPosition = {
      ...data,
      gang: { id: Number.parseInt(gangId ?? '') },
      recruitment: recruitmentId ?? '',
      interviewers: [],
      section: null,
    };

    const action = positionId
      ? putRecruitmentPosition(positionId, updatedPosition)
      : postRecruitmentPosition(updatedPosition);

    action
      .then(() => {
        toast.success(positionId ? t(KEY.common_update_successful) : t(KEY.common_creation_successful));
        navigate(
          reverse({
            pattern: ROUTES.frontend.admin_recruitment_gang_position_overview,
            urlParams: { recruitmentId, gangId },
          }),
        );
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  return (
    <AdminPageLayout title={title} header={true}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.wrapper}>
            <Controller
              name="norwegian_applicants_only"
              control={form.control}
              render={({ field }) => (
                <FormItem className={styles.item}>
                  <FormLabel>{t(KEY.recruitment_norwegian_applicants_only)}</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={styles.row}>
              <FormField
                control={form.control}
                name="name_nb"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_name)} ${t(KEY.common_norwegian)}`}</FormLabel>
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
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_name)} ${t(KEY.common_english)}`}</FormLabel>
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
                name="short_description_nb"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_short_description)} ${t(KEY.common_norwegian)}`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="short_description_en"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_short_description)} ${t(KEY.common_english)}`}</FormLabel>
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
                name="long_description_nb"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_long_description)} ${t(KEY.common_norwegian)}`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="long_description_en"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.common_long_description)} ${t(KEY.common_english)}`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Controller
              name="is_funksjonaer_position"
              control={form.control}
              render={({ field }) => (
                <FormItem className={styles.item}>
                  <FormLabel>{t(KEY.recruitment_funksjonaer)}</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className={styles.row}>
              <FormField
                control={form.control}
                name="default_application_letter_nb"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.recrutment_default_application_letter)} ${t(KEY.common_norwegian)}`}</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="default_application_letter_en"
                render={({ field }) => (
                  <FormItem className={styles.item}>
                    <FormLabel>{`${t(KEY.recrutment_default_application_letter)} ${t(KEY.common_english)}`}</FormLabel>
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
              name="tags"
              render={({ field }) => (
                <FormItem className={styles.item}>
                  <FormLabel>{t(KEY.common_tags)}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">{submitText}</Button>
          </div>
        </form>
      </Form>
    </AdminPageLayout>
  );
}
