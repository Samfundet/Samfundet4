import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { Button, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '~/Components';
import { setRecruitmentApplicationInterview } from '~/api';
import type { RecruitmentApplicationDto, RecruitmentPositionDto, UserDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import { dbT } from '~/utils';
import { Text } from '../Text/Text';
import styles from './InterviewForm.module.scss';

type InterviewFormProps = {
  application: Pick<RecruitmentApplicationDto, 'id' | 'interview'> & {
    user: Pick<UserDto, 'first_name' | 'last_name'>;
    recruitment_position: Pick<RecruitmentPositionDto, 'name_nb' | 'name_en'>;
  };
};

const interviewFormSchema = z.object({
  interview_time: z.string().min(1),
  interview_location: z.string().min(1),
});

type InterviewFormType = z.infer<typeof interviewFormSchema>;

/** Formats an ISO datetime string for use in a datetime-local input. */
function toDatetimeLocalValue(isoString: string | undefined): string {
  if (!isoString) {
    return '';
  }
  const date = new Date(isoString);
  return Number.isNaN(date.getTime()) ? '' : format(date, "yyyy-MM-dd'T'HH:mm");
}

export function InterviewForm({ application }: InterviewFormProps) {
  const { t } = useTranslation();

  const form = useForm<InterviewFormType>({
    resolver: zodResolver(interviewFormSchema),
    defaultValues: {
      interview_time: toDatetimeLocalValue(application?.interview?.interview_time),
      interview_location: application?.interview?.interview_location ?? '',
    },
  });

  function handleOnSubmit(data: InterviewFormType) {
    setRecruitmentApplicationInterview(application.id, data)
      .then(() => {
        toast.success(t(KEY.common_update_successful));
      })
      .catch((error) => {
        toast.error(t(KEY.common_something_went_wrong));
        console.error(error);
      });
  }

  return (
    <div className={styles.container}>
      <Text size="l" as="strong">
        {t(KEY.recruitment_interview_set)}
      </Text>
      <Text>
        {t(KEY.recruitment_applicant)}: {application.user.first_name} {application.user.last_name}
      </Text>
      <Text>
        {t(KEY.recruitment_position)}: {dbT(application.recruitment_position, 'name')}
      </Text>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleOnSubmit)}>
          <div className={styles.row}>
            <FormField
              control={form.control}
              name="interview_time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.recruitment_interview_time)}</FormLabel>
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
              name="interview_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.recruitment_interview_location)}</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit">{t(KEY.common_send)}</Button>
        </form>
      </Form>
    </div>
  );
}
