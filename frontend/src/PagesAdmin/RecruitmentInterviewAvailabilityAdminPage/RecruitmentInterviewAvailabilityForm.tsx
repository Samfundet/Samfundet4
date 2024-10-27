import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  H3,
  Input,
  MiniCalendar,
} from '~/Components';
import type { RecruitmentInterviewAvailabilityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import styles from './RecruitmentInterviewAvailabilityForm.module.scss';

type Props = {
  data?: RecruitmentInterviewAvailabilityDto;
};

const schema = z.object({
  start_date: z.string(),
  end_date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  timeslot_interval: z.number(),
});

type SchemaType = z.infer<typeof schema>;

export function RecruitmentInterviewAvailabilityForm({ data }: Props) {
  const { t } = useTranslation();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: data?.start_date,
      end_date: data?.end_date,
      start_time: data?.start_time,
      end_time: data?.end_time,
      timeslot_interval: data?.timeslot_interval || 30,
    },
  });

  function onSubmit(values: SchemaType) {
    console.log('Values:', values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className={styles.container}>
          <div>
            <div className={styles.row}>
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.start_date)}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.end_date)}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={styles.row}>
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.start_time)}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="HH:MM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.end_time)}</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="HH:MM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="timeslot_interval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.common_interval)}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <H3>{t(KEY.common_preview)}</H3>

            <MiniCalendar minDate={new Date()} maxDate={new Date()} baseDate={new Date()} displayLabel={true} />
          </div>
        </div>
        <div className={styles.action_row}>
          <Button type="submit" theme="green" rounded>
            {t(KEY.common_save)}
          </Button>
        </div>
      </form>
    </Form>
  );
}
