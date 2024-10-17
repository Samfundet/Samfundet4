import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useRouteLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
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
import { type recruitmentFormType, recruitmentSchema } from './recruitmentSchema';

export type RecruitmentFormType = {
  name_nb: string;
  name_en: string;
  visible_from: string;
  shown_application_deadline: string;
  actual_application_deadline: string;
  reprioritization_deadline_for_applicant: string;
  reprioritization_deadline_for_groups: string;
  organization: number;
  promo_media: string;
};

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

  const initialData: Partial<recruitmentFormType> = {
    name_nb: data?.recruitment?.name_nb || '',
    name_en: data?.recruitment?.name_en || '',
    visible_from: utcTimestampToLocal(data?.recruitment?.visible_from, false) || '',
    actual_application_deadline: utcTimestampToLocal(data?.recruitment?.actual_application_deadline, false) || '',
    shown_application_deadline: utcTimestampToLocal(data?.recruitment?.shown_application_deadline, false) || '',
    reprioritization_deadline_for_applicant:
      utcTimestampToLocal(data?.recruitment?.reprioritization_deadline_for_applicant, false) || '',
    reprioritization_deadline_for_groups:
      utcTimestampToLocal(data?.recruitment?.reprioritization_deadline_for_groups, false) || '',
    organization: getObjectFieldOrNumber<number>(data?.recruitment?.organization, 'id') || 1,
    max_applications: data?.recruitment?.max_applications,
  };

  const form = useForm<recruitmentFormType>({
    resolver: zodResolver(recruitmentSchema),
    defaultValues: initialData,
  });

  const title = recruitmentId
    ? `${t(KEY.common_edit)} ${dbT(data?.recruitment, 'name')}`
    : lowerCapitalize(`${t(KEY.common_create)} ${t(KEY.common_recruitment)}`);

  useTitle(title);

  const submitText = recruitmentId ? t(KEY.common_save) : t(KEY.common_create);

  function onSubmit(data: recruitmentFormType) {
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.wrapper}>
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
                name="visible_from"
                render={({ field }) => (
                  <FormItem className={styles.item}>
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
                  <FormItem className={styles.item}>
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
                  <FormItem className={styles.item}>
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
                  <FormItem className={styles.item}>
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
                  <FormItem className={styles.item}>
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
                  <FormItem className={styles.item}>
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
                  <FormItem className={styles.item}>
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
          </div>
        </form>
      </Form>
    </AdminPageLayout>
  );
}
