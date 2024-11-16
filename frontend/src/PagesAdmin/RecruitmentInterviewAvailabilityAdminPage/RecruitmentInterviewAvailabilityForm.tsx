import { zodResolver } from '@hookform/resolvers/zod';
import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import {
  Button,
  DatePicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  H3,
  Input,
  MiniCalendar,
  NumberInput,
} from '~/Components';
import { FormDescription } from '~/Components/Forms/Form';
import type { RecruitmentInterviewAvailabilityDto } from '~/dto';
import { KEY } from '~/i18n/constants';
import {
  AVAILABILITY_TIMESLOT_INTERVAL,
  AVAILABILITY_TIMESLOT_INTERVAL_MAX,
  AVAILABILITY_TIMESLOT_INTERVAL_MIN,
} from '~/schema/recruitment';
import styles from './RecruitmentInterviewAvailabilityForm.module.scss';

type Props = {
  data?: RecruitmentInterviewAvailabilityDto;
};

const schema = z.object({
  start_date: z.date(),
  end_date: z.date(),
  start_time: z.string(),
  end_time: z.string(),
  timeslot_interval: AVAILABILITY_TIMESLOT_INTERVAL,
});

type SchemaType = z.infer<typeof schema>;

export function RecruitmentInterviewAvailabilityForm({ data }: Props) {
  const [fromDate, setFromDate] = useState<Date | undefined>(new Date());
  const [toDate, setToDate] = useState<Date | undefined>(new Date());

  const { t } = useTranslation();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      start_date: data?.start_date ? new Date(data.start_date) : undefined,
      end_date: data?.end_date ? new Date(data.end_date) : undefined,
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
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.start_date)}</FormLabel>
                    <FormControl>
                      <DatePicker
                        onChange={(d) => {
                          setFromDate(d || undefined);
                          onChange(d);
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field: { onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>{t(KEY.end_date)}</FormLabel>
                    <FormControl>
                      <DatePicker
                        onChange={(d) => {
                          setToDate(d || undefined);
                          onChange(d);
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className={classNames(styles.row, styles.short_row)}>
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
                  <FormDescription>{t(KEY.interview_availability_interval_description)}</FormDescription>
                  <FormControl>
                    <NumberInput
                      min={AVAILABILITY_TIMESLOT_INTERVAL_MIN}
                      max={AVAILABILITY_TIMESLOT_INTERVAL_MAX}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <H3>{t(KEY.common_preview)}</H3>

            <MiniCalendar minDate={fromDate} maxDate={toDate} baseDate={fromDate} displayLabel={true} />
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
