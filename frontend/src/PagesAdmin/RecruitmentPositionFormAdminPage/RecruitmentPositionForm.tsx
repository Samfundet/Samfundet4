import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
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
  Textarea,
} from '~/Components';
import { MultiSelect } from '~/Components/MultiSelect';
import { postRecruitmentPosition, putRecruitmentPosition } from '~/api';
import type { RecruitmentPositionDto, UserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { NON_EMPTY_STRING } from '~/schema/strings';
import styles from './RecruitmentPositionFormAdminPage.module.scss';

const schema = z.object({
  name_nb: NON_EMPTY_STRING,
  name_en: NON_EMPTY_STRING,
  norwegian_applicants_only: z.boolean(),
  short_description_nb: NON_EMPTY_STRING,
  short_description_en: NON_EMPTY_STRING,
  long_description_nb: NON_EMPTY_STRING,
  long_description_en: NON_EMPTY_STRING,
  is_funksjonaer_position: z.boolean(),
  default_application_letter_nb: NON_EMPTY_STRING,
  default_application_letter_en: NON_EMPTY_STRING,
  tags: NON_EMPTY_STRING,
  interviewer_ids: z.array(z.number()).optional().nullable(),
});

type SchemaType = z.infer<typeof schema>;

interface FormProps {
  initialData: Partial<RecruitmentPositionDto>;
  positionId?: string;
  recruitmentId?: string;
  gangId?: string;
  users?: Partial<UserDto[]>;
}

export function RecruitmentPositionForm({ initialData, positionId, recruitmentId, gangId, users }: FormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });

  const submitText = positionId ? t(KEY.common_save) : t(KEY.common_create);

  const onSubmit = (data: SchemaType) => {
    const updatedPosition = {
      ...data,
      gang: { id: Number.parseInt(gangId ?? '') },
      recruitment: recruitmentId ?? '',
      interviewer_ids: data.interviewer_ids || [],
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
  };

  useEffect(() => {
    form.reset({
      ...initialData,
      interviewer_ids: initialData.interviewers?.map((interviewer) => interviewer.id) || [],
    });
  }, [initialData, form]);

  // Convert users array to dropdown options
  const interviewerOptions =
    users
      ?.filter((user) => user?.id && (user?.username || user?.first_name))
      .map((user) => ({
        value: user?.id,
        label: user?.username || `${user?.first_name} ${user?.last_name}`,
      })) || [];

  // Get currently selected interviewers
  const selectedInterviewers = form.watch('interviewer_ids') || [];

  return (
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
                    <Textarea {...field} />
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
                    <Textarea {...field} />
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
                    <Textarea {...field} />
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
                    <Textarea {...field} />
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

          <Controller
            name="interviewer_ids"
            control={form.control}
            render={({ field }) => (
              <FormItem className={styles.item}>
                <FormLabel>Interviewers</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={interviewerOptions}
                    selected={interviewerOptions.filter(
                      (option) => option.value && selectedInterviewers.includes(option.value),
                    )}
                    onChange={(values) => {
                      field.onChange(values);
                    }}
                    optionsLabel="Available Interviewers"
                    selectedLabel="Selected Interviewers"
                    selectAllBtnTxt="Select All"
                    unselectAllBtnTxt="Unselect All"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" rounded={true} theme="green">
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
