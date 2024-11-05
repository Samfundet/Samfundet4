import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import type { DropdownOption } from '~/Components/Dropdown/Dropdown';
import { MultiSelect } from '~/Components/MultiSelect';
import {
  getRecruitmentPositions,
  postRecruitmentSharedInterviewGroup,
  putRecruitmentPosition,
  putRecruitmentSharedInterviewGroup,
} from '~/api';
import { KEY } from '~/i18n/constants';
import { reverse } from '~/named-urls';
import { ROUTES } from '~/routes';
import { NON_EMPTY_STRING } from '~/schema/strings';
import styles from './RecruitmentInterviewGroupFormAdminPage.module.scss';

const schema = z.object({
  name_nb: NON_EMPTY_STRING,
  name_en: NON_EMPTY_STRING,
  recruitment: NON_EMPTY_STRING,
  positions: z.number().array(),
});

type SchemaType = z.infer<typeof schema>;

interface FormProps {
  initialData: Partial<SchemaType>;
  sharedInterviewGroupId?: string;
  recruitmentId?: string;
}

export function RecruitmentInterviewGroupForm({ initialData, recruitmentId, sharedInterviewGroupId }: FormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const [positionOptions, setPositionOptions] = useState<DropdownOption<number>[]>([]);

  const submitText = sharedInterviewGroupId ? t(KEY.common_save) : t(KEY.common_create);

  useEffect(() => {
    console.log(initialData);
  }, [initialData]);

  useEffect(() => {
    if (recruitmentId) {
      getRecruitmentPositions(recruitmentId).then((response) => {
        setPositionOptions(
          response.data
            .filter(
              (position) =>
                !position.shared_interview_group ||
                (sharedInterviewGroupId && Number.parseInt(sharedInterviewGroupId) === position.shared_interview_group),
            )
            .map((position) => {
              return { value: position.id, label: `${position.name_nb} ${position.gang.name_nb}` };
            }),
        );
      });
    }
  }, [recruitmentId, sharedInterviewGroupId]);

  const onSubmit = (data: SchemaType) => {
    const updatedSharedInterviewGroup = {
      ...data,
      recruitment: recruitmentId ?? '',
    };

    const action = sharedInterviewGroupId
      ? putRecruitmentSharedInterviewGroup(sharedInterviewGroupId, updatedSharedInterviewGroup)
      : postRecruitmentSharedInterviewGroup(updatedSharedInterviewGroup);

    action
      .then(() => {
        toast.success(sharedInterviewGroupId ? t(KEY.common_update_successful) : t(KEY.common_creation_successful));
        navigate(
          reverse({
            pattern: ROUTES.frontend.admin_recruitment_gang_overview,
            urlParams: { recruitmentId },
          }),
        );
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  };

  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  return (
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
              name="positions"
              render={({ field }) => (
                <FormItem className={styles.item}>
                  <FormLabel>{`${t(KEY.common_name)} ${t(KEY.common_english)}`}</FormLabel>
                  <FormControl>
                    <MultiSelect {...field} options={positionOptions} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" rounded={true} theme="green">
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
