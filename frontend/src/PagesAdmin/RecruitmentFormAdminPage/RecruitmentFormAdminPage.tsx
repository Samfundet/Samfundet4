import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Dropdown, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import type { DropDownOption } from '~/Components/Dropdown/Dropdown';
import { getOrganizations, postRecruitment, putRecruitment } from '~/api';
import type { OrganizationDto, RecruitmentDto } from '~/dto';
import { useTitle } from '~/hooks';
import { KEY } from '~/i18n/constants';
import type { RecruitmentLoader } from '~/router/loaders';
import { ROUTES } from '~/routes';
import { dbT, getObjectFieldOrNumber, lowerCapitalize, utcTimestampToLocal } from '~/utils';
import { AdminPageLayout } from '../AdminPageLayout/AdminPageLayout';
import styles from './RecruitmentFormAdminPage.module.scss';

const recruitmentSchema = z
  .object({
    name_nb: z.string().min(1, { message: 'Name in Norwegian is required' }),
    name_en: z.string().min(1, { message: 'Name in English is required' }),
    visible_from: z.string().min(1, { message: 'Visible from date is required' }),
    shown_application_deadline: z.string().min(1, { message: 'Shown application deadline is required' }),
    actual_application_deadline: z.string().min(1, { message: 'Actual application deadline is required' }),
    reprioritization_deadline_for_applicant: z
      .string()
      .min(1, { message: 'Reprioritization deadline for applicant is required' }),
    reprioritization_deadline_for_groups: z
      .string()
      .min(1, { message: 'Reprioritization deadline for groups is required' }),
    organization: z.number().min(1, { message: 'Organization is required' }),
    max_applications: z.number().optional(),
  })
  .refine(
    (data) => {
      const visibleFrom = new Date(data.visible_from);
      const shownApplicationDeadline = new Date(data.shown_application_deadline);
      const actualApplicationDeadline = new Date(data.actual_application_deadline);
      const reprioritizationDeadlineForApplicant = new Date(data.reprioritization_deadline_for_applicant);
      const reprioritizationDeadlineForGroups = new Date(data.reprioritization_deadline_for_groups);

      return (
        shownApplicationDeadline > visibleFrom &&
        actualApplicationDeadline > shownApplicationDeadline &&
        reprioritizationDeadlineForApplicant > actualApplicationDeadline &&
        reprioritizationDeadlineForGroups > reprioritizationDeadlineForApplicant
      );
    },
    {
      message: 'Dates must be in chronological order',
      path: ['dates'],
    },
  );

type FormType = z.infer<typeof recruitmentSchema>;

export function RecruitmentFormAdminPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useRouteLoaderData('recruitment') as RecruitmentLoader | undefined;

  const { recruitmentId } = useParams();
  const [organizationOptions, setOrganizationOptions] = useState<DropDownOption<number>[]>([]);

  useEffect(() => {
    getOrganizations().then((data) => {
      const organizations = data.map((organization: OrganizationDto) => ({
        label: organization.name,
        value: organization.id,
      }));
      setOrganizationOptions(organizations);
    });
  }, []);

  const initialData: Partial<FormType> = {
    name_nb: data?.recruitment?.name_nb || '',
    name_en: data?.recruitment?.name_en || '',
    visible_from: utcTimestampToLocal(data?.recruitment?.visible_from) || '',
    actual_application_deadline: utcTimestampToLocal(data?.recruitment?.actual_application_deadline) || '',
    shown_application_deadline: utcTimestampToLocal(data?.recruitment?.shown_application_deadline) || '',
    reprioritization_deadline_for_applicant:
      utcTimestampToLocal(data?.recruitment?.reprioritization_deadline_for_applicant) || '',
    reprioritization_deadline_for_groups:
      utcTimestampToLocal(data?.recruitment?.reprioritization_deadline_for_groups) || '',
    organization: getObjectFieldOrNumber<number>(data?.recruitment?.organization, 'id') || 1,
    max_applications: data?.recruitment?.max_applications,
  };

  const form = useForm<FormType>({
    resolver: zodResolver(recruitmentSchema),
    defaultValues: initialData,
  });

  const title = recruitmentId
    ? `${t(KEY.common_edit)} ${dbT(data?.recruitment, 'name')}`
    : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_recruitment)}`);

  useTitle(title);

  const submitText = recruitmentId ? t(KEY.common_save) : t(KEY.common_create);

  function onSubmit(data: FormType) {
    if (recruitmentId) {
      putRecruitment(recruitmentId, data as RecruitmentDto)
        .then(() => {
          toast.success(t(KEY.common_update_successful));
          navigate(ROUTES.frontend.admin_recruitment);
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    } else {
      postRecruitment(data as RecruitmentDto)
        .then(() => {
          toast.success(t(KEY.common_creation_successful));
          navigate(ROUTES.frontend.admin_recruitment);
        })
        .catch(() => {
          toast.error(t(KEY.common_something_went_wrong));
        });
    }
  }

  return (
    <AdminPageLayout title={title} header={true}>
      <div className={styles.wrapper}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.row}>
              <FormField
                control={form.control}
                name="name_nb"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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
                name="visible_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.recruitment_visible_from)}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={styles.row}>
              <FormField
                control={form.control}
                name="shown_application_deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.shown_application_deadline)}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="actual_application_deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.actual_application_deadline)}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={styles.row}>
              <FormField
                control={form.control}
                name="reprioritization_deadline_for_applicant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.reprioritization_deadline_for_applicant)}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="reprioritization_deadline_for_groups"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.reprioritization_deadline_for_groups)}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={styles.row}>
              <FormField
                control={form.control}
                name="max_applications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.max_applications)}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Controller
                name="organization"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.recruitment_organization)}</FormLabel>
                    <FormControl>
                      <Dropdown
                        options={organizationOptions}
                        onChange={(value) => field.onChange(value)}
                        initialValue={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">{submitText}</Button>
          </form>
        </Form>
      </div>
    </AdminPageLayout>
  );
}
